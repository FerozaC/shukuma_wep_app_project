# Shukuma Project

A full-stack fitness workout web app built with React (Vite) and Node/Express, using MongoDB via Mongoose.

## Tech Stack
- Frontend: React + Vite, Tailwind CSS, Radix UI components
- State/Data: TanStack Query
- Backend: Node.js + Express, JWT auth, bcrypt
- Database: MongoDB (Mongoose)

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB connection string

### Environment
Create a `.env` in project root with:
```
MONGO_URL=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=replace_with_strong_secret
PORT=5000
```

### Install & Run
```powershell
Push-Location "C:\Users\feroza\Documents\shukuma_wep_app_project\shukuma-project"
npm install
npm run dev
```
- Server listens on `http://localhost:5000`
- Vite serves the client from `/` via the backend

### Scripts
- `npm run dev`: Start Express server (serves client)
- `npm run build`: Build client to `dist/public`

## Project Structure
```
shukuma-project/
  client/            # React app
  server/            # Express server
  shared/            # Shared types/schemas
  tailwind.config.ts
  postcss.config.cjs
  vite.config.ts
```

## Notes
- Assets live under `client/src/assets/...`
- Break images are `client/src/assets/cards/Waterbreak1.jpg` and `Waterbreak2.jpg`
- Styling uses CSS variables with Tailwind utilities in `client/src/index.css`

## Deploy
1. Build the client:
```powershell
npm run build
```
2. Serve `server/index.ts` with `PORT` set and `.env` configured.

## Troubleshooting
- Port in use: free `5000` then rerun
```powershell
Get-NetTCPConnection -LocalPort 5000 -State Listen | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```
- PostCSS warnings: Configured via Vite to avoid `from` warnings.
