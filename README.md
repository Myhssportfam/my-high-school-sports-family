# My High School Sports Family (MHSF)

Production-ready sports social network starter built with Next.js, TypeScript, Tailwind CSS, and Firebase.

Getting started

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` with Firebase keys:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

3. Run dev server:

```bash
npm run dev
```

What's included

- Next.js + TypeScript scaffold
- Tailwind CSS with dark mode
- Firebase initializer (`lib/firebase.ts`)
- Basic Layout and theme toggle

Next steps

- Implement authentication and role types (athlete, coach, parent)
- Design Firestore schemas for profiles, teams, stories, reels, and feed
- Implement media uploads, messaging, notifications, and admin moderation

Server-side rendering with Admin SDK

For secure server-side fetching (recommended), create a Firebase service account and add its JSON to the `FIREBASE_SERVICE_ACCOUNT` environment variable in your deployment environment. Example `.env.local`:

```
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"...",...}'
```

Alternatively store the JSON securely in your hosting provider (Vercel/Netlify) and set the variable there. The app will initialize the Admin SDK from `lib/firebaseAdmin.ts` when this variable is present.

On-demand revalidation (ISR)

To revalidate athlete pages when a profile changes, add a secret environment variable `REVALIDATE_SECRET` and call the endpoint `POST /api/revalidate` with header `x-revalidate-secret: <secret>` and JSON body `{ "athleteId": "<id>" }` or `{ "path": "/athlete/<id>" }`.

Example cURL:

```bash
curl -X POST https://your-site.example/api/revalidate \
	-H "Content-Type: application/json" \
	-H "x-revalidate-secret: $REVALIDATE_SECRET" \
	-d '{"athleteId":"p1"}'
```

You can call this endpoint from a backend service or Cloud Function triggered on Firestore writes. Keep `REVALIDATE_SECRET` private — store it in your hosting provider's secret store.
