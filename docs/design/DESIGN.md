# Skillopa Design System

Dokumen ini mencerminkan implementasi aktual di `src/index.css` (@theme Tailwind v4) dan komponen `src/components/ui/`.

## 1. Prinsip

- **Tenang & jelas**: prioritas membaca materi dan memindai kurikulum.
- **Jujur data**: tidak menambah statistik, ulasan, atau klaim tanpa backend.
- **Satu sumber token**: warna, radius, motion dari `@theme`.
- **Logo sacrosanct**: mark dari `/favicon.svg` tidak diubah.

## 2. Karakter visual

- Primary **#863bff** dan accent **#47bfff** diambil dari file logo.
- Latar **#f6f5fa**, surface putih, teks **#1a1625**.
- Tipografi: **Plus Jakarta Sans** (self-host `@fontsource`, subset Latin).

## 3. Token warna

| Token | Hex | Peran |
|-------|-----|--------|
| brand / primary | #863bff | CTA, link, fokus |
| primary-dark | #6b1fe8 | hover CTA |
| brand-soft | #ede6ff | badge, highlight |
| accent-sky | #47bfff | aksen sparingly |
| foreground | #1a1625 | teks utama |
| muted | #5c5669 | teks sekunder |
| background | #f6f5fa | halaman |
| surface | #ffffff | kartu, header |
| border | #e4e0ec | garis |
| success / warning / error | teal / amber / red | status |
| rating | #f59e0b | bintang |

Alias legacy: `ink`, `dark`, `bg`, `accent` → tetap untuk migrasi bertahap.

## 4. Tipografi

- Display/heading: 700, tracking-tight
- Body: 400-500, line-height 1.5
- Label/caption: 600, text-xs-sm

## 5. Spasi & layout

- Container: `max-w-7xl`, px-4 / lg:px-6
- Grid katalog: 1, 2, lalu 3-4 kolom
- Breakpoint: mobile-first (sm 640, md 768, lg 1024, xl 1280).

## 6. Radius & elevasi

- Kartu: `rounded-xl`
- Tombol/input: `rounded-lg`
- Shadow: sm default kartu, md modal/panel

## 7. Motion

- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- Durasi: 150ms (fast), 220ms (normal)
- `prefers-reduced-motion`: nonaktifkan reveal/hero animation

## 8. Komponen

| Komponen | Path |
|----------|------|
| Button | `ui/button.tsx` |
| Badge | `ui/badge.tsx` |
| EmptyState | `ui/empty-state.tsx` |
| PageContainer / PageHeader | `ui/page-container.tsx` |
| DashboardShell | `layout/DashboardShell.tsx` |
| SkillopaLogo | `SkillopaLogo.tsx` (asset `/favicon.svg`) |

## 9. Halaman utama (wireframe ringkas)

```
[Nav: logo | search | links | auth]

Home: Hero (value prop + CTA) → stats (jika API) → kursus → kategori → langkah → fitur

Catalog: Header + filter bar + grid CourseCard

Detail: Header meta → sticky purchase (desktop) → tabs overview/QA → kurikulum accordion

Learn: Player full width + sidebar kurikulum (foreground shell)

Dashboard: PageHeader + sidebar nav + konten tabel/kartu
```

## 10. Aksesibilitas

- Kontras teks utama on surface ≥ 4.5:1 (foreground on white)
- `:focus-visible` outline primary 2px
- Target sentuh min ~44px pada tombol (`min-h-11`)
- Label form eksplisit (Catalog filters, auth fields)

## 11. Copy & i18n

Bahasa utama Indonesia (`id.json`); EN paralel. Istilah: Kursus, Daftar gratis, Pratinjau gratis, Dikurasi oleh.

## 12. Verifikasi

- Logo SHA: `docs/design/logo-sha256-*.txt`
- Screenshot: `docs/design/screenshots/{before,after}/`
- Token lint: `node scripts/check-design-tokens.mjs`
