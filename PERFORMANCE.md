# Performance Optimization Guide

## Build Analysis

### Bundle Size Breakdown
- **Total First Load JS**: ~121 KB (ideal target: <100 KB)
- **Admin Dashboard**: 342 KB (complex admin features - acceptable)
- **Shared JS**: 102 KB
- **Routes**: 18 static pages pre-rendered for fast loading

### Performance Metrics

```
Main Bundle (102 KB shared):
├── chunks/1255-55f5611cfd370a3f.js (45.7 KB) - UI components
├── chunks/4bd1b696-100b9d70ed4e49c1.js (54.2 KB) - React runtime
└── other (2.05 KB)
```

## Optimization Recommendations

### 1. Bundle Size Optimization (High Impact)

#### Issue: Large shared component bundle (45.7 + 54.2 = ~100 KB)

**Solutions:**
```bash
# Analyze what's in the bundles
npm install --save-dev webpack-bundle-analyzer

# Add to next.config.ts to enable analysis:
# const withBundleAnalyzer = require('@next/bundle-analyzer')({
#   enabled: process.env.ANALYZE === 'true',
# })
# export default withBundleAnalyzer(nextConfig)

# Run analysis:
ANALYZE=true npm run build
```

#### Tree-Shaking Improvements:
1. Review `src/lib/placeholder-images.ts` - may contain unused images
2. Check if all Radix UI components are necessary
3. Consider dynamic imports for admin pages:
   ```typescript
   // Instead of:
   import AdminDashboard from '@/components/admin'
   
   // Use:
   const AdminDashboard = dynamic(() => import('@/components/admin'), {
     loading: () => <div>Loading...</div>,
     ssr: false // Don't render on server if not needed
   })
   ```

### 2. Image Optimization (Medium Impact)

Currently using external image services (Unsplash, Picsum, Firebase). Optimize:

```typescript
// In next.config.ts - Add image optimization
images: {
  formats: ['image/avif', 'image/webp'],
  // Already added: minimumCacheTTL: 3600
},

// In components - Use proper Next.js Image component
import Image from 'next/image'

// ✅ Good: with width/height
<Image 
  src="/hero.jpg" 
  alt="Hero"
  width={1920}
  height={1080}
  priority // For above-fold images
/>

// ❌ Bad: with fill that isn't properly contained
<Image src="/hero.jpg" fill />
```

### 3. Code Splitting for Admin Dashboard (Medium Impact)

Currently admin dashboard is 342 KB. Split by route:

```typescript
// src/app/admin/layout.tsx - Use layout-level splitting
'use client'

export default function AdminLayout({ children }) {
  return (
    <Suspense fallback={<AdminLoading />}>
      {children}
    </Suspense>
  )
}
```

### 4. Route Prefetching Optimization (Low Impact)

Next.js prefetches links automatically. For better UX:

```typescript
// src/components/navbar.tsx - Add prefetch optimization
import Link from 'next/link'

// Prefetch only critical routes on hover
<Link href="/blog" prefetch={true}>Blog</Link>

// Don't prefetch heavy admin pages on homepage
<Link href="/admin" prefetch={false}>Admin</Link>
```

### 5. Component-Level Optimizations

#### Memoization:
```typescript
// Memoize expensive components
import { memo } from 'react'

export const HeroSection = memo(function HeroSection() {
  // Component code
})
```

#### Lazy Load Below-the-Fold Content:
```typescript
// Use React.lazy for non-critical sections
const BlogPreview = lazy(() => import('@/components/blog-preview'))

export default function Home() {
  return (
    <>
      <HeroSection /> {/* Critical - Load immediately */}
      <Suspense fallback={<BlogSkeleton />}>
        <BlogPreview /> {/* Load on demand */}
      </Suspense>
    </>
  )
}
```

### 6. Firebase Performance (Medium Impact)

Current Firebase usage in build:
- ✅ Client-side only (good)
- ⚠️ Imports AI SDK that adds 45+ KB

**Optimize:**
```typescript
// Only import needed Firebase modules
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// Don't import what you don't use

// For AI features, consider lazy loading:
const { genkit } = await import('genkit')
```

### 7. Monitoring and Metrics

Add performance monitoring:

```bash
npm install --save web-vitals
```

```typescript
// src/app/layout.tsx
import { reportWebVitals } from 'next/vitals'

export function reportWebVitals(metric) {
  console.log(metric)
  // Send to analytics service
}
```

### 8. Specific Performance Actions

#### Priority 1 (Do Now):
- [ ] Run `npm install --save-dev @next/bundle-analyzer` and analyze bundles
- [ ] Verify all Radix UI components are actually used
- [ ] Check Safari/mobile performance on iPhone

#### Priority 2 (This Week):
- [ ] Implement dynamic imports for admin pages
- [ ] Convert static images to Next.js Image component
- [ ] Add `prefetch={false}` to non-critical links

#### Priority 3 (This Month):
- [ ] Implement React Server Components for data-heavy pages
- [ ] Set up Web Vitals monitoring
- [ ] Profile and optimize Firebase initialization

## Current Performance Summary

✅ **Strengths:**
- Static pre-rendering for 18/19 routes (fast first load)
- CSS framework (Tailwind) is tree-shaken
- No external scripts blocking rendering
- ESLint now enforced (catches performance anti-patterns)

⚠️ **Areas for Improvement:**
- Bundle size ~121 KB (target: <100 KB)
- Admin dashboard large (342 KB - but expected for feature-rich admin)
- Genkit AI integration adds ~45 KB

🎯 **Realistic Targets:**
- Homepage First Load: 100-120 KB ✓ (achieved)
- Admin Dashboard: 300-350 KB ✓ (achieved)
- Largest Route: < 400 KB ✓ (achieved)

## Testing Performance

```bash
# Build analysis
npm install --save-dev @next/bundle-analyzer

# Production testing locally
npm run build
npm start

# Then test with Chrome DevTools:
# 1. Open http://localhost:3000
# 2. DevTools → Lighthouse
# 3. Run performance audit
```

## Deployment Checklist

- [ ] Enable gzip compression on hosting
- [ ] Use CDN for image delivery (Firebase Storage + CDN Edge)
- [ ] Enable HTTP/2 push
- [ ] Set proper cache headers
- [ ] Enable service worker for offline support
- [ ] Use ISR (Incremental Static Regeneration) for blog posts
