
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Singleton instances to prevent internal assertion errors
let appInstance: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;
let storageInstance: FirebaseStorage | undefined;

/**
 * Returns the SDK instances associated with the provided app.
 * Uses cached instances to maintain a stable state.
 */
export function getSdks(app: FirebaseApp) {
  if (!authInstance) authInstance = getAuth(app);
  if (!dbInstance) dbInstance = getFirestore(app);
  if (!storageInstance) storageInstance = getStorage(app);
  
  return {
    firebaseApp: app,
    auth: authInstance,
    firestore: dbInstance,
    storage: storageInstance
  };
}

/**
 * Initializes the Firebase Client SDKs as singletons.
 * Handles the fallback between automatic environment initialization and config object.
 */
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    // Basic fallback for server side rendering if needed
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    return getSdks(app);
  }

  if (!appInstance) {
    if (getApps().length > 0) {
      appInstance = getApp();
    } else {
      try {
        // Attempt to initialize via Firebase App Hosting environment variables
        appInstance = initializeApp();
      } catch (e) {
        // Fallback to local config object
        appInstance = initializeApp(firebaseConfig);
      }
    }
  }

  return getSdks(appInstance);
}
