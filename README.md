# Accessibility Suite (prototype)

This repository contains a Vite + React frontend and a small Express backend (including WebSocket support) used for demo accessibility tools (translation, braille conversion, simple profile store).

This project is already pushed to GitHub: https://github.com/Mugesh-lab/prototype

## Quick run (local)

Requirements: `node` (v18+), `npm`

```bash
git clone https://github.com/Mugesh-lab/prototype.git
cd prototype
npm install
# Start backend
npm run server
# In another terminal, start frontend dev server
npm run dev
```

Open the Vite URL (usually `http://localhost:5173`) and the backend runs on `http://localhost:4000`.

## One-container production (Docker)

I added a `Dockerfile` so you can build a single container that serves both the frontend (static `dist/`) and backend.

Build and run locally with Docker:

```bash
docker build -t accessibility-prototype:latest .
docker run -p 4000:4000 accessibility-prototype:latest
```

Then open `http://localhost:4000` — the frontend is served from the same origin as the backend, so all `/api/*` routes work without CORS issues.

## Deploy options (permanent public URL)

- Render (recommended): create a new service from Docker or from the GitHub repo. If using Docker, push the image to a registry and create a Render Web Service.
- Fly.io: `flyctl` can deploy the container image built from this repo.
- Railway: link your GitHub repo and deploy the service.

All of the above support a permanent public URL. Choose the provider you prefer; if you give me an API key or allow me to use an account, I can deploy it for you.

## Notes
- Do not commit secrets. No `.env` files were found in the repo.
- If you want a split approach (frontend on Vercel, backend on Render), tell me and I can scaffold that instead.
# Accessibility Suite

Frontend-only prototype built with React, Vite, Tailwind CSS, Framer Motion and Zustand for state.

Setup

```bash
cd /Users/reena/prototype
npm install
npm run dev
```

Notes
- This app is frontend-only. Some features use browser APIs (Web Speech, MediaDevices).
- Accessibility features include theme toggles, high-contrast, dyslexia font, reduce motion.
