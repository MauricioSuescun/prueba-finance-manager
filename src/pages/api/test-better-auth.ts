import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const logs: string[] = [];
    
    logs.push("🔍 Testing Better Auth configuration...");

    // Test 1: Import auth configuration
    logs.push("📦 Testing auth import...");
    let authInstance;
    try {
      const { auth } = await import("@/lib/auth");
      authInstance = auth;
      logs.push("✅ Auth imported successfully");
    } catch (error) {
      logs.push(`❌ Auth import failed: ${error}`);
      throw error;
    }

    // Test 2: Check Prisma connection
    logs.push("🗄️ Testing Prisma connection...");
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.$queryRaw`SELECT 1`;
      logs.push("✅ Prisma connected");
    } catch (error) {
      logs.push(`❌ Prisma connection failed: ${error}`);
    }

    // Test 3: Check verification table
    logs.push("📋 Checking verification table...");
    try {
      const { prisma } = await import("@/lib/prisma");
      const count = await prisma.$queryRaw`SELECT COUNT(*) FROM verification`;
      logs.push(`✅ Verification table accessible, rows: ${JSON.stringify(count)}`);
    } catch (error) {
      logs.push(`❌ Verification table check failed: ${error}`);
    }

    // Test 4: Check user table
    logs.push("👤 Checking user table...");
    try {
      const { prisma } = await import("@/lib/prisma");
      const count = await prisma.$queryRaw`SELECT COUNT(*) FROM "user"`;
      logs.push(`✅ User table accessible, rows: ${JSON.stringify(count)}`);
    } catch (error) {
      logs.push(`❌ User table check failed: ${error}`);
    }

    // Test 5: Check session table
    logs.push("🎫 Checking session table...");
    try {
      const { prisma } = await import("@/lib/prisma");
      const count = await prisma.$queryRaw`SELECT COUNT(*) FROM session`;
      logs.push(`✅ Session table accessible, rows: ${JSON.stringify(count)}`);
    } catch (error) {
      logs.push(`❌ Session table check failed: ${error}`);
    }

    // Test 6: Check account table
    logs.push("🔗 Checking account table...");
    try {
      const { prisma } = await import("@/lib/prisma");
      const count = await prisma.$queryRaw`SELECT COUNT(*) FROM account`;
      logs.push(`✅ Account table accessible, rows: ${JSON.stringify(count)}`);
    } catch (error) {
      logs.push(`❌ Account table check failed: ${error}`);
    }

    // Test 7: Test auth handler existence
    logs.push("🔧 Testing auth handler...");
    try {
      if (typeof authInstance.handler === 'function') {
        logs.push("✅ Auth handler is function");
      } else {
        logs.push(`❌ Auth handler is not function: ${typeof authInstance.handler}`);
      }
    } catch (error) {
      logs.push(`❌ Auth handler check failed: ${error}`);
    }

    const result = {
      status: "better_auth_test",
      timestamp: new Date().toISOString(),
      test_results: "completed",
      logs: logs,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        GITHUB_ID: !!process.env.GITHUB_ID,
        GITHUB_SECRET: !!process.env.GITHUB_SECRET,
        DATABASE_URL: !!process.env.DATABASE_URL,
        DIRECT_URL: !!process.env.DIRECT_URL,
      }
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('Better Auth test failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}