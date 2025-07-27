import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get the base URL that Better Auth is using
    const baseURL = process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL || `https://${req.headers.host}`;
    
    // This is the callback URL that Better Auth expects
    const callbackURL = `${baseURL}/api/auth/callback/github`;
    
    // This is the sign-in URL
    const signInURL = `${baseURL}/api/auth/sign-in/github`;
    
    const result = {
      status: 'github_config_check',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      baseURL: baseURL,
      urls: {
        signIn: signInURL,
        callback: callbackURL
      },
      environmentVariables: {
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || 'Not set',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
        GITHUB_ID: process.env.GITHUB_ID ? 'Set' : 'Not set',
        GITHUB_SECRET: process.env.GITHUB_SECRET ? 'Set' : 'Not set'
      },
      requestInfo: {
        host: req.headers.host,
        userAgent: req.headers['user-agent'],
        origin: req.headers.origin
      },
      instructions: {
        homepage_url: baseURL,
        authorization_callback_url: callbackURL,
        message: 'Use these URLs in your GitHub OAuth App settings'
      }
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('GitHub config check failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}