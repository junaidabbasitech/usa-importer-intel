
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

## Deployment: Frontend (Firebase)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase init` and select "Hosting".
3. Set the public directory to `dist`.
4. **IMPORTANT**: Set the `VITE_API_URL` environment variable during the build process to point to your Render backend URL.
   - Example: `VITE_API_URL=https://your-backend.onrender.com npm run build`
5. Run `firebase deploy`.

## Environment Variables
- `GEMINI_API_KEY`: Required for AI features.
- `VITE_API_URL`: (Frontend only) The URL of your deployed backend. If left empty, it assumes the backend is on the same origin.
