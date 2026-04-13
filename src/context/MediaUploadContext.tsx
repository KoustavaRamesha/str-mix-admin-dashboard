
'use client';

import React, { createContext, useContext, useState, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection } from 'firebase/firestore';
import { useFirestore, useStorage, addDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

interface UploadTask {
  name: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

interface MediaUploadContextType {
  uploadQueue: { [key: string]: UploadTask };
  uploadFiles: (files: FileList) => void;
}

const MediaUploadContext = createContext<MediaUploadContextType | undefined>(undefined);

export function MediaUploadProvider({ children }: { children: React.ReactNode }) {
  const [uploadQueue, setUploadQueue] = useState<{ [key: string]: UploadTask }>({});
  const db = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();

  const uploadFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      const storageRef = ref(storage, `media/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploadQueue(prev => ({
        ...prev,
        [file.name]: { name: file.name, progress: 0, status: 'uploading' }
      }));

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadQueue(prev => ({
            ...prev,
            [file.name]: { ...prev[file.name], progress }
          }));
        },
        (error) => {
          setUploadQueue(prev => ({
            ...prev,
            [file.name]: { ...prev[file.name], status: 'error' }
          }));
          toast({ variant: "destructive", title: "Upload Failed", description: error.message });
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
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
    <MediaUploadContext.Provider value={{ uploadQueue, uploadFiles }}>
      {children}
    </MediaUploadContext.Provider>
  );
}

export const useMediaUpload = () => {
  const context = useContext(MediaUploadContext);
  if (!context) throw new Error('useMediaUpload must be used within a MediaUploadProvider');
  return context;
};
