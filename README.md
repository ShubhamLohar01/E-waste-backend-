# E-Waste Backend (API)

Express + Postgres API for the E-Waste platform. Runs as a **single long-running
Node process** — one in-memory store, one writer. This is the deployment model
the app is designed for (no serverless split-brain / data loss).

## Run locally

```bash
npm install            # or pnpm install
cp .env.example .env   # then fill in the values
npm run dev            # http://localhost:3000  (auto-restarts on change)
# npm start            # production: node server.js
npm test               # vitest (server/**/*.test.js)
```

## Environment

See `.env.example`. Required: `DATABASE_URL`, `JWT_SECRET`, and the `AWS_*` keys
for S3 image/invoice storage.

## Deploy to Render

1. Push this folder to its own GitHub repo.
2. Render → **New → Web Service** → connect the repo.
3. Settings:
   - **Runtime:** Node
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Instance type:** free works.
   - ⚠️ **Single instance only — do NOT enable autoscaling / multiple instances.**
     The app holds state in memory; multiple instances would reintroduce the
     data-loss bug. One instance is required.
4. Add the environment variables from `.env.example`.
5. Render provides `PORT` automatically; the server reads it.

Note the resulting URL (e.g. `https://ewaste-backend.onrender.com`) — the
frontend forwards `/api/*` to it.

> Free Render instances sleep after ~15 min idle; the first request after that
> is slow while it wakes and re-hydrates from Postgres. Data is safe regardless.
