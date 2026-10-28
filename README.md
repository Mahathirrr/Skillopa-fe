# Skillopa Frontend

React single-page application for Skillopa, an Udemy-style online learning platform.

Live: https://skillopa.showcaseproject.my.id

See [docs/DECISIONS.md](docs/DECISIONS.md) for key frontend choices.

## Stack

- React 18, TypeScript, Vite
- React Router v6, TanStack Query, Zustand
- Tailwind CSS v4

## Features

- Course discovery, search, and category browsing
- Course detail with curriculum, reviews, and enrollment
- Video learning player with progress tracking
- Cart, wishlist, and checkout (free and paid)
- My Learning dashboard with progress
- Instructor portal: create courses, build curriculum, manage content
- Certificate download on course completion
- Profile settings

## Environment variables

Create a local `.env` file. Do not commit it.

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8080/api` | Backend API base URL |

Leave empty in production builds for same-origin `/api` via nginx.

## Local development

```bash
cp .env.example .env
npm install
npm run dev
npm run lint
```

Dev server: http://localhost:5173

Requires the backend running on port 8080, or point `VITE_API_URL` to the deployed API.

## Production build

```bash
VITE_API_URL= npm run build
```

Output: `dist/`

## Production

Static files served from `/opt/skillopa/frontend/dist` via nginx.

## CI/CD

GitHub secrets: `DEPLOY_SSH_KEY`, `VPS_HOST`, `VPS_PORT`, `VPS_USER`
