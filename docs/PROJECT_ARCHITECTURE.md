# STR mix Digital: Technical Architecture & Context

This document provides a deep explanation of the STR mix Digital platform, detailing the architectural decisions and implementations made to ensure a high-performance, industrial-grade web application.

## 1. Core Tech Stack
- **Framework**: Next.js 15 (App Router) for optimized server-side rendering and client-side transitions.
- **Styling**: Tailwind CSS with a "Brutalist Industrial" design system (High contrast, Space Grotesk headlines, HSL-based themes).
- **Backend-as-a-Service**: Firebase (Firestore, Authentication, Cloud Storage).
- **AI Integration**: Genkit for automated blog drafting and review synthesis.
- **UI Components**: ShadCN UI (Radix-based) for accessible, consistent interface elements.

## 2. Global State & Contexts
### Media Upload System (`src/context/MediaUploadContext.tsx`)
We implemented a **Global Media Upload Provider** to solve the issue of navigating away from the Media Library during long uploads.
- **Persistence**: Upload tasks are managed at the `layout.tsx` level, allowing them to continue in the background while the user works on Support Tickets or Blog Posts.
- **Mechanism**:
    1.  **Binary Stream**: Files are streamed to Firebase Cloud Storage using `uploadBytesResumable`.
    2.  **Metadata Registration**: Upon 100% completion, a Firestore document is created in the `media_library` collection containing the permanent `downloadURL`, file size, and MIME type.
    3.  **UI Throttling**: Progress updates are throttled to 150ms intervals to prevent React re-render lag during high-speed transfers.

## 3. Real-time Database Architecture
### Analytics & Telemetry
- **Visitor Tracking**: The `AnalyticsTracker` component uses Firestore's `increment(1)` atomic operator to count unique sessions without causing write contention.
- **Command Center**: The Admin Dashboard (`src/app/admin/page.tsx`) uses `useCollection` hooks to provide real-time counts of posts, reviews, and tickets.

### Maintenance Guard (`src/components/maintenance-guard.tsx`)
A global interceptor that reads the `settings/global` document. If `maintenanceMode` is true, all public routes are blocked by a heavy-duty "Under Maintenance" screen, while `/admin` and `/login` remain accessible for repairs.

## 4. Security & Access Control
### Administrative Registry
We use a **Double-Check Security Pattern**:
1.  **Authentication**: Handled via Firebase Auth (Google & Email).
2.  **Authorization**: Upon login, the `AdminLayout` checks the `roles_admin/{userId}` collection. If the user's UID is not present, they are redirected to an "Access Restricted" screen, even if they are "signed in."

## 5. Performance Optimizations
- **LCP Prioritization**: Critical hero images and brand logos use the `priority` attribute in `next/image`.
- **Next.js Fonts**: Fonts are self-hosted via `next/font/google` to eliminate layout shifts (CLS) and external CSS requests.
- **Non-Blocking Writes**: Mutations like `setDoc` and `addDoc` are wrapped in `non-blocking-updates.tsx` helpers. They trigger local cache updates immediately and handle background syncing/error emitting without awaiting the server round-trip.

## 6. AI Workflows
- **Drafting**: The system uses Gemini 2.5 Flash via Genkit to generate construction-themed blog content based on short topics.
- **Synthesis**: The Review Moderation panel uses a synthesis flow to summarize hundreds of user reviews into a single "Client Sentiment" paragraph.

---
*Last Updated: 2024-05-23*
