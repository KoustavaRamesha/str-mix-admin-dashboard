
'use client';

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, UploadTask as FirebaseUploadTask } from 'firebase/storage';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useStorage, addDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

interface UploadStatus {
  name: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

interface MediaUploadContextType {
  uploadQueue: { [key: string]: UploadStatus };
  uploadFiles: (files: FileList) => void;
  cancelUpload: (fileName: string) => void;
}

const MediaUploadContext = createContext<MediaUploadContextType | undefined>(undefined);

export function MediaUploadProvider({ children }: { children: React.ReactNode }) {
  const [uploadQueue, setUploadQueue] = useState<{ [key: string]: UploadStatus }>({});
  const activeTasks = useRef<{ [key: string]: FirebaseUploadTask }>({});
  const lastUpdateRef = useRef<{ [key: string]: number }>({});
  const db = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();

  const cancelUpload = useCallback((fileName: string) => {
    if (activeTasks.current[fileName]) {
      activeTasks.current[fileName].cancel();
      delete activeTasks.current[fileName];
      delete lastUpdateRef.current[fileName];
      setUploadQueue(prev => {
        const next = { ...prev };
        delete next[fileName];
        return next;
      });
      toast({ title: "Upload Cancelled", description: `Transfer of ${fileName} was stopped.` });
    }
  }, [toast]);

  const uploadFiles = useCallback((files: FileList) => {
    Array.from(files).forEach(file => {
      const timestamp = Date.now();
      const storagePath = `media/${timestamp}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      const task = uploadBytesResumable(storageRef, file);

      activeTasks.current[file.name] = task;
      lastUpdateRef.current[file.name] = 0;

      setUploadQueue(prev => ({
        ...prev,
        [file.name]: { name: file.name, progress: 0, status: 'uploading' }
      }));

      task.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          const now = Date.now();
          
          // Throttle state updates to max once every 150ms to keep UI efficient
          if (now - lastUpdateRef.current[file.name] > 150 || progress === 100) {
            lastUpdateRef.current[file.name] = now;
            setUploadQueue(prev => {
              if (!prev[file.name]) return prev;
              return {
                ...prev,
                [file.name]: { ...prev[file.name], progress }
              };
            });
          }
        },
        (error) => {
          if (error.code === 'storage/canceled') return;
          
          setUploadQueue(prev => {
            const next = { ...prev };
            if (next[file.name]) next[file.name].status = 'error';
            return next;
          });
          delete activeTasks.current[file.name];
          delete lastUpdateRef.current[file.name];
          toast({ variant: "destructive", title: "Upload Failed", description: error.message });
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(task.snapshot.ref);
            
            const assetData = {
              name: file.name,
              url: downloadURL,
              type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'doc',
              size: file.size,
              mimeType: file.type,
              storagePath: storageRef.fullPath,
              createdAt: new Date().toISOString()
            };

            addDocumentNonBlocking(collection(db, 'media_library'), assetData);
            
            delete activeTasks.current[file.name];
            delete lastUpdateRef.current[file.name];
            setUploadQueue(prev => {
              const next = { ...prev };
              delete next[file.name];
              return next;
            });
            
            toast({ title: "Asset Uploaded", description: `${file.name} is now available.` });
          } catch (e: any) {
            toast({ variant: "destructive", title: "Finalization Failed", description: "Could not retrieve file URL." });
          }
        }
      );
    });
  }, [db, storage, toast]);

  const value = React.useMemo(() => ({
    uploadQueue,
    uploadFiles,
    cancelUpload
  }), [uploadQueue, uploadFiles, cancelUpload]);

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
