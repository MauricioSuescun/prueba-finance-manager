import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const logs: string[] = [];
    
    logs.push('🔍 Starting Prisma diagnostic...');
    
    // Test 1: Basic environment check
    logs.push('📋 Environment variables:');
    logs.push(`- NODE_ENV: ${process.env.NODE_ENV}`);
    logs.push(`- DATABASE_URL exists: ${!!process.env.DATABASE_URL}`);
    logs.push(`- DIRECT_URL exists: ${!!process.env.DIRECT_URL}`);
    
    // Test 2: Try to import Prisma
    try {
      logs.push('📦 Importing Prisma...');
      const { PrismaClient } = await import('@prisma/client');
      logs.push('✅ Prisma Client imported successfully');
      
      // Test 3: Try to create Prisma instance
      logs.push('🔧 Creating Prisma instance...');
      const prisma = new PrismaClient({
        log: ['error'],
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
      });
      logs.push('✅ Prisma instance created');
      
      // Test 4: Try to connect
      logs.push('🔌 Testing database connection...');
      await prisma.$connect();
      logs.push('✅ Database connected successfully');
      
      // Test 5: Try a simple query
      logs.push('📊 Testing simple query...');
      const userCount = await prisma.user.count();
      logs.push(`✅ User count query successful: ${userCount} users`);
      
      // Test 6: Check tables exist
      logs.push('📋 Checking table structure...');
      try {
        await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
        logs.push('✅ Table structure query successful');
      } catch (tableError) {
        logs.push(`❌ Table structure error: ${tableError}`);
      }
      
      await prisma.$disconnect();
      logs.push('✅ Database disconnected');
      
    } catch (prismaError) {
      logs.push(`❌ Prisma error: ${prismaError}`);
      logs.push(`❌ Error details: ${JSON.stringify(prismaError, null, 2)}`);
    }
    
    // Test 7: Better Auth import test
    try {
      logs.push('🔐 Testing Better Auth import...');
      await import('better-auth');
      logs.push('✅ Better Auth imported successfully');
    } catch (authError) {
      logs.push(`❌ Better Auth import error: ${authError}`);
    }
    
    res.status(200).json({
      status: 'diagnostic_complete',
      timestamp: new Date().toISOString(),
      logs: logs,
    });
    
  } catch (error) {
    console.error('Diagnostic failed:', error);
    res.status(500).json({
      status: 'diagnostic_failed',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });
  }
}