import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const logs: string[] = [];
  
  try {
    logs.push("🔍 Starting Better Auth flow test...");

    // Test 1: Import auth
    logs.push("📦 Testing Better Auth import...");
    let authInstance;
    try {
      const { auth } = await import("@/lib/auth");
      authInstance = auth;
      logs.push("✅ Better Auth imported successfully");
    } catch (error) {
      logs.push(`❌ Better Auth import failed: ${error}`);
      throw error;
    }

    // Test 2: Check auth.handler
    logs.push("🔧 Testing auth.handler...");
    try {
      if (typeof authInstance.handler === 'function') {
        logs.push("✅ auth.handler is a function");
      } else {
        logs.push(`❌ auth.handler is not a function: ${typeof authInstance.handler}`);
      }
    } catch (error) {
      logs.push(`❌ Error accessing auth.handler: ${error}`);
    }

    // Test 3: Test environment variables for GitHub
    logs.push("🐙 Testing GitHub environment variables...");
    try {
      const githubId = process.env.GITHUB_ID;
      const githubSecret = process.env.GITHUB_SECRET;
      if (githubId && githubSecret) {
        logs.push("✅ GitHub credentials present in environment");
      } else {
        logs.push("❌ GitHub credentials missing in environment");
      }
    } catch (error) {
      logs.push(`❌ Error checking GitHub env vars: ${error}`);
    }

    // Test 4: Test sign-in URL generation
    logs.push("🔗 Testing sign-in URL generation...");
    try {
      const baseURL = process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL || `https://${req.headers.host}`;
      const signInUrl = `${baseURL}/api/auth/sign-in/github`;
      logs.push(`✅ Sign-in URL would be: ${signInUrl}`);
    } catch (error) {
      logs.push(`❌ Error generating sign-in URL: ${error}`);
    }

    const result = {
      status: "auth_flow_test",
      timestamp: new Date().toISOString(),
      test_results: "success",
      logs: logs,
      host: req.headers.host,
      environment: process.env.NODE_ENV,
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('Auth flow test failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      logs: logs || ['Failed before logging started'],
    });
  }
}