import { PrismaClient } from '@prisma/client';

function getPrisma() {
  let prisma: PrismaClient;
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else { // Reuse on hotloading (development).
    if (!globalThis.prisma) {
      globalThis.prisma = new PrismaClient({
        log: ['warn', 'error'],
      });
    }
    prisma = globalThis.prisma;
  }
  return prisma;
}

const prisma = getPrisma();

export default prisma;