
# USA Importer Intel - Full Stack

This application is structured as a Full-Stack application with a React frontend and an Express backend.

## Architecture
- **Frontend**: React + Vite (located in root, `App.tsx`, etc.)
- **Backend**: Express (located in `server/`, entry point `server.ts`)

## Local Development
1. Run `npm install`
2. Run `npm run dev` (starts both Express and Vite)

## Deployment: Backend (Render)
1. Create a new "Web Service" on Render.
2. Connect your repository.
3. Set **Environment Variables**:
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: Your Google Gemini API Key
4. **Build Command**: `npm install && npm run build`
5. **Start Command**: `npm start`

## Deployment: Frontend (GitHub Pages)
The repo ships with `.github/workflows/deploy-pages.yml`, which builds and publishes `dist/` to GitHub Pages on every push to `main`.

One-time setup:
1. Deploy the backend somewhere public (see "Deployment: Backend (Render)" above). You need its public URL, e.g. `https://usa-importer-intel.onrender.com`.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. In the repo: **Settings → Secrets and variables → Actions → Variables → New repository variable**:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend.example.com/api` (include the `/api` suffix)
4. Push to `main` (or run the workflow from the Actions tab). Published URL: `https://<user>.github.io/<repo>/`.

If `VITE_API_URL` is not set the site still builds, but the header will show "Backend: Offline" because same-origin `/api/*` requests 404 on a static host.

## Deployment: Frontend (Firebase) — optional
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase init` and select "Hosting".
3. Set the public directory to `dist`.
4. **IMPORTANT**: Set the `VITE_API_URL` environment variable during the build process to point to your Render backend URL.
   - Example: `VITE_API_URL=https://your-backend.onrender.com/api npm run build`
5. Run `firebase deploy`.

## Environment Variables
- `GEMINI_API_KEY`: Required for AI features (backend only — never exposed to the frontend).
- `VITE_API_URL`: (Frontend build-time only) The URL of your deployed backend including the `/api` suffix, e.g. `https://your-backend.onrender.com/api`. If unset, the frontend calls same-origin `/api/*` — correct for local dev (Vite proxies to `localhost:3000`) but broken on a static host.
- `VITE_BASE`: (Frontend build-time only) Base path for non-root deploys, e.g. `/usa-importer-intel/` for GitHub Pages project sites. The workflow sets this automatically from the repo name.
