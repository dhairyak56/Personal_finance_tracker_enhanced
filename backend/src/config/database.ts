import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export { prisma };

// Connect to database
export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Disconnect from database
export async function disconnectDatabase() {
  await prisma.$disconnect();
  console.log('📴 Disconnected from database');
}