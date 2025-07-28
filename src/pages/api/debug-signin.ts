import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const logs: string[] = [];
    
    logs.push('🔍 Testing sign-in flow...');
    
    // Test 1: Try to import and configure Better Auth
    try {
      logs.push('🔐 Importing Better Auth...');
      const { auth } = await import('@/lib/auth');
      logs.push('✅ Better Auth imported successfully');
      
      // Test 2: Get the current URL info
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers.host;
      const baseUrl = `${protocol}://${host}`;
      
      logs.push(`🌐 Base URL: ${baseUrl}`);
      
      // Test 3: Check if we can access the GitHub provider
      logs.push('🔧 Testing GitHub provider...');
      
      // Test 4: Try to simulate the sign-in request
      logs.push('📡 Testing sign-in endpoint...');
      
      // Create a mock request to the sign-in endpoint
      const signInUrl = `${baseUrl}/api/auth/sign-in/social`;
      logs.push(`📍 Sign-in URL: ${signInUrl}`);
      
      // Test 5: Check environment variables again
      logs.push('📋 Environment check:');
      logs.push(`- GITHUB_ID: ${process.env.GITHUB_ID ? 'configured' : 'missing'}`);
      logs.push(`- GITHUB_SECRET: ${process.env.GITHUB_SECRET ? 'configured' : 'missing'}`);
      logs.push(`- NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || 'not set'}`);
      
      // Test 6: Try to access the auth handler directly
      logs.push('🛠️ Testing auth handler...');
      try {
        // Check if auth handler is accessible
        if (typeof auth.handler === 'function') {
          logs.push('✅ Auth handler accessible');
        } else {
          logs.push('❌ Auth handler not accessible');
        }
        
        // Try to get available routes
        logs.push('📚 Available auth routes should include:');
        logs.push('- GET/POST /api/auth/sign-in/social');
        logs.push('- GET/POST /api/auth/callback/github');
        logs.push('- GET /api/auth/session');
        
      } catch (handlerError) {
        logs.push(`❌ Auth handler error: ${handlerError}`);
      }
      
    } catch (authError) {
      logs.push(`❌ Better Auth error: ${authError}`);
      logs.push(`❌ Error stack: ${authError instanceof Error ? authError.stack : 'No stack'}`);
    }
    
    res.status(200).json({
      status: 'signin_debug_complete',
      timestamp: new Date().toISOString(),
      logs: logs,
      recommendation: 'Check if Better Auth routes are properly registered'
    });
    
  } catch (error) {
    console.error('Sign-in debug failed:', error);
    res.status(500).json({
      status: 'signin_debug_failed',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });
  }
}