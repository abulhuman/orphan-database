function projectActivity({ id }, _args, { prisma }) {
  return prisma.dailyActivity.findUnique({ where: { id } }).projectActivity()
}

module.exports = {
  projectActivity
}
