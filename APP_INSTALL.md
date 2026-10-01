# My High School Sports Family home-screen app

These files were merged into the project ZIP supplied on September 25, 2026. The update adds app icons, a web app manifest, and mobile app metadata in `pages/_app.tsx`. It does not replace your other pages or media, and it does not publish an App Store listing.

## Add this update to the Mac project

In the VS Code terminal, run this command after downloading `myhssportsfamily-app-update.zip`:

```bash
unzip -o ~/Downloads/myhssportsfamily-app-update.zip -d ~/Documents/my-high-school-sports-family
```

This writes the updated `pages/_app.tsx`, the five new files in `public/`, and this guide. It assumes your local `pages/_app.tsx` has not changed since the ZIP you sent. Keep the rest of your local project as it is.

Then run `npm run build` from the project folder. Your existing `.env.local` is needed for Firebase during the build; it was deliberately omitted from the uploaded ZIP.

When the build succeeds, deploy from that same folder with your normal Vercel command. After the site is live, open `/manifest.webmanifest` on your domain and verify it loads. On iPhone, open the website in Safari and choose Share → Add to Home Screen. On Android, use Chrome's Install app or Add to Home screen option.

Test sign-in, profile uploads, Live Center, Arena links, and navigation from the installed icon. Live data and signed-in pages are not cached offline.
