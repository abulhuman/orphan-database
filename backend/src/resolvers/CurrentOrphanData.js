function orphan({ id }, _args, { prisma }) {
  return prisma.orphan.findUnique({ where: { id } });
}

module.exports = {
  orphan
}