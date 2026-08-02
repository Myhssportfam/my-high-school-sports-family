Server for MHSF

Environment
- `FIREBASE_SERVICE_ACCOUNT` (JSON string) — service account for Firebase Admin
- `REVALIDATE_SECRET` — secret used to call Next's `/api/revalidate`
- `SERVER_SECRET` — optional secret for `/fanout` endpoint
- `NEXT_PUBLIC_BASE_URL` — optional base URL for Next app (defaults to `http://localhost:3000`)

Run locally

Install dependencies and start the server:

```powershell
npm install express cors body-parser node-fetch firebase-admin
npm run server
```

Usage

- POST `/fanout` — body: `{ postId, authorId, secret? }` (will write post pointers into followers' `homeFeeds/{user}/posts`)
- POST `/revalidate` — body: `{ secret }` will proxy to Next's `/api/revalidate`
