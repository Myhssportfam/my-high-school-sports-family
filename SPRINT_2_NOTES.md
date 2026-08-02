# MHSF Sprint 2 — Social Feed Foundation

## Built in this sprint
- Real-time Firestore feed updates using `onSnapshot`
- Professional post composer for text, photos, and videos
- Up to four media files per post, with upload progress and previews
- Sport and state tags
- Post validation and clearer Firebase configuration errors
- Real-time comments
- Optimistic likes
- Save, share/reshare, and delete-your-own-post actions
- Responsive social-feed styling for desktop and mobile
- Updated Firestore rules
- Added Firebase Storage rules for post media
- Fixed transaction ordering for likes, comments, and reshares

## Firebase deployment required
From the Firebase Console, publish the included `firestore.rules` and `storage.rules` before testing uploads and social actions.

## Local setup
1. Copy your existing `.env.local` into the project root.
2. Run `npm install`.
3. Run `npm run dev`.
4. Sign in, create a post, and test likes/comments in a second browser window.

## Important
The ZIP intentionally excludes `.env.local`, `node_modules`, and `.next` so secrets and generated files are not shared.
