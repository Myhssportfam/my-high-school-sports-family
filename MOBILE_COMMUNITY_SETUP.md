# Profile-to-community and mobile header update

## Changes

New photos/videos posted using your profile's Add Post composer save to both your profile and the state community selected in your profile. Full state names and abbreviations are normalized to the state's existing community ID. If your state is missing, choose it in Edit Profile before posting.

Both database records for each media item use a single atomic write, so a permissions failure will fail both writes for that item. Multiple selected media items remain separate posts, matching the existing profile behavior. Media is uploaded once and referenced by both records. Likes and replies in the profile and community remain separate. Existing older posts are not automatically copied, and deleting a community post does not delete its profile counterpart.

The phone header now shows a clearly labeled Login button when signed out and Profile + Logout buttons when signed in. Logout is at the top right; navigation stays in Menu. The full brand name and theme control remain visible on larger screens; the logo stays on phones.

This ZIP also includes the latest Coaches Corner update so `/coaches` and its navigation link are installed. Its own Firebase rules are included separately.

## Install

Back up your current project, then stop the development server with Control+C. Download this ZIP to your Mac's Downloads folder and run:

```bash
cd ~/Documents/my-high-school-sports-family
unzip -o ~/Downloads/myhssportsfamily-mobile-community-update.zip -d .
```

## Firebase rules

Open Firebase → Firestore Database → Rules and save a copy of your currently published rules. Add the contents of `PROFILE_COMMUNITY_RULES.txt` INSIDE your existing `match /databases/{database}/documents { ... }` block. Preserve all your other rules. If you haven't added Coaches Corner rules yet, add `COACHES_FIRESTORE_RULES.txt` inside the same block too. Publish only after the editor accepts the merged rules.

The automatic state post includes both userId and authorId for compatibility. Your existing public state-feed read and authenticated interaction rules must remain in place. Do not replace your rules with an older whole-project file. Uploads use the existing Storage `posts/{userId}/{fileName}` image/video path with its under-50-MiB limit; no new Storage path is needed.

## Restart and verify

```bash
npm run dev -- --port 3007
```

Wait for Ready. Open `http://localhost:3007/profile`, choose your state if needed, and post one photo and one short video. Then open your state community's Posts section and confirm both appear. For example, Texas is `http://localhost:3007/states/tx`.

Check the page on a phone-sized window at 320 px and on your actual phone after deployment. Signed out: Login should stay visible on the right. Signed in: Profile and Logout should stay visible on the right. Click Logout and confirm the header switches back to Login. Open Menu and confirm Coaches Corner is listed.

After local testing, deploy these updated files through your existing Vercel workflow so the public site and mobile starter use the same version. Local changes alone do not update the public site.

## App project

Read `mobile-app-template/README.md` for the iOS/Android starter, account setup, and remaining store-submission work. It creates a separate Expo project in Documents. Do not publish the starter as a finished app: native authentication, media permissions, recording-save integration, account deletion, content reporting/blocking/moderation, and device testing still need completion.

## Verification here

Next.js production build passed with example Firebase configuration; 26 local tests passed, including canonical state routing, paired profile/community writes, rejection of a missing state, and propagation of a failed atomic commit. Native template syntax, shell syntax, and configuration JSON passed. Actual Firebase rule publication, media uploads, phone UI, native builds, and store submission were not run here.
