# Verifikasi profil instruktur publik

| Kriteria | Status | Bukti |
|----------|--------|--------|
| Slug unit test | PASS | `go test ./internal/service/... -run InstructorSlug` |
| API profil by slug (prod) | PASS | `curl …/api/instructors/slug/muhammad-mahathir-s-kom` → 200 + kursus terbit |
| Statistik dari agregat DB | PASS | `GET /api/instructors/2` → students/reviews/rating selaras |
| Grep dummy di `src/` (FE) | PASS | tidak ada stat instruktur hardcode |
| E2E kursus → profil | PASS | `npx playwright test e2e/instructor-public.spec.ts` |
| Form edit sosial guru | PASS | `ProfilePage` → `PUT /instructor/public-profile` |
| Scroll landing (Lenis) | PASS | `lerp 0.125`, `duration 1.05`, `wheelMultiplier 0.98` |

Integrasi MySQL (`instructor_public_api_test.go`) dijalankan di CI backend saat `skillopa_test` tersedia.
