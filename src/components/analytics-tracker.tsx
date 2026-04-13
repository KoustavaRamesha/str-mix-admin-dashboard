
'use client';

import { useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { doc, updateDoc, increment, setDoc } from 'firebase/firestore';

export function AnalyticsTracker() {
  const db = useFirestore();

  useEffect(() => {
    // Only track if we have access to Firestore and we're in a browser environment
    if (!db || typeof window === 'undefined') return;

    const trackVisit = async () => {
      // Use sessionStorage to only count once per session
      const hasVisited = sessionStorage.getItem('strmix_session_tracked');
      
      if (!hasVisited) {
        const statsRef = doc(db, 'settings', 'global');
        
        try {
          // Increment the visitor count. Using updateDoc with increment is atomical.
          // We use setDoc with merge: true as a fallback if the doc doesn't exist.
          await updateDoc(statsRef, {
            visitorCount: increment(1)
          }).catch(async (err) => {
            // If doc doesn't exist, initialize it
            if (err.code === 'not-found') {
              await setDoc(statsRef, { visitorCount: 1 }, { merge: true });
            }
          });
          
          sessionStorage.setItem('strmix_session_tracked', 'true');
        } catch (error) {
          // Silent failure for analytics to not disturb user experience
          console.debug('Analytics tracking skipped');
        }
      }
    };

    trackVisit();
  }, [db]);

  return null;
}
