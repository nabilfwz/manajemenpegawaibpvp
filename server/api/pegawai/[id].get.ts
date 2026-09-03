export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const pegawai = await prisma.pegawai.findUnique({
    where: { id },
    include: { departemen: true }
  })

  if (!pegawai) {
    throw createError({ statusCode: 404, statusMessage: 'Pegawai tidak ditemukan' })
  }

  return pegawai
})
