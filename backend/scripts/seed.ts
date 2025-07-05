// backend/scripts/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Starting database seed...');

    // Check if demo user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: 'demo@example.com' }
    });

    if (existingUser) {
      console.log('✅ Demo user already exists');
      console.log('User ID:', existingUser.id);
      return;
    }

    // Create demo user
    const hashedPassword = await bcrypt.hash('DemoPassword123!', 12);
    
    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@example.com',
        username: 'demo',
        passwordHash: hashedPassword,
        firstName: 'Demo',
        lastName: 'User',
      }
    });

    console.log('✅ Demo user created:', demoUser.id);

    // Create sample transactions for the demo user
    const sampleTransactions = [
      {
        amount: 25.50,
        category: 'Food & Dining',
        description: 'Lunch at restaurant',
        date: new Date('2025-01-05'),
      },
      {
        amount: 85.00,
        category: 'Groceries',
        description: 'Weekly grocery shopping',
        date: new Date('2025-01-04'),
      },
      {
        amount: 12.99,
        category: 'Entertainment',
        description: 'Netflix subscription',
        date: new Date('2025-01-03'),
      },
      {
        amount: 45.20,
        category: 'Transportation',
        description: 'Gas for car',
        date: new Date('2025-01-02'),
      },
      {
        amount: 120.00,
        category: 'Bills & Utilities',
        description: 'Electric bill',
        date: new Date('2025-01-01'),
      },
      {
        amount: 15.75,
        category: 'Food & Dining',
        description: 'Coffee shop',
        date: new Date('2024-12-31'),
      },
      {
        amount: 67.99,
        category: 'Shopping',
        description: 'Online purchase',
        date: new Date('2024-12-30'),
      },
    ];

    for (const transaction of sampleTransactions) {
      await prisma.transaction.create({
        data: {
          ...transaction,
          userId: demoUser.id,
        }
      });
    }

    console.log(`✅ Created ${sampleTransactions.length} sample transactions`);
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });