# Activate live streaming

This update adds camera Go Live, screen Stream, and Schedule Live. A single broadcast can be watched from the athlete profile, its state community, Live, and its Arena room. Home shows current Live of the Week and trending live athletes. Share opens the actual stream link. The compact scheduling dialog scrolls on smaller screens.

## 1. Install the update

Keep a backup of your current project. From your existing project directory, apply the small update ZIP:

```sh
cd ~/Documents/my-high-school-sports-family
unzip -o ~/Downloads/myhssportsfamily-live-update.zip -d .
npm install
```

The update contains source and configuration files only. Your existing `.env.local`, `.git`, and public assets are not included in the update ZIP. The full project ZIP is also provided if you prefer a complete checkout. Retain your own local environment settings.

## 2. Configure the server

Create or use a Cloudflare account with Stream enabled. Create a restricted API token with Stream edit permission for that account. Copy your account ID and token into local `.env.local` and the server environment settings of your hosting project:

```dotenv
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_STREAM_API_TOKEN=your_stream_api_token
FIREBASE_SERVICE_ACCOUNT=your_existing_firebase_service_account_json
CRON_SECRET=your_long_random_cleanup_secret
```

Use the complete Firebase service account JSON as the value of `FIREBASE_SERVICE_ACCOUNT`; on a local machine, the existing `GOOGLE_APPLICATION_CREDENTIALS` path is also supported. Preserve your existing `NEXT_PUBLIC_FIREBASE_*` settings. These server secrets must never use a `NEXT_PUBLIC_` prefix, be committed to git, or be pasted into chat.

This package does not create a Cloudflare account, enable billing, deploy Firebase, or configure hosting. Cloudflare Stream must be available for your account before broadcasting works. Scheduling requires Firebase Admin but does not create a provider input until you start the session.

Official service documentation:
- https://developers.cloudflare.com/stream/webrtc-beta/
- https://developers.cloudflare.com/stream/examples/browser-based-webrtc/

## 3. Deploy Firebase rules and indexes

This update includes rules and indexes for broadcasts and Arena membership. Compare them with any rules already deployed outside this project, preserving additional application rules before deploying.

From the project root, using your Firebase CLI and the correct existing Firebase project:

```sh
firebase deploy --only firestore:rules,firestore:indexes
```

Wait for indexes to finish building. Redeploy the application after adding its server environment variables, or restart your local server:

```sh
npm run dev -- --port 3006
```

## 4. Configure cleanup

The protected endpoint `GET /api/broadcasts/cleanup` ends abandoned broadcasts and retries failed provider cleanup. Configure a server scheduler to call it every minute with this header:

```text
Authorization: Bearer <CRON_SECRET>
```

Use a scheduler supported by your hosting plan; no scheduled job is created by this package. The viewers hide broadcasts after a stale heartbeat even without this job, but periodic cleanup is needed to retire abandoned provider inputs reliably. Do not expose the cleanup secret in a client page or a public URL.

## 5. Test with two signed-in devices

1. On your own athlete profile, click Go Live and allow camera/microphone access. Stream instead captures a selected screen, window, or tab. Choose a screen option that includes audio if needed. Camera is the alternative on browsers without screen capture.
2. On another signed-in device, watch the same session on the athlete profile, state community, Live directory, or its Arena room. Watch does not request camera access.
3. Open the share link. Move between pages while broadcasting, then End Live and verify capture stops and viewers leave.
4. Schedule a future time, reload, and start the saved session from its watch page. Scheduling saves a session; it does not start your camera automatically at the scheduled time.
5. Join an Arena room before broadcasting there. Room access is checked on the server. Console gameplay requires your console's Remote Play or a capture device connected to the computer; a website cannot directly capture a PS5 or Xbox screen.

Broadcast listings and links are public. The application requires sign-in to watch and tracks connected viewers using expiring presence records. Publisher credentials remain server-private and are returned only to the authenticated broadcaster.

## Behavior and limits

- Cloudflare handles media delivery; there is no six-viewer peer-to-peer cap in this code.
- Native WebRTC does not create provider recordings or RTMP/SRT restreams. The browser now records live capture locally, starting when the broadcast is ready. After End Live, preview and download the video, upload it to the profile's state community, add its first 15 seconds as a 24-hour story, or share the video through the device share sheet. Older external stream links remain available separately.
- Recording requires MediaRecorder support and keeping the tab open. Refreshing or closing loses an unsaved recording. Local recording stops around 200 MB while live streaming continues; this is a bounded memory recording, not a server archive for long broadcasts. Community uploads use existing Firebase Storage posts rules and must be under 50 MB. Unsupported file sharing falls back to download for manual posting to social apps. MP4 is preferred when supported; otherwise the browser produces WebM.
- Post and story uploads require the existing stateFeeds/stateStories Firestore permissions and posts Storage permissions. Buttons report failures without discarding the local video. Upload retries reuse the uploaded URL and deterministic document ID. Community link sharing opens the state community; Share video sends the recording file.
- The live rankings use current sessions and their peak connected viewer counts. Each directory reads the latest 100 active/scheduled records in its scope; these are not historical, platform-wide analytics.
- State community activity updates are written when a broadcast becomes live or ends. Push notifications, automatic scheduled starts, and follower reminders are not implemented.
- Home “Live of the Week” selects a currently live session created within seven days, using peak audience. It is not a recorded weekly replay.

## Validation

Run `npm run test:live` for the 20 focused API, authorization, lifecycle, ranking, Arena, and WebRTC negotiation tests. Production build and TypeScript checks are also used. These tests mock provider/Firebase interactions; actual camera/screen playback across two devices still requires the account configuration and deployment above.
