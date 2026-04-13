# Development Best Practices Guide

## Quality Assurance Workflows

### Pre-commit Checklist
Before committing code:

```bash
# 1. Type checking
npm run typecheck

# 2. Linting
npm run lint

# 3. Build test
npm run build

# 4. Manual testing in dev
npm run dev
```

### Git Hooks Setup (Recommended)

Automatically run checks before commit:

```bash
npm install --save-dev husky lint-staged

npx husky install
npx husky add .husky/pre-commit 'npx lint-staged'
npx husky add .husky/pre-push 'npm run typecheck && npm run build'
```

Add to `package.json`:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

## Code Quality Standards

### 1. TypeScript Strictness

Your project has `strict: true` - enforce these standards:

```typescript
// ✅ DO: Type all public functions
export function formatDate(date: Date): string {
  return date.toLocaleDateString()
}

// ❌ DON'T: Use `any`
function formatDate(date: any) {
  return date.toLocaleDateString()
}

// ✅ DO: Use discriminated unions for states
type Result<T> = 
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }
  | { status: 'loading' }

// ❌ DON'T: Use optional chaos
type Result<T> = {
  data?: T
  error?: Error
  loading?: boolean
}
```

### 2. React Best Practices

```typescript
// ✅ DO: Use proper keys for lists
<ul>
  {items.map(item => (
    <li key={item.id}>{item.name}</li>
  ))}
</ul>

// ❌ DON'T: Use index as key
<ul>
  {items.map((item, index) => (
    <li key={index}>{item.name}</li>
  ))}
</ul>

// ✅ DO: Memo expensive components
const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  return <div>{data}</div>
})

// ✅ DO: Use useCallback for event handlers
const handleClick = useCallback(() => {
  doSomething()
}, [])

// ❌ DON'T: Define functions in render
function Component() {
  const handleClick = () => {}
  return <button onClick={handleClick}>Click</button>
}
```

### 3. Style Guide

**Naming Conventions:**
- Components: `PascalCase` (MyComponent.tsx)
- Utilities: `camelCase` (formatDate.ts)
- Constants: `UPPER_SNAKE_CASE` (DEFAULT_PAGE_SIZE)
- CSS classes: `kebab-case` (card-header)
- Tailwind: Use predefined scales (no arbitrary values unless necessary)

**File Organization:**

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── layouts/      # Page layouts
│   ├── sections/     # Feature sections
│   └── index.ts      # Barrel exports
├── lib/
│   ├── utils.ts      # Utilities
│   ├── constants.ts  # Constants
│   └── hooks.ts      # Custom hooks
├── hooks/            # React hooks
├── app/              # Next.js app directory
└── firebase/         # Firebase configuration
```

## Security Review Checklist

### Before Each Release:

- [ ] No console.log statements in production code
- [ ] No hardcoded API keys or secrets
- [ ] All environment variables are NEXT_PUBLIC_* or .env.local
- [ ] Firebase Security Rules reviewed
- [ ] Supabase RLS policies reviewed
- [ ] No direct DOM manipulation (use React)
- [ ] All user inputs are sanitized/validated
- [ ] HTTP headers are set (already done in next.config.ts)
- [ ] CSP header is configured if needed
- [ ] CORS is restrictive (only allow your domain)

### Firebase Security Rules Example:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write only to authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // More specific: Only allow users to read their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

## Error Handling Patterns

### Global Error Boundary

Already implemented via `FirebaseErrorListener.tsx`. Extend it:

```typescript
// src/components/error-boundary.tsx
'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught:', error, errorInfo)
    // Log to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-fallback">
          <h1>Something went wrong</h1>
          <p>Please refresh the page</p>
        </div>
      )
    }

    return this.props.children
  }
}
```

### Firebase Error Handling

```typescript
// src/lib/firebase-errors.ts
export function getFriendlyErrorMessage(error: FirebaseError): string {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Invalid email address'
    case 'auth/user-not-found':
      return 'User not found'
    case 'auth/wrong-password':
      return 'Incorrect password'
    case 'permission-denied':
      return 'Access denied'
    default:
      return 'An error occurred. Please try again.'
  }
}
```

## Testing Strategy

### Unit Tests (Recommended Setup)

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

Example test:

```typescript
// src/lib/utils.test.ts
import { formatDate } from './utils'

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15')
    expect(formatDate(date)).toBe('1/15/2024')
  })
})
```

### E2E Tests (Optional but Recommended)

```bash
npm install --save-dev playwright @playwright/test
```

Example:

```typescript
// e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await expect(page).toHaveTitle(/STR mix/)
})
```

## Deployment Checklist

### Before Production Deploy:

```bash
# 1. Test build
npm run typecheck
npm run lint
npm run build

# 2. Environment variables set
# Verify NEXT_PUBLIC_* vars are set in hosting platform

# 3. Secrets secured
# Ensure .env.local never pushed to version control

# 4. Performance
# Run Lighthouse audit and target scores:
# - Performance: > 85
# - Accessibility: > 90
# - Best Practices: > 90
# - SEO: > 90

# 5. Security headers verified
# Check all headers are returned:
curl -i https://your-site.com | grep -E "X-Content-Type|X-Frame|Strict-Transport"
```

### Post-Deploy Monitoring:

- [ ] Check error logs for exceptions
- [ ] Monitor Core Web Vitals
- [ ] Verify all external APIs are responding
- [ ] Test authentication flows
- [ ] Test file uploads to storage
- [ ] Verify email notifications are working

## Documentation

### Code Comments

Keep comments minimal - prefer clear naming:

```typescript
// ❌ Unnecessary
const x = 5 // set x to 5
const result = x * 2 // multiply by 2

// ✅ Good naming
const pageSize = 5
const scrollOffset = pageSize * 2

// ✅ Useful comments
// Cache is invalidated after 1 hour to prevent stale data
const CACHE_TTL = 3600 * 1000
```

### Component Documentation

Use JSDoc for public components:

```typescript
/**
 * Hero section for homepage
 * @component
 * @param {string} title - Main headline
 * @param {string} subtitle - Secondary text
 * @example
 * return <HeroSection title="Welcome" subtitle="To our site" />
 */
export function HeroSection({ title, subtitle }: Props) {
  // Component code
}
```

## Useful npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --turbopack -p 9002",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,md}\"",
    "analyze": "ANALYZE=true npm run build",
    "audit": "npm audit --audit-level=moderate"
  }
}
```

---

**Last Updated**: 2024-04-13
**Security Review**: All vulnerabilities patched, TypeScript strict enabled
**Performance Target**: First Load JS < 120KB, Build succeeds with 0 errors
