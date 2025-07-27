import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const envCheck = {
      GITHUB_ID: !!process.env.GITHUB_ID,
      GITHUB_SECRET: !!process.env.GITHUB_SECRET,
      DATABASE_URL: !!process.env.DATABASE_URL,
      DIRECT_URL: !!process.env.DIRECT_URL,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    };

    // Test import of auth
    let authImportStatus = "not_tested";
    let authConfig = null;
    
    try {
      const { auth } = await import("@/lib/auth");
      authImportStatus = "success";
      authConfig = {
        hasHandler: typeof auth.handler === "function",
        hasDatabase: !!auth.options?.database,
        hasSocialProviders: !!auth.options?.socialProviders?.github,
      };
    } catch (error) {
      authImportStatus = `error: ${error instanceof Error ? error.message : 'Unknown'}`;
    }

    // Test Prisma import
    let prismaStatus = "not_tested";
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.$queryRaw`SELECT 1`;
      prismaStatus = "connected";
    } catch (error) {
      prismaStatus = `error: ${error instanceof Error ? error.message : 'Unknown'}`;
    }

    const result = {
      status: "better_auth_debug",
      timestamp: new Date().toISOString(),
      environment_variables: envCheck,
      auth_import: authImportStatus,
      auth_config: authConfig,
      prisma_connection: prismaStatus,
      request_info: {
        method: req.method,
        url: req.url,
        host: req.headers.host,
      },
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('Better Auth debug failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}