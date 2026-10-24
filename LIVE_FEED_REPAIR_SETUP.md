# Live feed repair

This update changes `components/live/LiveFeed.tsx` and `firestore.indexes.json` only.

## Fixed in the available source

- Wait for restored Firebase sign-in before subscribing; restart on sign-in/out.
- Clear cards and close inline players when changing scope or after an error.
- Ignore queued callbacks from a previous subscription or an unmounted page.
- Offer Retry broadcasts to reconnect without a full refresh.
- Log the actual Firebase code and message to the browser console, with a plain message on the page.
- Retain the six stream indexes and include the schools/users/cities indexes confirmed in the previous deployment screenshot.

## Install on your Mac

Save the ZIP to Downloads. In the VS Code terminal:

```bash
cd ~/Documents/my-high-school-sports-family
mkdir -p backups/live-feed-repair
cp components/live/LiveFeed.tsx backups/live-feed-repair/LiveFeed.tsx
cp firestore.indexes.json backups/live-feed-repair/firestore.indexes.json
unzip -o ~/Downloads/myhssportsfamily-live-feed-repair.zip -d .
npm run build
```

If the build succeeds, deploy indexes:

```bash
npx firebase-tools deploy --only firestore:indexes --project my-high-school-sports-family
```

If asked to delete any other existing indexes, answer **No**. Wait until indexes are enabled in Firebase, then deploy the website:

```bash
npx vercel --prod
```

## Verify after installation

Open Home, Live, and an athlete profile both signed out and signed in. If a feed fails, open the browser console and look for `[LiveFeed] Broadcast subscription failed`. Its `code` and `message` identify the next repair. Never share tokens or credentials.

## Limits and remaining work

No Firestore or Storage permissions were changed. A `permission-denied` failure still requires reviewing the current rules and query together. This update does not claim that guest streams, broadcasting, playback, camera/screen capture, scheduling, editing profiles, media uploads, or deletion now work end to end.

The deployed public profile's placeholder Photos tab, sample-style posts, achievements and display fields require its current source files. The latest full project is needed before modifying those pages.

## Validation

The included Node test exercises the actual subscription effect with mocked Firebase callbacks: auth restoration, owner scope, filtering, permission/network failures, reconnect, stale callbacks, cleanup and empty snapshots. It also checks index preservation.

```bash
node tests/live-feed-lifecycle.cjs
```

A full Next.js build and real Firebase/streaming integration test require the current project and configured services; neither was available for this patch.
