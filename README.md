# 🚀 Bright Prodigy Node.js App

A minimal Node.js web app designed for easy deployment to Google Cloud Run using Docker.

---

## Features

- Responds with **“🚀 Bright Prodigy is Live!”** on all HTTP requests
- No dependencies except Node.js (no frameworks, no frontend libraries)
- Ready for containerized deployment with Docker and Google Cloud Build

---

## File Structure

- `index.js` — Node.js HTTP server
- `package.json` — Project configuration
- `Dockerfile` — Container build instructions
- `README.md` — This file

---

## Running Locally

1. **Install Node.js** (version 18 or higher recommended)
2. Start the server:
   ```sh
   npm start
   ```
3. Visit [http://localhost:8080](http://localhost:8080) in your browser

Or test with curl:
```sh
curl http://localhost:8080
```

---

## Deploying to Google Cloud Run

### 1. Build the Docker image

```sh
docker build -t gcr.io/YOUR_PROJECT_ID/bright-prodigy-app .
```

### 2. Push the image to Google Container Registry

```sh
docker push gcr.io/YOUR_PROJECT_ID/bright-prodigy-app
```

### 3. Deploy to Cloud Run

```sh
gcloud run deploy bright-prodigy-app \
  --image gcr.io/YOUR_PROJECT_ID/bright-prodigy-app \
  --platform managed \
  --region YOUR_REGION \
  --allow-unauthenticated \
  --port 8080
```

Replace `YOUR_PROJECT_ID` and `YOUR_REGION` with your GCP project and region.

---

## Cloud Build Trigger (Optional)

To automate builds on git push:

1. In Google Cloud Console, go to **Cloud Build > Triggers**
2. Create a trigger for your repo, using the Dockerfile in the root directory
3. Set the build steps to build and push the image as above

---


🟢 Triggered first deployment manually on May 6 x3
