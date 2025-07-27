import { toNodeHandler } from "better-auth/node";
import { auth } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

// Disallow body parsing, we will parse it manually
export const config = { api: { bodyParser: false } };

const handler = toNodeHandler(auth.handler);

export default async function debugAuthHandler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`🔍 [AUTH HANDLER] ${req.method} ${req.url}`);
  console.log(`🔍 [AUTH HANDLER] Query:`, req.query);
  console.log(`🔍 [AUTH HANDLER] Headers:`, Object.keys(req.headers));
  console.log(`🔍 [AUTH HANDLER] User-Agent:`, req.headers['user-agent']);
  console.log(`🔍 [AUTH HANDLER] Host:`, req.headers.host);
  console.log(`🔍 [AUTH HANDLER] Referer:`, req.headers.referer);
  
  try {
    console.log(`🔍 [AUTH HANDLER] Calling Better Auth handler...`);
    
    // Add timeout protection
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Handler timeout after 25 seconds')), 25000);
    });
    
    const result = await Promise.race([
      handler(req, res),
      timeoutPromise
    ]);
    
    console.log(`✅ [AUTH HANDLER] Success`);
    return result;
  } catch (error) {
    console.error(`❌ [AUTH HANDLER] Error:`, error);
    console.error(`❌ [AUTH HANDLER] Error name:`, error instanceof Error ? error.name : 'Unknown');
    console.error(`❌ [AUTH HANDLER] Error message:`, error instanceof Error ? error.message : 'Unknown error');
    console.error(`❌ [AUTH HANDLER] Error stack:`, error instanceof Error ? error.stack : 'No stack');
    
    // Try to get more context about the error
    if (error instanceof Error) {
      console.error(`❌ [AUTH HANDLER] Error constructor:`, error.constructor.name);
      console.error(`❌ [AUTH HANDLER] Error toString:`, error.toString());
    }
    
    // Send a more detailed error response
    if (!res.headersSent) {
      return res.status(500).json({
        error: 'Authentication handler failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        query: req.query,
        errorType: error instanceof Error ? error.constructor.name : 'Unknown',
      });
    }
    throw error;
  }
}