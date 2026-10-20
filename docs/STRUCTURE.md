# Frontend structure

```
src/
  api/
    client.ts          HTTP client (request, API_URL)
    types.ts           API request/response types
    media.ts           Upload/media URL helpers
    query.ts           Shared query builders
    modules/           Domain API method groups
    index.ts           Merged `api` object + re-exports
  lib/
    api.ts             Barrel re-export (`@/api/index`)
    api-error.ts       Error mapping
  stores/              Zustand (auth, cart, …)
  router/
    routes/            public, student, instructor, admin
    index.tsx          createBrowserRouter wiring
  pages/               Route-level screens
  components/          Shared UI and layout
```

Data flow: **page → store / api → backend**
