# App Pegawai (Nuxt 4 + Prisma + PostgreSQL)

Aplikasi CRUD sederhana untuk daftar & kelola pegawai (ASN dan Non-ASN), dengan
field jabatan yang menyesuaikan otomatis berdasarkan status kepegawaian:
- **PNS/PPPK** → pilih Jenis Jabatan (Fungsional / Struktural / Pelaksana), field jabatan berubah sesuai pilihan
- **Non-ASN** → langsung isi field Jabatan (Pramubakti, Satpam, dll)

## Cara Setup

1. **Copy file-file ini ke dalam folder project Nuxt kamu**, timpa file yang sama namanya (nuxt.config.ts, app.vue, package.json).

2. **Install dependency tambahan:**
   ```bash
   npm install @nuxt/ui @prisma/client zod
   npm install -D prisma
   ```

3. **Setup file environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env`, sesuaikan `DATABASE_URL` dengan kredensial PostgreSQL kamu (user, password, nama database).

4. **Buat database** (jika belum ada):
   ```bash
   psql -U postgres -c "CREATE DATABASE app_pegawai;"
   ```

5. **Jalankan migrasi Prisma** (ini akan membuat tabel di database sekaligus generate Prisma Client):
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Isi data contoh (opsional tapi disarankan, biar ada Departemen buat dropdown):**
   ```bash
   npx prisma db seed
   ```
   Kalau perintah di atas belum dikenali, tambahkan dulu di `package.json`:
   ```json
   "prisma": {
     "seed": "tsx prisma/seed.ts"
   }
   ```
   lalu `npm install -D tsx` dan jalankan lagi `npx prisma db seed`.

7. **Jalankan aplikasi:**
   ```bash
   npm run dev
   ```
   Buka di http://localhost:3000

## Struktur

- `prisma/schema.prisma` — skema database model Pegawai (dengan field jabatan kondisional)
- `server/api/pegawai/` — REST API CRUD pegawai, termasuk validasi kondisional (Zod `superRefine`)
- `app/pages/pegawai/` — halaman list, tambah, edit pegawai
- `app/components/FormPegawai.vue` — form dinamis: field jabatan berubah sesuai Status Pegawai & Jenis Jabatan yang dipilih

## Field Pegawai

| Field | Keterangan |
|---|---|
| Nama, NIP, Email | Selalu diisi |
| Status Pegawai | PNS / PPPK / Non-ASN |
| Golongan | Opsional, contoh: III/a (relevan terutama untuk PNS) |
| Jenis Jabatan | Hanya muncul jika status PNS/PPPK: Fungsional / Struktural / Pelaksana |
| Nama Jabatan Fungsional + Jenjang | Muncul jika Jenis Jabatan = Fungsional |
| Nama Jabatan Pelaksana + Jenjang | Muncul jika Jenis Jabatan = Pelaksana |
| Jabatan Struktural | Muncul jika Jenis Jabatan = Struktural |
| Jabatan (Non-ASN) | Muncul jika status = Non-ASN, langsung diisi (Pramubakti, Satpam, dll) |

## Yang belum ada (langkah selanjutnya)

- Autentikasi & login (belum ada proteksi halaman)
- Role/hak akses (admin vs staff)
- Halaman detail profil pegawai
- Export data ke Excel/PDF
