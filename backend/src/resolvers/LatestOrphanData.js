function educationalRecord({ id }, _args, { prisma }) {
  return prisma.latestOrphanData
    .findUnique({ where: { id } })
    .educationalRecord()
}

module.exports = {
    educationalRecord
}