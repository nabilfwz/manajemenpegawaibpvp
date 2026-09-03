import { z } from 'zod'

const baseSchema = z.object({
  nama: z.string().min(2, 'Nama wajib diisi'),
  nip: z.string().min(5, 'NIP minimal 5 karakter'),
  email: z.string().email('Format email tidak valid'),
  status: z.enum(['PNS', 'PPPK', 'NON_ASN']),
  jenisJabatan: z.enum(['FUNGSIONAL', 'STRUKTURAL', 'PELAKSANA']).optional().nullable(),
  namaJabatanFungsional: z.string().optional().nullable(),
  jenjangFungsional: z.string().optional().nullable(),
  namaJabatanPelaksana: z.string().optional().nullable(),
  jenjangPelaksana: z.string().optional().nullable(),
  jabatanStruktural: z.string().optional().nullable(),
  jabatanNonAsn: z.string().optional().nullable(),
  golongan: z.string().optional().nullable()
})

// Validasi kondisional: pastikan field jabatan yang wajib diisi sesuai status & jenis jabatan
const pegawaiSchema = baseSchema.superRefine((data, ctx) => {
  if (data.status === 'NON_ASN') {
    if (!data.jabatanNonAsn) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['jabatanNonAsn'], message: 'Jabatan wajib diisi untuk Non-ASN' })
    }
    return
  }

  // ASN (PNS / PPPK)
  if (!data.jenisJabatan) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['jenisJabatan'], message: 'Jenis jabatan wajib dipilih untuk ASN' })
    return
  }

  if (data.jenisJabatan === 'FUNGSIONAL') {
    if (!data.namaJabatanFungsional) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['namaJabatanFungsional'], message: 'Nama jabatan fungsional wajib diisi' })
    }
    if (!data.jenjangFungsional) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['jenjangFungsional'], message: 'Jenjang wajib diisi' })
    }
  }

  if (data.jenisJabatan === 'PELAKSANA') {
    if (!data.namaJabatanPelaksana) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['namaJabatanPelaksana'], message: 'Nama jabatan pelaksana wajib diisi' })
    }
    if (!data.jenjangPelaksana) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['jenjangPelaksana'], message: 'Jenjang wajib diisi' })
    }
  }

  if (data.jenisJabatan === 'STRUKTURAL' && !data.jabatanStruktural) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['jabatanStruktural'], message: 'Jabatan struktural wajib diisi' })
  }
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = pegawaiSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Data tidak valid',
      data: parsed.error.flatten().fieldErrors
    })
  }

  const existing = await prisma.pegawai.findFirst({
    where: { OR: [{ nip: parsed.data.nip }, { email: parsed.data.email }] }
  })

  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: 'NIP atau email sudah terdaftar'
    })
  }

  const pegawai = await prisma.pegawai.create({ data: parsed.data })

  setResponseStatus(event, 201)
  return pegawai
})
