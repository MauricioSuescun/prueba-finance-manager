import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Very simple health check - just like simple-health but with more info
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      auth: {
        provider: 'better-auth',
        github_configured: !!(process.env.GITHUB_ID && process.env.GITHUB_SECRET),
        database_url_configured: !!process.env.DATABASE_URL,
        direct_url_configured: !!process.env.DIRECT_URL,
      },
      version: '1.0.0',
      message: 'Health check endpoint is working'
    };

    res.status(200).json(health);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}