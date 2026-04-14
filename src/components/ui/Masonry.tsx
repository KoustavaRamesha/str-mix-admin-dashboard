import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

import './Masonry.css';

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const get = () => {
    if (typeof window === 'undefined') return defaultValue;
    return values[queries.findIndex(q => window.matchMedia(q).matches)] ?? defaultValue;
  };

  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => setValue(get);
    queries.forEach(q => window.matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => window.matchMedia(q).removeEventListener('change', handler));
  }, [queries]);

  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

interface MasonryProps {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'random';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  renderItem,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false
}) => {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [3, 2, 2, 1],
    1
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [layoutItems, setLayoutItems] = useState<any[]>([]);
  const [containerHeight, setContainerHeight] = useState(0);
  const itemRefs = useRef<Map<string | number, HTMLDivElement>>(new Map());
  const hasMounted = useRef(false);

  const calculateLayout = () => {
    if (!width || items.length === 0) return;

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;
    const gap = 24; // Standardized industrial gap
    const padding = 12;

    const newLayout = items.map((item) => {
      const el = itemRefs.current.get(item.id);
      // We measure the element's actual height. If not available yet, we fallback.
      const measuredHeight = el ? el.getBoundingClientRect().height : 300;

      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const y = colHeights[col];

      colHeights[col] += measuredHeight + gap;

      return {
        id: item.id,
        x,
        y,
        w: columnWidth - padding,
        h: measuredHeight,
      };
    });

    setLayoutItems(newLayout);
    setContainerHeight(Math.max(...colHeights));
  };

  // Synchronize layout calculation
  useLayoutEffect(() => {
    calculateLayout();
  }, [width, items, columns]);

  // Ensure measurements are accurate after images/content load
  useEffect(() => {
    const timeout = setTimeout(calculateLayout, 250);
    window.addEventListener('load', calculateLayout);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('load', calculateLayout);
    };
  }, [items]);

  // GSAP animation logic
  useLayoutEffect(() => {
    if (!layoutItems.length) return;

    layoutItems.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      
      if (!hasMounted.current) {
        const initialPos = getInitialPosition(item);
        const initialState = {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          width: item.w,
          ...(blurToFocus && { filter: 'blur(10px)' })
        };

        gsap.fromTo(selector, initialState, {
          opacity: 1,
          x: item.x,
          y: item.y,
          width: item.w,
          ...(blurToFocus && { filter: 'blur(0px)' }),
          duration: 0.8,
          ease: 'power3.out',
          delay: index * stagger,
          overwrite: 'auto'
        });
      } else {
        gsap.to(selector, {
          x: item.x,
          y: item.y,
          width: item.w,
          duration: duration,
          ease: ease,
          overwrite: 'auto'
        });
      }
    });

    hasMounted.current = true;
  }, [layoutItems]);

  const getInitialPosition = (item: any) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;

    if (animateFrom === 'random') {
      const directions = ['top', 'bottom', 'left', 'right'];
      direction = directions[Math.floor(Math.random() * directions.length)] as any;
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: -200 };
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 200 };
      case 'left':
        return { x: -200, y: item.y };
      case 'right':
        return { x: window.innerWidth + 200, y: item.y };
      case 'center':
        return {
          x: containerRect.width / 2,
          y: containerRect.height / 2
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="list" 
      style={{ 
        height: containerHeight, 
        minHeight: items.length > 0 ? '400px' : '0px',
        position: 'relative',
        transition: 'height 0.4s ease-out'
      }}
    >
      {items.map((item, index) => (
        <div 
          key={item.id} 
          data-key={item.id} 
          ref={(el) => { if (el) itemRefs.current.set(item.id, el); }}
          className="item-wrapper"
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0,
            width: width ? (width / columns) - 12 : '100%',
            opacity: hasMounted.current ? 1 : 0
          }}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};

export default Masonry;
