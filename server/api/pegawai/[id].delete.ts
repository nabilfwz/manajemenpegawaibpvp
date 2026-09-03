export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  try {
    await prisma.pegawai.delete({ where: { id } })
    setResponseStatus(event, 204)
    return null
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Pegawai tidak ditemukan' })
  }
})
