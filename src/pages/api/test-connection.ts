import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check environment variables
    const envStatus = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      DIRECT_URL: !!process.env.DIRECT_URL,
      GITHUB_ID: !!process.env.GITHUB_ID,
      GITHUB_SECRET: !!process.env.GITHUB_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NODE_ENV: process.env.NODE_ENV,
    };

    // Try Prisma connection
    let prismaStatus = "not_tested";
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.$queryRaw`SELECT 1`;
      prismaStatus = "connected";
    } catch (error) {
      prismaStatus = `error: ${error instanceof Error ? error.message : 'Unknown'}`;
    }

    const result = {
      status: "connection_test",
      timestamp: new Date().toISOString(),
      environment_variables: envStatus,
      prisma_connection: prismaStatus,
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('Connection test failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}