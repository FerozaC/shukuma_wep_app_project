# Shukuma Web App

Live application: https://shukuma-frontend-j3b5.onrender.com/

Shukuma is a Next.js fitness app with an Express + MongoDB backend. Users can try guest workouts or log in to save sessions, track consecutive-day streaks, view history, and more.

## Tech Stack
- Frontend: Next.js 16 (React), Tailwind CSS
- Backend: Node.js + Express, TypeScript
- Database: MongoDB (Atlas)
- Auth: JWT (Bearer)
- Deployment: Render (Frontend + Backend)

## Repository Layout
- `shukuma_project/` — Next.js app (frontend)
  - `app/` — Pages (App Router), e.g. `workout`, `dashboard`, `history`, `profile`
  - `components/` — UI and shared components (e.g., `navbar.tsx`)
  - `lib/` — Utilities and API client (`lib/api.ts`), exercise assets
  - `public/` — Static assets (logos, cards)
- `shukuma_project/backend/` — Express API (TypeScript)
  - `controllers/`, `routes/`, `models/`, `middleware/`
  - Health endpoint: `/api/health`

## Environment Variables
Frontend (`shukuma_project/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
Backend (`shukuma_project/backend/.env`):
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/<database>?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-strong-random-secret
PORT=5000
```
- Replace `<database>` (e.g., `shukuma`).
- URL-encode special characters in the password.
- Allow your IP in MongoDB Atlas Network Access.

## Local Development (WSL)
Frontend:
```bash
cd "/mnt/c/Users/FerozaChishty/Documents/School/shukuma_wep_app_project/shukuma_project"
npm install
npm run dev
```
Backend:
```bash
cd "/mnt/c/Users/FerozaChishty/Documents/School/shukuma_wep_app_project/shukuma_project/backend"
npm install
npm run dev
```
Verify backend:
```bash
curl -s http://localhost:5000/api/health
```
Expected: `{"status":"ok"}`

## Usage
- Guest workout: `/workout-guest` — try cards, filters, flip behavior.
- Authenticated workout: `/workout` — same flow; saves session on finish.
- Advanced workout: `/workout-advanced` — same flow; saves session on finish.
- Completion page: `/workout-complete` — shows stats and support link.
- Dashboard: `/dashboard` — summary and quick start.
- History: `/history` — sessions list and summary stats at top.
- Profile: `/profile` — streak, totals, settings.

## API Overview (Backend)
Base: `http://localhost:5000/api`
- `GET /health` — health check
- `POST /auth/register` — register
- `POST /auth/login` — login
- `GET /auth/me` — current user
- `POST /sessions/save` — save a session (Bearer token required)
- `GET /sessions/history` — session history (Bearer token required)

Streaks are computed by consecutive calendar days:
- If last workout was yesterday, streak increments.
- If already worked out today, streak remains.
- Otherwise, streak resets to 1.

## Deployment (Render)
- Frontend: Web Service (Node 20), rootDir `shukuma_project`, build `npm install && npm run build`, start `npm start`.
- Backend: Web Service (Node 20), rootDir `shukuma_project/backend`, build `npm install && npm run build`, start `npm start`, env `MONGODB_URI`, `JWT_SECRET`, `PORT=5000`.
- Frontend env: `NEXT_PUBLIC_API_URL` set to backend external URL (without trailing `/api`).

## Troubleshooting
- “Failed to fetch” or JSON parse errors: ensure `NEXT_PUBLIC_API_URL` points to backend (`http://localhost:5000`) and backend is running.
- Mongo connection issues: verify Atlas URI has database name, credentials are correct, and your IP is allowlisted.
- Session not appearing in History: confirm save hits `/api/sessions/save` (check browser Network), then user context refresh occurs (frontend will call `/api/auth/me`).

## License
Proprietary — do not copy or redistribute without permission.
