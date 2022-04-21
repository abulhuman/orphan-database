function user({ id }, _args, { prisma }) {
  return prisma.socialWorker.findUnique({ where: { id } }).user();
}

function districts({ id }, _args, { prisma }) {
  return prisma.socialWorker.findUnique({ where: { id } }).districts();
}

function villages({ id }, _args, { prisma }) {
  return prisma.socialWorker.findUnique({ where: { id } }).villages();
}

function orphans({ id }, _args, { prisma }) {
  return prisma.socialWorker.findUnique({ where: { id } }).orphans();
}

function projectActivities({ id }, _args, { prisma }) {
  return prisma.socialWorker.findUnique({ where: { id } }).projectActivities();
}

module.exports = {
  user,
  districts,
  villages,
  orphans,
  projectActivities
};
