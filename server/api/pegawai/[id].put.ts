import { z } from 'zod'

const updateSchema = z.object({
  nama: z.string().min(2).optional(),
  nip: z.string().min(5).optional(),
  email: z.string().email().optional(),
  status: z.enum(['PNS', 'PPPK', 'NON_ASN']).optional(),
  jenisJabatan: z.enum(['FUNGSIONAL', 'STRUKTURAL', 'PELAKSANA']).optional().nullable(),
  namaJabatanFungsional: z.string().optional().nullable(),
  jenjangFungsional: z.string().optional().nullable(),
  namaJabatanPelaksana: z.string().optional().nullable(),
  jenjangPelaksana: z.string().optional().nullable(),
  jabatanStruktural: z.string().optional().nullable(),
  jabatanNonAsn: z.string().optional().nullable(),
  golongan: z.string().optional().nullable()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const parsed = updateSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Data tidak valid',
      data: parsed.error.flatten().fieldErrors
    })
  }

  try {
    const pegawai = await prisma.pegawai.update({
      where: { id },
      data: parsed.data
    })
    return pegawai
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Pegawai tidak ditemukan' })
  }
})
