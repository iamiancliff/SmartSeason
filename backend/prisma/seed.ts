// prisma/seed.ts
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Prisma v7: pass the adapter directly to the constructor
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const agentPassword = await bcrypt.hash('agent123', 10);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@smartseason.com' },
    update: {},
    create: {
      email: 'admin@smartseason.com',
      name: 'System Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create Agent
  const agent = await prisma.user.upsert({
    where: { email: 'agent@smartseason.com' },
    update: {},
    create: {
      email: 'agent@smartseason.com',
      name: 'Field Agent One',
      password: agentPassword,
      role: 'AGENT',
    },
  });

  console.log('Seed completed successfully');
  console.log({ admin: admin.email, agent: agent.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Senior practice: close the pool too
  });
