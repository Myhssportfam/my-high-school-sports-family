# Delete button placement

Account Settings is removed from both desktop and mobile navigation. Delete Profile appears on your own profile across its tabs and opens the existing deletion confirmation page. Delete post appears below each of your profile post thumbnails and stays in the opened post viewer. Feed posts retain their existing owner-only Delete post button. Delete story appears below your story circle and in its viewer; each button deletes that specific story, with confirmation.

Ownership checks remain in the handlers and the existing server deletion API. This update changes the uploaded page/components only and uses the deletion backend already installed. It does not delete any accounts or content during installation.

## Install

Save or close unsaved editor tabs for the four files before installing. Download myhssportsfamily-delete-button-placement-update.zip to Downloads, then run:

```bash
cd ~/Documents/my-high-school-sports-family
mkdir -p backups/delete-button-placement-2026-10-10
cp -n components/Layout.tsx backups/delete-button-placement-2026-10-10/Layout.tsx
cp -n components/PostCard.tsx backups/delete-button-placement-2026-10-10/PostCard.tsx
cp -n components/StoriesBar.tsx backups/delete-button-placement-2026-10-10/StoriesBar.tsx
cp -n pages/profile.tsx backups/delete-button-placement-2026-10-10/profile.tsx
unzip -o ~/Downloads/myhssportsfamily-delete-button-placement-update.zip -d .
npm run build
```

After the build succeeds:

```bash
npx vercel --prod
```

## Check in the browser

Sign in and open your profile. Delete Profile should remain accessible when switching tabs. Under Posts, your thumbnails have Delete post buttons. Your story circle has Delete story; opening a story also shows its own Delete story button. Other people's posts and stories must not show delete controls. Cancel the confirmation to check the controls without deleting content.

Delete Profile still requires the existing confirmation and sign-in verification. No real deletion was performed during validation. Mocked handler checks covered ownership, cancellation, server success/failure, immediate local removal and preserving the Add Story circle. A full project build and signed-in browser check must run on your Mac.
