# Audit UI Skillopa (sebelum redesign)

Tanggal: 2026-10-28  
Branch baseline screenshot: `docs/design/screenshots/before/` (prod, viewport 360 / 768 / 1280)

## Inventaris rute (41 halaman)

| Area | Path | File |
|------|------|------|
| Publik | `/` | HomePage |
| | `/courses` | CatalogPage |
| | `/courses/:slug` | CourseDetailPage |
| | `/instructor/:slug` | InstructorPublicPage |
| | `/bundles` | BundlesPage |
| | `/login`, `/register`, `/forgot-password`, `/reset-password`, `/auth/callback` | Auth* |
| | `/payment/success` | PaymentSuccessPage |
| | `/legal/*` | Terms, Privacy |
| | `/certificates/view|verify/:code` | Certificate* |
| | `*` | NotFoundPage (baru) |
| Pelajar | `/learn/:slug` | CourseLearnPage |
| | `/my-learning`, `/profile`, `/cart`, `/checkout`, … | student routes |
| Instruktur | `/instructor/*` | 9 halaman |
| Admin | `/admin/*` | 5 halaman |

## Masalah utama (pra-redesign)

1. **Identitas visual**: palet mirip marketplace generik (#5624d0), font sistem, hero foto stok.
2. **Navigasi**: header gelap penuh; kontras dengan konten terang tidak konsisten.
3. **Hierarki**: detail kursus hero gelap + copy EN hardcoded (`students`, `lectures`).
4. **Token**: warna tersebar (`bg-dark`, hex di komponen), sulit dijaga konsistensi.
5. **Empty state**: polos, kurang arah tindakan.
6. **404**: redirect ke beranda tanpa penjelasan.

## Logo (integritas)

SHA-256 sebelum redesign: lihat `docs/design/logo-sha256-before.txt`

- `public/favicon.svg` (mark brand, dipakai `SkillopaLogo`)
- `public/icons.svg` (sprite ikon, bukan mark)

**Dilarang mengubah file logo.**

## Screenshot sebelum

Jalankan ulang: `node scripts/capture-ui-screenshots.mjs --tag=before --base=https://skillopa.showcaseproject.my.id`
