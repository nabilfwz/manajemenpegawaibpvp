export default defineEventHandler(async () => {
  return prisma.departemen.findMany({ orderBy: { nama: 'asc' } })
})
