
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
        // Write to a dedicated public_stats document that has relaxed write rules
        // instead of settings/global which requires isSuperAdmin()
        const statsRef = doc(db, 'public_stats', 'counters');
        
        try {
          // Increment the visitor count atomically.
          // Use setDoc with merge as a fallback if the doc doesn't exist.
          await setDoc(statsRef, {
            visitorCount: increment(1),
            lastVisit: new Date().toISOString(),
          }, { merge: true });
          
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
