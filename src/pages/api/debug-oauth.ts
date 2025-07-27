import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const logs: string[] = [];
    
    logs.push('🔍 Starting OAuth diagnostic...');
    
    // Test 1: Environment variables
    logs.push('📋 Environment variables:');
    logs.push(`- GITHUB_ID exists: ${!!process.env.GITHUB_ID}`);
    logs.push(`- GITHUB_SECRET exists: ${!!process.env.GITHUB_SECRET}`);
    logs.push(`- DATABASE_URL exists: ${!!process.env.DATABASE_URL}`);
    
    if (process.env.GITHUB_ID) {
      logs.push(`- GITHUB_ID starts with: ${process.env.GITHUB_ID.substring(0, 8)}...`);
    }
    
    // Test 2: Better Auth configuration
    try {
      logs.push('🔐 Testing Better Auth import...');
      const { auth } = await import('@/lib/auth');
      logs.push('✅ Better Auth imported successfully');
      
      // Test 3: Try to access auth handler
      logs.push('🔧 Testing auth handler...');
      const handler = auth.handler;
      logs.push('✅ Auth handler accessible');
      
      // Test 4: Check current URL
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers.host;
      const currentUrl = `${protocol}://${host}`;
      logs.push(`🌐 Current URL: ${currentUrl}`);
      logs.push(`🌐 Auth should be at: ${currentUrl}/api/auth/`);
      
    } catch (authError) {
      logs.push(`❌ Better Auth error: ${authError}`);
    }
    
    // Test 5: Database connection
    try {
      logs.push('🗄️ Testing database connection...');
      const { prisma } = await import('@/lib/prisma');
      await prisma.$connect();
      logs.push('✅ Database connected successfully');
      await prisma.$disconnect();
    } catch (dbError) {
      logs.push(`❌ Database error: ${dbError}`);
    }
    
    res.status(200).json({
      status: 'oauth_diagnostic_complete',
      timestamp: new Date().toISOString(),
      logs: logs,
      request_info: {
        method: req.method,
        url: req.url,
        headers: {
          host: req.headers.host,
          'x-forwarded-proto': req.headers['x-forwarded-proto'],
          'user-agent': req.headers['user-agent'],
        }
      }
    });
    
  } catch (error) {
    console.error('OAuth diagnostic failed:', error);
    res.status(500).json({
      status: 'oauth_diagnostic_failed',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });
  }
}