import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testConnection() {
  // Use explicit local connection URL
  const localDbUrl = "postgresql://postgres:password@localhost:5432/taskdb?schema=public";
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: localDbUrl
      }
    }
  });

  try {
    console.log('Testing database connection...');
    console.log('Database URL:', localDbUrl);
    
    // Try to connect and perform a simple query
    await prisma.$connect();
    console.log('Successfully connected to database');
    
    // Optional: Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 + 1 as result`;
    console.log('Test query result:', result);

  } catch (error) {
    console.error('Failed to connect to database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 