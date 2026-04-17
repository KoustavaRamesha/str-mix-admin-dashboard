
'use client';

import { useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { doc, increment, setDoc, updateDoc } from 'firebase/firestore';

const VISITOR_TRACK_KEY = 'strmix_last_visitor_track';
const VISITOR_TRACK_TTL_MS = 30 * 60 * 1000;

export function AnalyticsTracker() {
  const db = useFirestore();

  useEffect(() => {
    // Only track if we have access to Firestore and we're in a browser environment
    if (!db || typeof window === 'undefined') return;

    const trackVisit = async () => {
      const lastTrackedRaw = window.localStorage.getItem(VISITOR_TRACK_KEY);
      const lastTrackedAt = lastTrackedRaw ? Number(lastTrackedRaw) : 0;

      // Count a new visit after the TTL expires so refreshes don't inflate traffic.
      if (lastTrackedAt && Date.now() - lastTrackedAt < VISITOR_TRACK_TTL_MS) {
        return;
      }

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

        window.localStorage.setItem(VISITOR_TRACK_KEY, String(Date.now()));
      } catch (error) {
        // Keep the site quiet, but leave a breadcrumb for debugging on Vercel.
        console.warn('Analytics tracking skipped:', error);
      }
    };

    trackVisit();
  }, [db]);

  return null;
}
