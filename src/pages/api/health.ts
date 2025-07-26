import { NextApiRequest, NextApiResponse } from 'next';
import { testConnection } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check database connection
    const dbConnected = await testConnection();
    
    // Check environment variables for Better Auth
    const requiredEnvVars = [
      'GITHUB_ID',
      'GITHUB_SECRET',
      'DATABASE_URL'
    ];

    const missingEnvVars = requiredEnvVars.filter(
      envVar => !process.env[envVar]
    );

    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        connected: dbConnected,
      },
      auth: {
        provider: 'better-auth',
        configured: missingEnvVars.length === 0,
        missingEnvVars: missingEnvVars.length > 0 ? missingEnvVars : undefined,
      },
      github: {
        clientId: process.env.GITHUB_ID ? 'configured' : 'missing',
        clientSecret: process.env.GITHUB_SECRET ? 'configured' : 'missing',
      }
    };

    const statusCode = dbConnected && missingEnvVars.length === 0 ? 200 : 500;
    
    res.status(statusCode).json(health);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}