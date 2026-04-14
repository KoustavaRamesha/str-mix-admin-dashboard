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
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useFirestore, useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

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
  uploadFiles: (files: FileList) => Promise<void>;
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

  const activeTasks = useRef<Record<string, boolean>>({});
  const lastUpdateRef = useRef<Record<string, number>>({});
  const pendingQueue = useRef<Array<{ file: File; id: string }>>([]);
  const attemptsRef = useRef<Record<string, number>>({});
  const activeCount = useRef(0);

  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      // Supabase upload requests are not resumable/cancelable with current client flow.
      activeTasks.current = {};
    };
  }, []);

  const startUpload = useCallback(
    async (file: File, id: string, isRetry = false) => {
      if (!db) return;
      activeCount.current += 1;

      const safeName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
      const storagePath = `${id}_${safeName}`;
      activeTasks.current[id] = true;
      lastUpdateRef.current[id] = 0;

      if (isRetry) {
        dispatch({ type: 'RETRY', id });
      } else {
        dispatch({ type: 'START', id });
        attemptsRef.current[id] = 0;
      }

      dispatch({ type: 'PROGRESS', id, progress: 15 });
      try {
        const { error: uploadError } = await supabase.storage
          .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'media')
          .upload(storagePath, file, { cacheControl: '3600', upsert: false, contentType: file.type });

        if (uploadError) {
          throw uploadError;
        }

        dispatch({ type: 'PROGRESS', id, progress: 80 });

        const { data: publicData } = supabase.storage
          .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'media')
          .getPublicUrl(storagePath);

        if (!publicData?.publicUrl) {
          throw new Error('Could not generate public URL from Supabase.');
        }

        dispatch({ type: 'COMPLETE', id });
        const assetData = {
          name: file.name,
          url: publicData.publicUrl,
          type: file.type.startsWith('image/')
            ? 'image'
            : file.type.startsWith('video/')
            ? 'video'
            : file.type === 'application/pdf'
            ? 'pdf'
            : 'doc',
          size: file.size,
          mimeType: file.type,
          storagePath,
          createdAt: serverTimestamp(),
        };

        await addDoc(collection(db, 'media_library'), assetData);

        setTimeout(() => {
          dispatch({ type: 'REMOVE', id });
          delete activeTasks.current[id];
          delete lastUpdateRef.current[id];
          delete attemptsRef.current[id];
        }, 800);

        toast({ title: 'Asset Registered', description: `${file.name} is now available in your library.` });
      } catch (error: any) {
        const currentAttempt = attemptsRef.current[id] ?? 0;
        const isRetriable = currentAttempt < MAX_RETRY_ATTEMPTS;
        if (isRetriable) {
          attemptsRef.current[id] = currentAttempt + 1;
          toast({
            title: 'Retrying Upload',
            description: `${file.name}: transient error, retrying (${currentAttempt + 1}/${MAX_RETRY_ATTEMPTS})...`,
          });
          setTimeout(() => {
            delete activeTasks.current[id];
            delete lastUpdateRef.current[id];
            activeCount.current = Math.max(0, activeCount.current - 1);
            startUpload(file, id, true);
          }, RETRY_DELAY_MS);
          return;
        }

        if (process.env.NODE_ENV === 'development') {
          console.error(`Upload error for ${file.name}:`, error);
        }
        dispatch({ type: 'ERROR', id });
        delete activeTasks.current[id];
        delete lastUpdateRef.current[id];
        delete attemptsRef.current[id];
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: `${file.name}: ${error?.message ?? 'Supabase upload failed.'}`,
        });
      } finally {
        activeCount.current = Math.max(0, activeCount.current - 1);
        drainQueue();
      }
    },
    [db, toast],
  );

  const drainQueue = useCallback(() => {
    while (activeCount.current < MAX_CONCURRENT && pendingQueue.current.length > 0) {
      const next = pendingQueue.current.shift()!;
      startUpload(next.file, next.id);
    }
  }, [startUpload]);

  const uploadFiles = useCallback(
    async (files: FileList) => {
      try {
        // Snapshot FileList immediately; input reset can invalidate live FileList.
        const selectedFiles = Array.from(files);
        if (selectedFiles.length === 0) {
          toast({
            variant: 'destructive',
            title: 'No Files Detected',
            description: 'Please select file(s) again and retry upload.',
          });
          return;
        }

        toast({
          title: 'Upload Request Received',
          description: `Preparing ${selectedFiles.length} file(s) for transfer...`,
        });

        if (!db) {
          toast({
            variant: 'destructive',
            title: 'Service Unavailable',
            description: 'Firestore is not initialised.',
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

        const adminRoleRef = doc(db, 'roles_admin', auth.currentUser.uid);
        const adminRoleSnap = await getDoc(adminRoleRef);
        const adminRole = adminRoleSnap.data()?.role;
        const hasElevatedRole =
          adminRole === undefined || adminRole === 'admin' || adminRole === 'super_admin';
        if (!adminRoleSnap.exists() || !hasElevatedRole) {
          toast({
            variant: 'destructive',
            title: 'Access Denied',
            description: 'Your account is not authorised for media uploads.',
          });
          return;
        }

        selectedFiles.forEach((file) => {
          const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
          dispatch({ type: 'ENQUEUE', id, name: file.name });

          if (activeCount.current < MAX_CONCURRENT) {
            startUpload(file, id);
          } else {
            pendingQueue.current.push({ file, id });
          }
        });

        toast({
          title: 'Upload Enqueued',
          description: `${selectedFiles.length} file(s) entered the upload queue.`,
        });
      } catch (error: any) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Upload initialisation failed:', error);
        }
        toast({
          variant: 'destructive',
          title: 'Upload Initialisation Failed',
          description: error?.message ?? 'Could not validate admin access. Please try again.',
        });
      }
    },
    [db, auth, toast, startUpload],
  );

  const cancelUpload = useCallback(
    (id: string) => {
      if (activeTasks.current[id]) {
        // In-flight Supabase upload cancellation is not currently supported.
        delete activeTasks.current[id];
        delete lastUpdateRef.current[id];
        delete attemptsRef.current[id];
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
