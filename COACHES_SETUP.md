# Coaches Corner update

This update adds `/coaches` and a Coaches Corner navigation/footer link to your existing app. It includes coach sign-up, discussions, player posts, camp posts, photos, videos, replies, likes, sharing, and reposts.

## Install on your Mac

1. Stop your running development server in its terminal with Control+C.
2. Back up your project before applying the update. The ZIP updates six existing/new application files and adds these instructions, a rules snippet, and tests. It does not contain environment variables, private keys, dependencies, or a complete replacement project.
3. Download `myhssportsfamily-coaches-update.zip` into Downloads, then run these commands in VS Code's terminal:

```bash
cd ~/Documents/my-high-school-sports-family
unzip -o ~/Downloads/myhssportsfamily-coaches-update.zip -d .
```

## Enable the Coaches Corner database rules

Open Firebase Console → your `my-high-school-sports-family` project → Firestore Database → Rules.

Save a copy of your current rules first. Open `COACHES_FIRESTORE_RULES.txt` from the project in VS Code. Copy its entire contents into your existing rules, **inside** the existing `match /databases/{database}/documents { ... }` block, before its closing brace. Keep all of your existing rules. The included functions have distinct names to avoid changing the helpers used by your live streams and community feeds.

Click Publish. If Firebase reports an error, keep the existing published rules and correct the added block before publishing again. Do not replace your whole rules file or deploy an older full rules file from a previous ZIP.

The feed sorts by one field (`createdAt`); it uses Firestore's default single-field indexing. No new composite index is included.

Photo and video uploads use your existing `posts/{userId}/{fileName}` Storage path. Its rules must allow the signed-in owner to upload image/video files under 50 MiB. The project's existing Storage rules already cover that path.

## Start and test

```bash
npm run dev -- --port 3007
```

Wait for Ready, then open `http://localhost:3007/coaches`.

If you get EADDRINUSE, stop the older development server's terminal with Control+C before starting again. Keep the current server terminal open while testing.

Use two accounts to check:

1. Create a coach account, or sign in and click “I’m a coach — join” with an existing completed profile.
2. Publish a discussion, player post, and camp post. Attach a photo and a short video, and confirm both display/play.
3. Sign in with the second coach account. Reply, like, then unlike. The count should change once per action and persist after refresh.
4. Repost the first coach's post. Confirm it credits the original coach and links to the original. A second repost of the same original by the same account is prevented.
5. Click Share and copy the link. Open that link with the other signed-in account; it should open the specific post, including a post outside the currently loaded feed.
6. Delete your own post or reply. Another account should not see a delete button on content it does not own. Deleting an original makes its reposts show that the original is unavailable.

## What is included

- Anyone signed in can read, like, and share posts. Coach participants can publish, reply, and repost.
- Coach participation is self-declared, matching the existing coach role in sign-up. This update does not verify coaching credentials.
- Joining also works for an athlete or parent who coaches, without replacing their existing profile role.
- Discussions happen in post replies; this update does not add private direct messages.
- Posts have up to four photos/videos, each smaller than 50 MiB, a title up to 140 characters, and text up to 2,000 characters. Replies have up to 500 characters.
- The feed loads 20 posts at a time. Search filters loaded posts; use Load more posts to search older content.
- Reposts keep original attribution and media by referencing the original. Likes and replies on a repost belong to its own conversation.
- Share offers a direct post link and supported sharing destinations. Instagram copies the link and opens Instagram; it does not automatically publish a post there.
- Coaches Corner posts stay in Coaches Corner. This update does not automatically publish them to state community feeds.

## Validation completed

The Next.js production build passed with example Firebase build configuration. All 23 local tests passed, including new coach membership and post/media validation tests and existing live/recording tests. Image optimization warnings remain in the build. Firebase rule publication, actual uploads, multi-account likes/reposts, and deployed playback must be checked against your real account using the steps above; they were not tested against your live services here.

To rerun the local tests:

```bash
node --test tests/coaches.cjs tests/broadcast*.cjs
```
