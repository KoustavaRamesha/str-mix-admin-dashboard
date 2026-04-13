
'use client';

import React, { createContext, useContext, useState, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, UploadTask as FirebaseUploadTask } from 'firebase/storage';
import { collection } from 'firebase/firestore';
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
  const db = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();

  const cancelUpload = (fileName: string) => {
    if (activeTasks.current[fileName]) {
      activeTasks.current[fileName].cancel();
      delete activeTasks.current[fileName];
      setUploadQueue(prev => {
        const next = { ...prev };
        delete next[fileName];
        return next;
      });
      toast({ title: "Upload Cancelled", description: `Transfer of ${fileName} was stopped.` });
    }
  };

  const uploadFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      const storagePath = `media/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      const task = uploadBytesResumable(storageRef, file);

      activeTasks.current[file.name] = task;

      setUploadQueue(prev => ({
        ...prev,
        [file.name]: { name: file.name, progress: 0, status: 'uploading' }
      }));

      task.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadQueue(prev => ({
            ...prev,
            [file.name]: { ...prev[file.name], progress }
          }));
        },
        (error) => {
          // Handle cancellation or genuine errors
          if (error.code === 'storage/canceled') {
            return;
          }
          
          setUploadQueue(prev => ({
            ...prev,
            [file.name]: { ...prev[file.name], status: 'error' }
          }));
          delete activeTasks.current[file.name];
          toast({ variant: "destructive", title: "Upload Failed", description: error.message });
        },
        async () => {
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
          setUploadQueue(prev => {
            const next = { ...prev };
            delete next[file.name];
            return next;
          });
          
          toast({ title: "Asset Uploaded", description: `${file.name} is now available.` });
        }
      );
    });
  };

  return (
    <MediaUploadContext.Provider value={{ uploadQueue, uploadFiles, cancelUpload }}>
      {children}
    </MediaUploadContext.Provider>
  );
}

export const useMediaUpload = () => {
  const context = useContext(MediaUploadContext);
  if (!context) throw new Error('useMediaUpload must be used within a MediaUploadProvider');
  return context;
};
