'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTask as FirebaseUploadTask,
} from 'firebase/storage';
import { collection } from 'firebase/firestore';
import { useFirestore, useStorage, useAuth, addDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

// ─── Constants ───────────────────────────────────────────────────────────────

const THROTTLE_MS = 150;          // Progress UI update interval
const MAX_CONCURRENT = 4;         // Max simultaneous Firebase uploads
const MAX_RETRY_ATTEMPTS = 2;     // Retries for transient errors
const RETRY_DELAY_MS = 2_000;     // Delay between retries

// ─── Types ───────────────────────────────────────────────────────────────────

interface UploadStatus {
  id: string;
  name: string;
  progress: number;
  status: 'queued' | 'uploading' | 'completed' | 'error';
  attempt: number;
}

type UploadAction =
  | { type: 'ENQUEUE'; id: string; name: string }
  | { type: 'START'; id: string }
  | { type: 'PROGRESS'; id: string; progress: number }
  | { type: 'COMPLETE'; id: string }
  | { type: 'ERROR'; id: string }
  | { type: 'REMOVE'; id: string }
  | { type: 'RETRY'; id: string };

interface MediaUploadContextType {
  uploadQueue: Record<string, UploadStatus>;
  uploadFiles: (files: FileList) => void;
  cancelUpload: (id: string) => void;
  retryUpload: (id: string) => void;
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function uploadReducer(
  state: Record<string, UploadStatus>,
  action: UploadAction,
): Record<string, UploadStatus> {
  switch (action.type) {
    case 'ENQUEUE':
      return {
        ...state,
        [action.id]: { id: action.id, name: action.name, progress: 0, status: 'queued', attempt: 0 },
      };
    case 'START':
      return state[action.id]
        ? { ...state, [action.id]: { ...state[action.id], status: 'uploading' } }
        : state;
    case 'PROGRESS':
      if (!state[action.id] || state[action.id].status !== 'uploading') return state;
      return { ...state, [action.id]: { ...state[action.id], progress: action.progress } };
    case 'COMPLETE':
      return state[action.id]
        ? { ...state, [action.id]: { ...state[action.id], progress: 100, status: 'completed' } }
        : state;
    case 'ERROR':
      return state[action.id]
        ? { ...state, [action.id]: { ...state[action.id], status: 'error' } }
        : state;
    case 'RETRY':
      return state[action.id]
        ? {
            ...state,
            [action.id]: {
              ...state[action.id],
              status: 'uploading',
              progress: 0,
              attempt: state[action.id].attempt + 1,
            },
          }
        : state;
    case 'REMOVE': {
      const next = { ...state };
      delete next[action.id];
      return next;
    }
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const MediaUploadContext = createContext<MediaUploadContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function MediaUploadProvider({ children }: { children: React.ReactNode }) {
  const [uploadQueue, dispatch] = useReducer(uploadReducer, {});

  const activeTasks = useRef<Record<string, FirebaseUploadTask>>({});
  const lastUpdateRef = useRef<Record<string, number>>({});
  const pendingQueue = useRef<Array<{ file: File; id: string }>>([]);
  const activeCount = useRef(0);

  const db = useFirestore();
  const storage = useStorage();
  const auth = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      Object.values(activeTasks.current).forEach((task) => task.cancel());
    };
  }, []);

  const startUpload = useCallback(
    (file: File, id: string, isRetry = false) => {
      if (!storage || !db) return;

      activeCount.current += 1;

      const safeName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
      const storagePath = `media/${id}_${safeName}`;
      const storageRef = ref(storage, storagePath);

      const task = uploadBytesResumable(storageRef, file);
      activeTasks.current[id] = task;
      lastUpdateRef.current[id] = 0;

      if (isRetry) {
        dispatch({ type: 'RETRY', id });
      } else {
        dispatch({ type: 'START', id });
      }

      task.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          const now = Date.now();
          if (now - lastUpdateRef.current[id] >= THROTTLE_MS) {
            lastUpdateRef.current[id] = now;
            dispatch({ type: 'PROGRESS', id, progress });
          }
        },
        (error) => {
          if (error.code === 'storage/canceled') {
            activeCount.current = Math.max(0, activeCount.current - 1);
            drainQueue();
            return;
          }

          const currentAttempt = uploadQueue[id]?.attempt ?? 0;
          const isRetriable =
            error.code === 'storage/unknown' || error.code === 'storage/retry-limit-exceeded';

          if (isRetriable && currentAttempt < MAX_RETRY_ATTEMPTS) {
            toast({
              title: 'Retrying Upload',
              description: `${file.name}: transient error, retrying (${currentAttempt + 1}/${MAX_RETRY_ATTEMPTS})…`,
            });
            setTimeout(() => {
              delete activeTasks.current[id];
              delete lastUpdateRef.current[id];
              activeCount.current = Math.max(0, activeCount.current - 1);
              startUpload(file, id, true);
            }, RETRY_DELAY_MS);
            return;
          }

          console.error(`Upload error for ${file.name}:`, error);
          dispatch({ type: 'ERROR', id });
          delete activeTasks.current[id];
          delete lastUpdateRef.current[id];
          activeCount.current = Math.max(0, activeCount.current - 1);
          drainQueue();

          const messages: Record<string, string> = {
            'storage/unauthorized': 'Access denied — check your security rules.',
            'storage/quota-exceeded': 'Storage quota exceeded.',
            'storage/unknown': 'Server error. Please try again.',
          };
          const message = messages[error.code] ?? 'An unknown error occurred during transfer.';
          toast({ variant: 'destructive', title: 'Upload Failed', description: `${file.name}: ${message}` });
        },
        async () => {
          try {
            dispatch({ type: 'COMPLETE', id });

            const downloadURL = await getDownloadURL(task.snapshot.ref);
            const assetData = {
              name: file.name,
              url: downloadURL,
              type: file.type.startsWith('image/')
                ? 'image'
                : file.type.startsWith('video/')
                ? 'video'
                : file.type === 'application/pdf'
                ? 'pdf'
                : 'doc',
              size: file.size,
              mimeType: file.type,
              storagePath: storageRef.fullPath,
              createdAt: new Date().toISOString(),
            };

            addDocumentNonBlocking(collection(db, 'media_library'), assetData);

            setTimeout(() => {
              dispatch({ type: 'REMOVE', id });
              delete activeTasks.current[id];
              delete lastUpdateRef.current[id];
            }, 800);

            toast({ title: 'Asset Registered', description: `${file.name} is now available in your library.` });
          } catch (e: any) {
            console.error('Finalization error:', e);
            dispatch({ type: 'ERROR', id });
            toast({
              variant: 'destructive',
              title: 'Registration Error',
              description: `Uploaded but could not register metadata for ${file.name}.`,
            });
          } finally {
            activeCount.current = Math.max(0, activeCount.current - 1);
            drainQueue();
          }
        },
      );
    },
    [db, storage, toast, uploadQueue],
  );

  const drainQueue = useCallback(() => {
    while (activeCount.current < MAX_CONCURRENT && pendingQueue.current.length > 0) {
      const next = pendingQueue.current.shift()!;
      startUpload(next.file, next.id);
    }
  }, [startUpload]);

  const uploadFiles = useCallback(
    (files: FileList) => {
      if (!storage || !db) {
        toast({
          variant: 'destructive',
          title: 'Service Unavailable',
          description: 'Firebase Storage or Firestore is not initialised.',
        });
        return;
      }

      if (!auth?.currentUser) {
        toast({
          variant: 'destructive',
          title: 'Unauthorised',
          description: 'You must be signed in to upload files.',
        });
        return;
      }

      Array.from(files).forEach((file) => {
        const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        dispatch({ type: 'ENQUEUE', id, name: file.name });

        if (activeCount.current < MAX_CONCURRENT) {
          startUpload(file, id);
        } else {
          pendingQueue.current.push({ file, id });
        }
      });
    },
    [db, storage, auth, toast, startUpload],
  );

  const cancelUpload = useCallback(
    (id: string) => {
      if (activeTasks.current[id]) {
        activeTasks.current[id].cancel();
        delete activeTasks.current[id];
        delete lastUpdateRef.current[id];
      } else {
        pendingQueue.current = pendingQueue.current.filter((item) => item.id !== id);
      }

      dispatch({ type: 'REMOVE', id });
      toast({ title: 'Upload Cancelled', description: 'Transfer was stopped.' });
    },
    [toast],
  );

  const retryUpload = useCallback(
    (id: string) => {
      const entry = uploadQueue[id];
      if (!entry || entry.status !== 'error') return;
      toast({
        title: 'Re-select File',
        description: `Please drag "${entry.name}" again to retry.`,
      });
    },
    [uploadQueue, toast],
  );

  const value = useMemo(
    () => ({ uploadQueue, uploadFiles, cancelUpload, retryUpload }),
    [uploadQueue, uploadFiles, cancelUpload, retryUpload],
  );

  return (
    <MediaUploadContext.Provider value={value}>
      {children}
    </MediaUploadContext.Provider>
  );
}

export const useMediaUpload = () => {
  const context = useContext(MediaUploadContext);
  if (!context) throw new Error('useMediaUpload must be used within a MediaUploadProvider');
  return context;
};
