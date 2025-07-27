import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Direct import without dynamic import
    const { prisma } = await import('@/lib/prisma');
    
    // Try a simple connection test
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    res.status(200).json({
      status: 'success',
      message: 'Prisma client is working correctly',
      timestamp: new Date().toISOString(),
      test_result: result,
    });
    
  } catch (error) {
    console.error('Prisma check failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Prisma client failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}