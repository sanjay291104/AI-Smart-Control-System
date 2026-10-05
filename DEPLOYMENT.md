# Deployment

This project deploys as a Vercel frontend and two Render web services (Express API and FastAPI AI service). MongoDB must be provided separately, for example with MongoDB Atlas.

## 1. Push the project to a Git provider

Connect the repository to Vercel and Render. This workspace currently has no Git repository, so deployment providers cannot import it until it is committed and pushed to a repository you control.

## 2. Deploy the Render services

In Render, create a Blueprint from the repository root and use `render.yaml`. Configure the prompted values:

- `MONGO_URI`: MongoDB Atlas connection string. In Atlas, allow network access from Render as appropriate.
- `CLIENT_URL`: the final Vercel origin, such as `https://your-app.vercel.app` (no trailing slash).
- `AI_SERVICE_URL`: the public HTTPS URL for the `ai-smart-traffic-ai` service, such as `https://ai-smart-traffic-ai.onrender.com` (no trailing slash).

The blueprint generates `JWT_SECRET`. Keep all secrets in the provider environment settings; do not commit them.

The AI service loads YOLO and PyTorch and may download model weights during startup. Select a Render instance with enough memory for these dependencies and inference; a small/free instance may run out of memory or sleep. Keep the API and AI service in the same region where possible. Confirm `https://<ai-service-host>/health` returns `{"ok":true,...}` before testing image or video analysis.

## 3. Deploy the Vercel frontend

Import the repository into Vercel and set:

- Root Directory: `client`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL=https://<api-service-host>/api`

The `client/vercel.json` rewrite supports React Router routes on refresh. Redeploy after changing environment variables.

## 4. Verify

- Open `https://<api-service-host>/api/health`.
- Open `https://<ai-service-host>/health`.
- Load the Vercel URL, register/log in, then test history, manual control, and a representative image/video.
- Configure the backend's `CLIENT_URL` to exactly match the Vercel origin so CORS allows browser requests.

YOLOv8n is a general-purpose model, not a validated traffic or emergency-vehicle detector. Validate counts against labelled samples and use a task-specific model before relying on the signal recommendations operationally.
