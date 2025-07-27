import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Basic security check
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer migrate-now') {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Use Authorization: Bearer migrate-now header'
    });
  }

  try {
    console.log('🔄 Starting FULL database migration...');
    
    // Import Prisma
    const { prisma } = await import('@/lib/prisma');
    
    // Check current tables
    console.log('📋 Checking existing tables...');
    const existingTables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Existing tables:', existingTables);

    const logs: string[] = [];
    logs.push("🔄 Starting FULL database migration...");
    logs.push(`📋 Existing tables: ${JSON.stringify(existingTables)}`);

    // Create User table
    logs.push("👤 Creating User table...");
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "user" (
          "id" TEXT NOT NULL,
          "name" TEXT,
          "email" TEXT NOT NULL,
          "emailVerified" BOOLEAN NOT NULL DEFAULT false,
          "image" TEXT,
          "phone" TEXT,
          "role" TEXT NOT NULL DEFAULT 'ADMIN',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          
          CONSTRAINT "user_pkey" PRIMARY KEY ("id")
        );
      `;
      
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "user_email_key" 
        ON "user"("email");
      `;
      
      logs.push("✅ User table created");
    } catch (error) {
      logs.push(`❌ User table creation failed: ${error}`);
    }

    // Create Session table
    logs.push("🎫 Creating Session table...");
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "session" (
          "id" TEXT NOT NULL,
          "expiresAt" TIMESTAMP(3) NOT NULL,
          "token" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          "ipAddress" TEXT,
          "userAgent" TEXT,
          "userId" TEXT NOT NULL,
          
          CONSTRAINT "session_pkey" PRIMARY KEY ("id")
        );
      `;
      
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "session_token_key" 
        ON "session"("token");
      `;
      
      // Add foreign key constraint
      await prisma.$executeRaw`
        ALTER TABLE "session" 
        ADD CONSTRAINT "session_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      `;
      
      logs.push("✅ Session table created");
    } catch (error) {
      logs.push(`❌ Session table creation failed: ${error}`);
    }

    // Create Account table  
    logs.push("🔗 Creating Account table...");
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "account" (
          "id" TEXT NOT NULL,
          "accountId" TEXT NOT NULL,
          "providerId" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "accessToken" TEXT,
          "refreshToken" TEXT,
          "idToken" TEXT,
          "accessTokenExpiresAt" TIMESTAMP(3),
          "refreshTokenExpiresAt" TIMESTAMP(3),
          "scope" TEXT,
          "password" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          
          CONSTRAINT "account_pkey" PRIMARY KEY ("id")
        );
      `;
      
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "account_providerId_accountId_key" 
        ON "account"("providerId", "accountId");
      `;
      
      // Add foreign key constraint
      await prisma.$executeRaw`
        ALTER TABLE "account" 
        ADD CONSTRAINT "account_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      `;
      
      logs.push("✅ Account table created");
    } catch (error) {
      logs.push(`❌ Account table creation failed: ${error}`);
    }

    // Create Movement table
    logs.push("💰 Creating Movement table...");
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "movement" (
          "id" TEXT NOT NULL,
          "concept" TEXT NOT NULL,
          "amount" DOUBLE PRECISION NOT NULL,
          "date" TIMESTAMP(3) NOT NULL,
          "userId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          
          CONSTRAINT "movement_pkey" PRIMARY KEY ("id")
        );
      `;
      
      // Add foreign key constraint
      await prisma.$executeRaw`
        ALTER TABLE "movement" 
        ADD CONSTRAINT "movement_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
      `;
      
      logs.push("✅ Movement table created");
    } catch (error) {
      logs.push(`❌ Movement table creation failed: ${error}`);
    }

    // Verify all tables were created
    logs.push("🔍 Verifying all tables...");
    const finalTables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    const result = {
      status: 'success',
      timestamp: new Date().toISOString(),
      message: 'FULL database migration completed successfully',
      logs: logs,
      tablesCreated: finalTables
    };

    console.log('🎉 FULL Migration completed successfully');
    res.status(200).json(result);

  } catch (error) {
    console.error('❌ FULL Migration failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}