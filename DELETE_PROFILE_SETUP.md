# Delete Profile update

Install this update into the same Next.js project as the coaches/mobile community update. No Firebase rules changes are needed: the authenticated server performs deletion with Firebase Admin.

## Install on your Mac

1. Download `myhssportsfamily-delete-profile-update.zip` into Downloads.
2. In the VS Code terminal (not the Firebase Rules editor), run:

```bash
cd ~/Documents/my-high-school-sports-family
unzip -o ~/Downloads/myhssportsfamily-delete-profile-update.zip -d .
```

3. Stop the existing development server with Control+C in its running terminal, then run:

```bash
npm run dev -- --port 3007
```

4. Open `http://localhost:3007/profile`. On your own profile Home tab, press **Delete Profile**. The dedicated page is also at `http://localhost:3007/settings/delete-account`.

## Behavior

- Deletes only the signed-in person's account. No delete-other-user or administrator access is introduced.
- Requires typing DELETE and fresh password/Google verification. Server checks the verified token UID and authentication within five minutes; it ignores any client-supplied target UID.
- Removes the profile and all its subcollections; owned global/profile/coach/state posts; owned state stories; owned live streams and their Cloudflare inputs; account notifications, saved-post references, like history, broadcast host lease; reciprocal follow links with counts adjusted once.
- Removes files under the account's own upload directories, including photos, cover, profile/coach posts, music, season highlights, stories, and sports timeline. State-post uploads under stateId/uid are also cleaned.
- Removes Firebase Authentication last and signs out on success. Failures do not pretend deletion succeeded. Cleanup can be partially complete; retry is safe. A two-minute lease prevents overlapping requests.
- Other people's reposts, references, likes/comments on their content, Arena participation/history, files outside the recognized owned directories (including old `state-feeds/stateName` uploads without ownership in their paths), downloaded copies, backups, and third-party copies are not erased by this update. The confirmation page discloses this. This is not a complete all-service data erasure workflow.

## Server requirements

Keep the existing Firebase Admin service account configuration and `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`. Local setup can use the existing `GOOGLE_APPLICATION_CREDENTIALS` JSON path. Hosted deployment must use a server-only `FIREBASE_SERVICE_ACCOUNT` value or a supported server credential, not a path on your Mac. Do not expose credentials to browser code.

The service account needs Firestore, Firebase Authentication user deletion, and Storage listing/deletion permissions. Removing a Cloudflare live input also needs the configured Stream token. Storage retention/permission errors or provider errors stop cleanup and return a retry message. Large accounts may need several attempts under the host's request timeout; a durable background deletion worker is needed before promising deletion at large scale. Avoid publishing or uploading from other devices during deletion.

## Validation

Use a disposable test account with a photo, state post, coach post, and follow. Cancel first to verify no data changes; then delete it and check profile, state and coach feeds, storage, follow counts, and Authentication. Confirm another account remains intact. Never test by deleting your main account.

Automated checks cover confirmation/recent authentication, ownership isolation, UID prefix boundaries, cleanup failure, retry behavior, and server rejection of caller-supplied target UIDs. Production build and existing feature tests also run. Real Firebase, Cloudflare, and device deletion still require the disposable-account check.
