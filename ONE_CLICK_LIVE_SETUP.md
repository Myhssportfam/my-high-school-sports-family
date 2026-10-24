# One-tap Live page

The phone navigation Menu now also includes a prominent Login link when signed out, alongside the existing Login button at the top right. Signed-in accounts keep Profile/Logout and Account Settings.

The Live page now has two large direct-start controls:

- Go Live starts the camera broadcast directly.
- Stream opens the browser's screen selector and starts streaming directly.
- Schedule Live keeps its title/date form and scheduled streams keep their existing start controls.

There is no extra title form or second Start button for immediate broadcasting. The server assigns the existing default broadcast title. Permission prompts and screen selection are still required by the browser. Screen sharing is unavailable in browsers without screen capture support, including many phone browsers; use Go Live there.

The buttons show Starting… and prevent repeated starts while connecting. Once connected, the existing live dock provides preview, share, and End Live. Existing recording/save/post/story options after ending remain available.

## Install on your Mac

Download `myhssportsfamily-one-click-live-update.zip` to Downloads. In the VS Code terminal run:

```bash
cd ~/Documents/my-high-school-sports-family
unzip -o ~/Downloads/myhssportsfamily-one-click-live-update.zip -d .
```

Stop the running server with Control+C, then restart:

```bash
npm run dev -- --port 3007
```

Open `http://localhost:3007/live`. Sign in and make sure your profile has a state community selected. Firebase Admin and Cloudflare Stream must remain configured as in the previous live update. This update does not change Firestore Rules or backend credentials.

Verify camera start, screen start (on a supported desktop browser), cancellation of permission/screen selection, End Live, and Schedule Live. Test playback from another signed-in device. Build/type checks and existing automated broadcast tests are checked here; real camera, screen, and Cloudflare playback still require a device test.
