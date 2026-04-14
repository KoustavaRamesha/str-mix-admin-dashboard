'use client'

import React, { useEffect } from 'react'
import Lenis from 'lenis'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // Scroll duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function for smooth transitions
      // @ts-ignore - lenis types might be outdated or strict
      direction: 'vertical', // Scroll direction: vertical or horizontal
      gestureDirection: 'vertical', // Gesture direction: vertical, horizontal, or both
      smooth: true, // Enable smooth scrolling
      mouseMultiplier: 1, // Mouse scroll speed multiplier
      smoothTouch: false, // Disable smooth scrolling for touch devices
      touchMultiplier: 2, // Touch scroll speed multiplier
      infinite: false, // Disable infinite scroll
    });

    // Animation frame loop function
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>
}
