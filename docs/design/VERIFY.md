# Verifikasi redesign (2026-10-28)

## Integritas logo

| File | SHA-256 before | SHA-256 after |
|------|----------------|---------------|
| `public/favicon.svg` | `61bc9a161de58248288e6905425d7180f0624c2865007b97d763fdac12043a66` | identik |
| `public/icons.svg` | `b45fa506195cfcdef406ba9f0c77b36ddc1a7c224040926ec70abc2fdea7b93a` | identik |

## Screenshot

- Sebelum: `docs/design/screenshots/before/` (27 file, prod)
- Sesudah: `docs/design/screenshots/after/` (prod pasca-deploy; sebagian rute bisa gagal jika jaringan putus saat capture)

Regenerasi: `npm run screenshots:ui -- --tag=after --base=https://skillopa.showcaseproject.my.id`

## Perintah uji

```bash
npm run build
npm run lint
npm run lint:design-tokens
npx playwright test e2e/smoke.spec.ts e2e/legal-pages.spec.ts
```

Hasil sesi: build OK, lint OK (oxlint warnings pre-existing), Playwright 5/5 PASS.

## Lighthouse

Belum dijalankan otomatis di CI lingkungan ini. Disarankan manual:

`npx lighthouse https://skillopa.showcaseproject.my.id --preset=desktop --only-categories=performance,accessibility`

Catat skor sebelum (baseline prod lama) vs sesudah di PR.
