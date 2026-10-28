# Architecture decisions (Skillopa frontend)

## React + Vite (not Next.js)

**Decision:** SPA with React Router and client-side data fetching.

**Why:** Portfolio requirement; API is separate Go backend. Simpler deploy as static files on nginx.

## TanStack Query + Zustand

**Decision:** Server state in React Query; auth session in Zustand.

**Why:** Clear split between cacheable API data and small global auth slice.

## API modules under `src/api/`

**Decision:** `src/lib/api.ts` re-exports a composed `api` object from domain modules.

**Why:** Avoid a single giant client file; pages import `api` or module helpers consistently.

## Demo checkout copy

**Decision:** Checkout UI labels payment confirm as platform demo (i18n keys `demoCheckout*`).

**Why:** Matches backend demo payment flow: `createOrderCheckout` → `confirmOrder` on `/checkout`.
