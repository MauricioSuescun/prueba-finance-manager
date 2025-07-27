import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Test if Better Auth can be imported without errors
    const { betterAuth } = await import("better-auth");
    
    const testAuth = betterAuth({
      database: {
        provider: "postgresql",
        url: process.env.DATABASE_URL || "test",
      },
      socialProviders: {
        github: {
          clientId: process.env.GITHUB_ID || "test",
          clientSecret: process.env.GITHUB_SECRET || "test",
        },
      },
    });

    res.status(200).json({
      status: 'ok',
      message: 'Better Auth can be initialized',
      config: {
        hasDatabase: !!process.env.DATABASE_URL,
        hasGithubId: !!process.env.GITHUB_ID,
        hasGithubSecret: !!process.env.GITHUB_SECRET,
      }
    });
  } catch (error) {
    console.error('Better Auth test failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Better Auth initialization failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}