# Live/player/profile permissions fix — October 16, 2026

## What this fixes

- Canonical LiveFeed and LivePlayer are in `components/broadcast`. `components/live` contains compatibility re-exports so older imports resolve to the same implementation. BroadcastProvider remains in `components/broadcast` and is not replaced.
- LiveFeed now waits for restored sign-in, restarts subscriptions after sign-in/out, clears stale content on errors and changes of scope, and offers Retry broadcasts.
- LivePlayer closes cancelled viewer leases and late video connections without tearing down a newer session. Subscription errors show Retry stream rather than Broadcast not found. Changing accounts closes the current viewing session.
- The Live page no longer silently ignores errors in Other Streams.
- Firestore rules now cover `/users/{uid}/posts`, likes and comments, matching the earlier profile upload code. Reads follow the existing `isPrivateProfile`/followers model. Only the owner can create a post, with matching author IDs and bounded captions. Paired deletion continues through the existing authenticated server API.
- New automatic profile-to-state copies must match the linked source document in the same committed state, and private profiles cannot automatically copy into a public feed. A private profile using the earlier composer that always writes both copies will see the upload write rejected; a separate private-only composer change requires your current profile page. Existing public copies are not removed by changing privacy.

## Where files go in VS Code

Unzip this package into the root of your existing `my-high-school-sports-family` project. The ZIP already has the right folders. Do NOT paste every file into HomeDashboard.

- `firestore.rules` → project root
- `pages/live.tsx` → existing Live page (not a new `pages/live/index.tsx`)
- `components/broadcast/LiveFeed.tsx` and `LivePlayer.tsx` → canonical broadcast components
- `components/live/LiveFeed.tsx` and `LivePlayer.tsx` → compatibility imports
- `tests` → project tests

Back up the affected files before replacing them. In the VS Code terminal, with the ZIP in Downloads:

```bash
cd ~/Documents/my-high-school-sports-family
mkdir -p backups/live-profile-2026-10-16
cp firestore.rules backups/live-profile-2026-10-16/firestore.rules
cp pages/live.tsx backups/live-profile-2026-10-16/live.tsx
cp -R components/broadcast backups/live-profile-2026-10-16/broadcast
```

If `components/live` exists, also run:

```bash
cp -R components/live backups/live-profile-2026-10-16/live-components
```

Then install:

```bash
unzip -o ~/Downloads/myhssportsfamily-live-profile-fix.zip -d .
node tests/live-feed-lifecycle.cjs
node --test tests/live-player-races.cjs
npm run build
```

The supplied tests use Node's built-in TypeScript stripping and require a recent Node release (tested here with Node 24). They use mocked callbacks and video sessions, not real streaming.

## Rules check before production

Install the Firebase rules test dependency in your project, then run the local emulator checks:

```bash
npm install --save-dev @firebase/rules-unit-testing
npx firebase-tools emulators:exec --only firestore --config tests/firebase.emulator.json --project demo-my-hssportsfamily "node --test tests/profile-rules.emulator.mjs"
```

The emulator needs Java. These rules integration tests were supplied but could not run here because the current complete project and Firebase test dependencies are unavailable. Run them before publishing the changed rules.

Only after the build and rules tests pass:

```bash
npx firebase-tools deploy --only firestore:rules --project my-high-school-sports-family
npx vercel --prod
```

Compare the Firebase console's currently published rules with your local rules before deploying; if you have newer rules, merge this update rather than overwriting them. This package preserves the uploaded rules outside the added profile permissions and linked-copy validation. It is not a full review of existing authorization policies.

## Indexes

`LIVE_INDEXES_REFERENCE.json` is a reference from the earlier repair. It does NOT replace your `firestore.indexes.json`. If the browser reports `failed-precondition` with an index link, compare and merge only missing indexes into your current file. Preserve all other indexes. Wait for the required index to become enabled before testing again. No indexes or credentials are deployed by this ZIP.

## Test locally, then on the public site

1. Open Home, Live, Arena and an athlete profile signed out and signed in. Confirm feeds load or show a useful retry message. Use the browser console error code to distinguish an index issue from a rules issue.
2. With a disposable public-profile account, upload a photo/video and check the profile and correct state copy. Confirm another user can read but cannot edit that post. Use the existing delete API to remove linked copies.
3. Confirm an unrelated account cannot read a private profile's nested posts. This follows your existing follower-document model; this patch does not redesign follow-request approval or change the older public `/profilePosts` collection.
4. Start a camera broadcast on one device; sign in on another and watch it. Leave while connecting, immediately reconnect, switch streams, sign out, and end the broadcast. Confirm no old video continues and viewer sessions stop.
5. Verify Screen Stream on a supported desktop browser, permission cancellation, and Schedule Live. Browser camera prompts and streaming-service configuration remain necessary.

Local verification completed: feed lifecycle regression test; five player tests (including cancellation/late-result races). Original Live and one-tap/schedule controls are retained. Full TypeScript/Next.js build, rules emulator tests, Firebase uploads, camera/screen capture, production playback and deployment are NOT verified. Backend services, storage rules, public athlete pages, and BroadcastProvider were not supplied in this upload and were not modified.

Official references: https://firebase.google.com/docs/firestore/security/rules-conditions and https://react.dev/reference/react/useEffect
