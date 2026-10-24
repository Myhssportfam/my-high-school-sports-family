# Install recording update

This update requires the native live update already installed. It preserves your Firebase/Cloudflare configuration and other project pages.

In your project terminal, stop the dev server with Control+C, then run:

```bash
cd ~/Documents/my-high-school-sports-family
unzip -o ~/Downloads/myhssportsfamily-recording-update.zip -d .
npm run dev -- --port 3007
```

Open http://localhost:3007/live, sign in, broadcast for 20 seconds, then End Live. Preview and save the video. Test Post to community, Add to story (first 15 seconds), and Share video. Verify from a second signed-in account that the community video and story play. The existing Firebase stateFeeds/stateStories and posts Storage permissions must allow these uploads.

Automated validation: 20 tests pass, focused lint passes, production build passes with build-only Firebase configuration. Real camera, device sharing, and Firebase uploads still require testing with your account.

Keep this tab open until you save or publish the recording. Local recording stops around 200 MB; community uploads require less than 50 MB. File sharing falls back to download if your browser cannot share video files.
