import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.pegawai.upsert({
    where: { nip: '198501012010011001' },
    update: {},
    create: {
      nama: 'Ahmad Fauzi',
      nip: '198501012010011001',
      email: 'ahmad.fauzi@instansi.go.id',
      status: 'PNS',
      golongan: 'III/c',
      jenisJabatan: 'FUNGSIONAL',
      namaJabatanFungsional: 'Instruktur',
      jenjangFungsional: 'Ahli Madya'
    }
  })

  await prisma.pegawai.upsert({
    where: { nip: '199003152015022002' },
    update: {},
    create: {
      nama: 'Siti Rahma',
      nip: '199003152015022002',
      email: 'siti.rahma@instansi.go.id',
      status: 'PNS',
      golongan: 'IV/a',
      jenisJabatan: 'STRUKTURAL',
      jabatanStruktural: 'Kepala Bidang'
    }
  })

  await prisma.pegawai.upsert({
    where: { nip: '199212102019031003' },
    update: {},
    create: {
      nama: 'Budi Santoso',
      nip: '199212102019031003',
      email: 'budi.santoso@instansi.go.id',
      status: 'PPPK',
      jenisJabatan: 'PELAKSANA',
      namaJabatanPelaksana: 'Analis Kepegawaian',
      jenjangPelaksana: 'Ahli Pertama'
    }
  })

  await prisma.pegawai.upsert({
    where: { nip: 'NA-0001' },
    update: {},
    create: {
      nama: 'Dedi Kurniawan',
      nip: 'NA-0001',
      email: 'dedi.kurniawan@instansi.go.id',
      status: 'NON_ASN',
      jabatanNonAsn: 'Satpam'
    }
  })

  console.log('Seed selesai.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
