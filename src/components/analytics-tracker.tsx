
'use client';

import { useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { doc, increment, setDoc, updateDoc } from 'firebase/firestore';

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
        const now = new Date();
        const monthKey = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
        const dayKey = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
        
        try {
          // Ensure analytics document exists, then atomically increment lifetime + monthly + daily counters.
          await setDoc(statsRef, {
            visitorCount: 0,
            monthlyVisitors: {},
            dailyVisitors: {},
            lastVisit: null,
          }, { merge: true });

          await updateDoc(statsRef, {
            visitorCount: increment(1),
            lastVisit: now.toISOString(),
            [`monthlyVisitors.${monthKey}`]: increment(1),
            [`dailyVisitors.${dayKey}`]: increment(1),
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
