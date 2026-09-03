-- CreateEnum
CREATE TYPE "StatusKepegawaian" AS ENUM ('PNS', 'PPPK', 'NON_ASN');

-- CreateEnum
CREATE TYPE "JenisJabatan" AS ENUM ('FUNGSIONAL', 'STRUKTURAL', 'PELAKSANA');

-- CreateTable
CREATE TABLE "Pegawai" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "StatusKepegawaian" NOT NULL,
    "jenisJabatan" "JenisJabatan",
    "namaJabatanFungsional" TEXT,
    "jenjangFungsional" TEXT,
    "namaJabatanPelaksana" TEXT,
    "jenjangPelaksana" TEXT,
    "jabatanStruktural" TEXT,
    "jabatanNonAsn" TEXT,
    "golongan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pegawai_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pegawai_nip_key" ON "Pegawai"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Pegawai_email_key" ON "Pegawai"("email");
