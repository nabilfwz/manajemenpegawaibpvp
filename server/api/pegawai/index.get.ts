export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = (query.search as string) || ''
  const statusFilter = (query.status as string) || ''
  const page = Number(query.page) || 1
  const pageSize = 10

  const where: any = {}

  if (search) {
    where.OR = [
      { nama: { contains: search, mode: 'insensitive' as const } },
      { nip: { contains: search, mode: 'insensitive' as const } },
      { email: { contains: search, mode: 'insensitive' as const } }
    ]
  }

  if (statusFilter === 'PNS' || statusFilter === 'PPPK' || statusFilter === 'NON_ASN') {
    where.status = statusFilter
  }

  const [data, total] = await Promise.all([
    prisma.pegawai.findMany({
      where,
      orderBy: { nama: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.pegawai.count({ where })
  ])

  return {
    data,
    meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
  }
})
