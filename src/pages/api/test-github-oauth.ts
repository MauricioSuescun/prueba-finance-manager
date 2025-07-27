import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get the current URL info
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;
    
    // Check environment variables
    const githubId = process.env.GITHUB_ID;
    const githubSecret = process.env.GITHUB_SECRET;
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    
    // Generate OAuth URLs
    const authUrl = `${baseUrl}/api/auth`;
    const callbackUrl = `${baseUrl}/api/auth/callback/github`;
    const signInUrl = `${baseUrl}/api/auth/sign-in/social`;
    
    const result = {
      status: 'github_oauth_test',
      timestamp: new Date().toISOString(),
      urls: {
        base: baseUrl,
        auth_base: authUrl,
        callback: callbackUrl,
        sign_in: signInUrl,
      },
      environment: {
        node_env: process.env.NODE_ENV,
        nextauth_url: nextAuthUrl,
        github_id_configured: !!githubId,
        github_secret_configured: !!githubSecret,
        github_id_prefix: githubId ? githubId.substring(0, 8) + '...' : 'not configured',
      },
      instructions: {
        github_app_homepage_url: baseUrl,
        github_app_callback_url: callbackUrl,
        required_env_vars: [
          'GITHUB_ID',
          'GITHUB_SECRET', 
          'NEXTAUTH_URL (should be: ' + baseUrl + ')',
          'DATABASE_URL'
        ]
      }
    };
    
    res.status(200).json(result);
    
  } catch (error) {
    console.error('GitHub OAuth test failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}