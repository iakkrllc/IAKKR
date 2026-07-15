import { PrismaClient } from '@prisma/client';

declare global {
  // allow global prisma during development to avoid exhausting connections
  var __prisma: PrismaClient | undefined;
}

const prisma = global.__prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.__prisma = prisma;

export default prisma;
