# Sports Family mobile development starter

Status: development starter, not a signed app or an App Store/Google Play submission. The website update is built and locally tested. This mobile template has syntax/configuration checks only; no iPhone/Android build or physical-device test has been run here.

## What is included

A React Native/Expo app that displays your deployed Sports Family site in a WebView, with native Home, States, Live, Arena, and Coaches tabs, a native Share button, back navigation, safe-area spacing, and connection-error recovery. It uses your existing website/backend instead of a second database. The native project lives separately from your Next.js project.

## Create the development project on your Mac

First deploy the website changes and confirm `/coaches` works on the public HTTPS site. This starter points to `https://myhssportsfamily.vercel.app`. Change `SITE` near the top of `App.tsx.template` if you use your custom domain. A phone cannot use your Mac's `localhost:3007` as its server.

From your existing website project:

```bash
cd ~/Documents/my-high-school-sports-family
bash mobile-app-template/bootstrap.sh
```

The script creates `~/Documents/myhssportsfamily-mobile`, installs the current Expo blank TypeScript template and compatible native modules, and copies these app files. It stops if the destination exists, so it will not overwrite a previous app project. Dependency installation needs an internet connection. No dependencies are downloaded or bundled in this ZIP.

Then:

```bash
cd ~/Documents/myhssportsfamily-mobile
npx expo-doctor
npx tsc --noEmit
npx expo start
```

Expo Go can help inspect the basic UI. Use a development build to validate the actual permissions and production behavior:

```bash
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build --profile development --platform ios
npx eas-cli@latest build --profile development --platform android
```

EAS will guide signing/account configuration. Device installation for iOS requires the appropriate Apple development signing setup. Expo/EAS accounts and any service charges are managed directly by you.

Use the bundle/package ID `com.myhssportsfamily.app` only if it is available and belongs to you. Confirm it before registering store records or creating production signing keys. EAS may add its project ID to app.json during configuration; retain that value.

## Test on real iPhone and Android devices

- Email/password login, logout, session persistence, and all five tabs.
- Profile uploads and automatic state-community posts, Coaches Corner photos/videos, likes/replies/reposts, and links from the native Share button.
- Camera/microphone permission grant and denial, live broadcasting and viewing with another account, and cleanup when leaving a broadcast. Android may require explicit runtime permission integration in addition to manifest permissions; implement and verify it before release.
- App backgrounding, keyboard, Android back button, safe areas, small-screen layouts, and connection recovery.
- Replays and downloads: the website's Blob/download flow is not yet integrated with a native filesystem/save/share flow in this starter. Complete that integration before claiming native recording saves work.
- Screen streaming requires a native screen-capture implementation; browser `getDisplayMedia` must not be assumed to work on phones.

Google popup sign-in is not integrated into this starter. External links open the device browser and do not transfer its login back into the WebView. Implement a supported native authentication flow and account linking before release; use email/password for initial internal testing.

## Developer accounts: next step

You said neither account is set up yet. Enroll in the [Apple Developer Program](https://developer.apple.com/programs/enroll/) and create a [Google Play Console developer account](https://support.google.com/googleplay/android-developer/answer/6112435). Apple lists US$99 per membership year and Google lists US$25 once; complete payment and identity verification directly with the stores. Choose the appropriate individual/organization account based on your actual business identity. Apple organization enrollment includes legal-entity and D-U-N-S verification; an individual account displays your legal name as seller.

## Work still required before store submission

The current source does not include an end-to-end account deletion or content report/block/moderation system. Complete those flows, including removal of user data and uploaded content, backend enforcement of blocks, report review, and accessible support contact details. Apple requires account deletion for apps with account creation and moderation controls for social/user-generated content apps.

If you offer Google/social login on iOS, implement an equivalent privacy-preserving login option meeting Apple's login-services requirements, normally Sign in with Apple. Review your actual authentication flow rather than assuming email/password alone is equivalent.

This WebView starter is a starting point for native development. Apple's minimum-functionality guideline requires more than a repackaged website; the native tabs and Share button alone do not establish approval. Extend and verify the core native experience before submitting.

Finish privacy/data-safety disclosures based on the actual SDKs and collected/shared data, account deletion links, age/content ratings, screenshots, support/privacy URLs, and a working reviewer account. Do not list live streaming or other features until they work in the signed mobile build.

New personal Google Play accounts require a closed test with at least 12 testers opted in continuously for 14 days before applying for production access. Confirm your account's testing requirements in Play Console.

Only after these steps and successful native testing:

```bash
npx eas-cli@latest build --profile production --platform all
```

Upload to TestFlight/Play testing tracks first. Submit the reviewed builds through App Store Connect and Play Console when their records, signing, policies, testing, and required disclosures are complete. No store upload or publication has been performed by this update.

## Official references checked October 6, 2026 UTC

- [Expo WebView](https://docs.expo.dev/versions/latest/sdk/webview/)
- [Expo first build](https://docs.expo.dev/build/setup/)
- [WebView reference and permission behavior](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Reference.md)
- [Apple review guidelines: 1.2, 4.2, 4.8](https://developer.apple.com/app-store/review/guidelines/)
- [Apple account deletion](https://developer.apple.com/support/offering-account-deletion-in-your-app/)
- [Google personal-account testing](https://support.google.com/googleplay/android-developer/answer/14151465)
