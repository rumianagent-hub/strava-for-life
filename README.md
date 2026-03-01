# Strava for Life

Track your daily habits, build streaks, and stay accountable with your squad.

**Live app:** https://strava-for-life.vercel.app

## Features

- **Google Sign-In** — one-click auth
- **Goals** — create goals with category, description, and privacy (public / squad-only)
- **Daily check-ins** — mark done + add a note each day
- **Streak tracking** — current streak and personal best
- **14-day grid** — visual check-in history
- **Squads** — create a squad, share the invite link, track everyone's goals together
- **Weekly summary email** — disabled by default; enable by setting `RESEND_API_KEY`

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Auth | Firebase Authentication (Google) |
| Database | Cloud Firestore |
| Functions | Firebase Cloud Functions v2 (Gen 2) |
| Hosting | Vercel |
| Email | Resend (optional) |

## Local development

### Prerequisites

- Node.js ≥ 18
- A Firebase project (Blaze plan required for Cloud Functions)

### 1. Clone and install

```bash
git clone https://github.com/rumianagent-hub/strava-for-life.git
cd strava-for-life
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the root with your Firebase config:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Get these values from **Firebase Console → Project Settings → Your apps → Web app → SDK setup and configuration**.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Firebase setup

### Firestore rules and indexes

```bash
firebase deploy --only firestore --project <your-project-id>
```

### Cloud Functions

```bash
cd functions && npm install && cd ..
firebase deploy --only functions --project <your-project-id>
```

## Weekly summary email (optional)

The `weeklySummaryEmail` Cloud Function runs every Sunday at 8 AM UTC. It is **disabled by default** — it checks for a `RESEND_API_KEY` environment variable and exits silently if it is not set.

To enable:

1. Create a free account at [resend.com](https://resend.com) and get an API key.
2. Set the secret on your Firebase project:

```bash
firebase functions:secrets:set RESEND_API_KEY --project <your-project-id>
```

3. Redeploy functions:

```bash
firebase deploy --only functions --project <your-project-id>
```

4. In the app, set `weeklyEmailEnabled: true` on your Firestore user document.

## Project structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── app/
│   │   ├── page.tsx                # Dashboard
│   │   ├── goals/
│   │   │   ├── new/page.tsx        # Create goal
│   │   │   └── [goalId]/page.tsx   # Goal detail
│   │   └── squads/
│   │       ├── page.tsx            # Squad list
│   │       └── [squadId]/page.tsx  # Squad detail
│   └── join/[inviteCode]/page.tsx  # Join squad via invite link
├── components/
│   ├── pages/                      # Client-side page components
│   ├── NavBar.tsx
│   ├── GoalCard.tsx
│   ├── CheckinGrid.tsx
│   └── Providers.tsx
├── contexts/
│   └── AuthContext.tsx
└── lib/
    ├── firebase.ts
    ├── firestore.ts
    ├── types.ts
    └── dates.ts
functions/
└── src/index.ts                    # weeklySummaryEmail Cloud Function
```

## Deployment

The app is deployed to **Vercel** (automatic deploys on push to `main`).

Firestore rules, indexes, and Cloud Functions are deployed via the Firebase CLI.

## License

MIT
