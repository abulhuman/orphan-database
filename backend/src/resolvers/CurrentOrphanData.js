function orphan({ id }, _args, { prisma }) {
  return prisma.currentOrphanData.findUnique({ where: { id } }).orphan()
}

function sponsorshipStatus({ id }, _args, { prisma }) {
  return prisma.currentOrphanData
    .findUnique({ where: { id } })
    .sponsorshipStatus()
}

module.exports = {
  orphan,
  sponsorshipStatus
}
