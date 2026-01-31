# README Dialog Feature Implementation Summary

## Overview
This PR adds a new feature to the GitCard component that allows users to view the README.md file for each repository directly within the application interface.

## Changes Made

### 1. New Dependencies
- Installed `@radix-ui/react-dialog` for the dialog component

### 2. New Files Created

#### Dialog UI Component (`src/components/ui/dialog.tsx`)
- Standard shadcn/ui dialog component
- Provides overlay, content, header, footer, title, and description components
- Includes close button with X icon
- Fully accessible with ARIA attributes

#### README Dialog Component (`src/components/client/readme-dialog.tsx`)
- Client component marked with `'use client'`
- Features:
  - FileText button icon from lucide-react
  - Opens dialog on click
  - Fetches README content from API endpoint
  - Loading state with "Loading README..." message
  - Error state with error message display
  - Success state displaying README content in a pre-formatted block
  - Caches loaded README to avoid refetching

#### API Route (`src/app/api/git/readme/[repo]/route.ts`)
- GET endpoint at `/api/git/readme/[repo]`
- Fetches README from GitHub API using the repository name
- Returns JSON with content or error
- Handles missing READMEs gracefully

#### Server Function (`src/server/octokit.ts`)
- Added `getReadme(repo: string)` function
- Uses Octokit to fetch README in raw format from GitHub API
- Returns string content or null on error
- Includes error logging

### 3. Modified Files

#### GitCard Component (`src/components/server/git-card.tsx`)
- Added import for ReadmeDialog component
- Modified CardTitle to use flexbox layout with space-between
- Added ReadmeDialog button next to repository name
- Remains a server component as required

### 4. Tests
- Created comprehensive test suite in `src/components/client/__tests__/readme-dialog.test.tsx`
- Tests cover:
  - Button rendering with FileText icon
  - Dialog opening on button click
  - README fetching and display
  - Loading state
  - Error handling (fetch failures and network errors)
  - Caching behavior (no refetch on reopen)
- All tests pass successfully

## Technical Decisions

1. **Server/Client Component Split**: GitCard remains a server component while only the interactive dialog is a client component, following the issue requirements and Next.js best practices.

2. **API Route Pattern**: Used Next.js API routes to proxy GitHub API requests, keeping the GitHub token secure and avoiding client-side CORS issues.

3. **Error Handling**: Implemented graceful error handling at multiple levels (API fetch, dialog state, user feedback).

4. **Caching Strategy**: README content is cached after first load to avoid unnecessary API calls when reopening the dialog.

5. **Accessibility**: Used Radix UI primitives which provide built-in accessibility features (ARIA labels, keyboard navigation, focus management).

6. **Styling**: Followed existing Tailwind CSS patterns in the codebase, maintaining visual consistency.

## UI/UX Features

- **Button**: Small ghost variant button with FileText icon next to repository name
- **Dialog**: 
  - Large overlay with centered modal
  - Shows repository name and "README.md" in title
  - Descriptive subtitle
  - Scrollable content area for long READMEs
  - Close button in top-right corner
  - Click outside or press Escape to close

## Acceptance Criteria Met

- ✅ Button (FileText icon) appears in every GitCard component
- ✅ Clicking button loads a client-rendered dialog/modal that displays the associated README.md file
- ✅ Handles loading/errors gracefully within the client dialog
- ✅ GitCard component remains server-rendered; only the dialog/modal is client-rendered
- ✅ UI/UX is visually consistent with current application style
- ✅ All tests pass

## How to Test

1. Run the development server: `npm run dev`
2. Navigate to the home page with repository cards
3. Click the FileText icon button on any repository card
4. Observe the dialog opening with README content
5. Close dialog and reopen to verify caching
6. Test with a repository without README to see error handling

## Screenshots

Note: Screenshots cannot be taken in the current sandboxed environment without proper GitHub API credentials. However, the implementation is complete and follows all requirements.

The button appears as a small icon next to each repository name in the GitCard title area, and clicking it opens a centered modal dialog displaying the README content.
