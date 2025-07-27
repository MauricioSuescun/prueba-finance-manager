import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Log everything for debugging
  console.log('🔍 Migration endpoint called');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);

  try {
    // Accept any method for now, just check for auth
    const needsAuth = req.query.execute === 'true' || req.method === 'POST';
    
    if (needsAuth) {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== 'Bearer migrate-now') {
        return res.status(401).json({ 
          error: 'Unauthorized',
          message: 'Use Authorization: Bearer migrate-now header',
          received: authHeader || 'No authorization header'
        });
      }
    }

    // If it's just a test, return info
    if (!needsAuth) {
      return res.status(200).json({
        status: 'ready',
        message: 'Migration endpoint is working',
        usage: {
          test: 'GET /api/run-migration',
          execute: 'POST /api/run-migration with Authorization: Bearer migrate-now',
          or: 'GET /api/run-migration?execute=true with Authorization: Bearer migrate-now'
        }
      });
    }

    // Execute migration
    console.log('🔄 Starting database migration...');
    
    // Import Prisma
    const { prisma } = await import('@/lib/prisma');
    
    // Check if verification table exists
    const verificationExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'verification'
      );
    `;
    
    console.log('Verification table exists:', verificationExists);

    // Create table if it doesn't exist
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
      message: 'Database migration completed successfully',
      tableExisted: !!tableCheck?.exists,
      verificationTableColumns: finalCheck
    };

    console.log('🎉 Migration completed successfully');
    return res.status(200).json(result);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    return res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}