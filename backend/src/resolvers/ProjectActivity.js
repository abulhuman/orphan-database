function project({ id }, _args, { prisma }) {
  return prisma.projectActivity.findUnique({ where: { id } }).project()
}

function dailyActivities({ id }, _args, { prisma }) {
  return prisma.projectActivity.findUnique({ where: { id } }).dailyActivities()
}

function socialWorker({ id }, _args, { prisma }) {
  return prisma.projectActivity.findUnique({ where: { id } }).socialWorker()
}

module.exports = {
  project,
  dailyActivities,
  socialWorker
}
