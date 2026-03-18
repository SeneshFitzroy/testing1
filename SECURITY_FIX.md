# Firebase API Key Security Fix

## What Changed
Firebase config is now loaded from environment variables instead of hardcoded values. This removes secrets from the source code and fixes GitHub Secret Scanning alerts.

## ⚠️ CRITICAL: Rotate Your Exposed Keys
The previous API keys were leaked in git history. You **must**:
1. Go to [Firebase Console](https://console.firebase.google.com/) → your project
2. Project Settings → General → Your apps
3. For the Web app, you may need to restrict the API key or create a new one in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
4. Restrict the key by HTTP referrer (your domains) to limit abuse

## Local Development
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Add your **new** Firebase API key to `.env`:
   ```
   VITE_FIREBASE_API_KEY=your_new_api_key_here
   ```
3. The other Firebase values in `.env.example` are already filled (they are not secrets)

## Deployment (Vercel / Netlify / etc.)
Add these environment variables in your hosting dashboard:

| Variable | Value |
|----------|-------|
| `VITE_FIREBASE_API_KEY` | Your Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | pusl3122-group-01.firebaseapp.com |
| `VITE_FIREBASE_PROJECT_ID` | pusl3122-group-01 |
| `VITE_FIREBASE_STORAGE_BUCKET` | pusl3122-group-01.firebasestorage.app |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | 562570699070 |
| `VITE_FIREBASE_APP_ID` | 1:562570699070:web:325630c0083f1279eccc6f |
| `VITE_FIREBASE_MEASUREMENT_ID` | G-WCDP418QMK |

**Vercel:** Project → Settings → Environment Variables → Add each variable for Production (and Preview if needed)

## Will This Break Deployment?
- **Before you add env vars:** Yes — the app will not connect to Firebase
- **After you add env vars in Vercel/hosting:** No — the app works the same as before
- `.env` is gitignored, so local keys are never committed
