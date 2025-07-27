import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle GET for debugging
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'migrate_endpoint_ready',
      timestamp: new Date().toISOString(),
      message: 'Migration endpoint is accessible',
      instructions: {
        method: 'POST',
        header: 'Authorization: Bearer migrate-now',
        description: 'Use POST method with authorization header to execute migration'
      }
    });
  }

  // Only allow POST for actual migration
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed', 
      allowed_methods: ['GET', 'POST'],
      current_method: req.method 
    });
  }

  // Basic security check
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.MIGRATION_SECRET || 'migrate-now'}`) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      expected_header: 'Authorization: Bearer migrate-now',
      received_header: authHeader ? 'Present but incorrect' : 'Missing'
    });
  }

  try {
    console.log('🔄 Starting database migration...');
    
    // Import Prisma
    const { prisma } = await import('@/lib/prisma');
    
    // Check current tables
    console.log('📋 Checking existing tables...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Existing tables:', tables);
    
    // Check if verification table exists
    const verificationExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'verification'
      );
    `;
    console.log('Verification table exists:', verificationExists);

    // If verification table doesn't exist, create it manually
    const tableCheck = Array.isArray(verificationExists) ? verificationExists[0] : verificationExists;
    if (!tableCheck?.exists) {
      console.log('🔧 Creating verification table...');
      
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "verification" (
          "id" TEXT NOT NULL,
          "identifier" TEXT NOT NULL,
          "value" TEXT NOT NULL,
          "expiresAt" TIMESTAMP(3) NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          
          CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
        );
      `;
      
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "verification_identifier_value_key" 
        ON "verification"("identifier", "value");
      `;
      
      console.log('✅ Verification table created');
    } else {
      console.log('✅ Verification table already exists');
    }

    // Verify the table was created
    const finalCheck = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'verification' 
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `;
    
    const result = {
      status: 'success',
      timestamp: new Date().toISOString(),
      message: 'Database migration completed',
      verificationTableColumns: finalCheck,
      allTables: tables
    };

    console.log('🎉 Migration completed successfully');
    res.status(200).json(result);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}