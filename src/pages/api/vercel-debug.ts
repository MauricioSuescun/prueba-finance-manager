import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check for Vercel-specific environment variables
    const vercelEnv = {
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
      VERCEL_REGION: process.env.VERCEL_REGION,
      VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    };

    // Check request headers for Vercel-specific headers
    const vercelHeaders: Record<string, string | string[] | undefined> = {};
    Object.keys(req.headers).forEach(key => {
      if (key.toLowerCase().includes('vercel') || key.toLowerCase().includes('x-')) {
        vercelHeaders[key] = req.headers[key];
      }
    });

    // Check for authentication-related environment variables
    const authEnvs = {
      AUTH_SECRET: !!process.env.AUTH_SECRET,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      VERCEL_TOKEN: !!process.env.VERCEL_TOKEN,
    };

    const result = {
      status: 'vercel_debug',
      timestamp: new Date().toISOString(),
      vercel_environment: vercelEnv,
      vercel_headers: vercelHeaders,
      auth_environment: authEnvs,
      request_info: {
        method: req.method,
        url: req.url,
        user_agent: req.headers['user-agent'],
        host: req.headers.host,
        referer: req.headers.referer,
      },
      possible_issues: [
        'Check Vercel dashboard for deployment protection settings',
        'Verify no Password Protection is enabled in Vercel project settings',
        'Check if domain is correctly configured in Vercel',
        'Ensure no custom authentication middleware is configured in Vercel',
      ]
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('Vercel debug failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}