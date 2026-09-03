
## Struktur

- `prisma/schema.prisma` — skema database model Pegawai (dengan field jabatan kondisional)
- `server/api/pegawai/` — REST API CRUD pegawai, termasuk validasi kondisional (Zod `superRefine`)
- `app/pages/pegawai/` — halaman list, tambah, edit pegawai
- `app/components/FormPegawai.vue` — form dinamis: field jabatan berubah sesuai Status Pegawai & Jenis Jabatan yang dipilih

## Field Pegawai

| Field | Keterangan |
|---|---|
| Nama, Email | Selalu diisi |
| NIP | Hanya Jika PNS/PPPK |
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
