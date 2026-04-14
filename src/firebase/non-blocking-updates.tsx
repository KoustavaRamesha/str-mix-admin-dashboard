'use client';
    
import {
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentReference,
  SetOptions,
  FirestoreError,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import {FirestorePermissionError} from '@/firebase/errors';

/**
 * Handles Firestore errors by differentiating between permission errors,
 * network issues, and other failures.
 */
function handleFirestoreError(
  error: unknown,
  path: string,
  operation: 'create' | 'update' | 'delete' | 'write',
  data?: Record<string, unknown>
) {
  const firestoreError = error as FirestoreError;
  const code = firestoreError?.code;

  if (code === 'permission-denied' || code === 'unauthenticated') {
    // Genuine permission error — emit to error boundary
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path,
        operation,
        requestResourceData: data,
      })
    );
  } else if (code === 'unavailable' || code === 'deadline-exceeded') {
    // Network issue — log warning, Firestore SDK will auto-retry
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Firestore] Network issue on ${operation} to ${path}:`, code);
    }
  } else if (code === 'not-found') {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Firestore] Document not found on ${operation} to ${path}`);
    }
  } else {
    // Unexpected error — log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error(`[Firestore] Unexpected error on ${operation} to ${path}:`, error);
    }
  }
}

/**
 * Initiates a setDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function setDocumentNonBlocking(
  docRef: DocumentReference,
  data: Record<string, unknown>,
  options: SetOptions
) {
  setDoc(docRef, data, options).catch(error => {
    handleFirestoreError(error, docRef.path, 'write', data);
  });
}


/**
 * Initiates an addDoc operation for a collection reference.
 * Does NOT await the write operation internally.
 * Returns the Promise for the new doc ref, but typically not awaited by caller.
 */
export function addDocumentNonBlocking(
  colRef: CollectionReference,
  data: Record<string, unknown>
) {
  const promise = addDoc(colRef, data)
    .catch(error => {
      handleFirestoreError(error, colRef.path, 'create', data);
    });
  return promise;
}


/**
 * Initiates an updateDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function updateDocumentNonBlocking(
  docRef: DocumentReference,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>
) {
  updateDoc(docRef, data)
    .catch(error => {
      handleFirestoreError(error, docRef.path, 'update', data);
    });
}


/**
 * Initiates a deleteDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function deleteDocumentNonBlocking(docRef: DocumentReference) {
  deleteDoc(docRef)
    .catch(error => {
      handleFirestoreError(error, docRef.path, 'delete');
    });
}