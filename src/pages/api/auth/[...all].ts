import { toNodeHandler } from "better-auth/node";
import { auth } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

// Disallow body parsing, we will parse it manually
export const config = { api: { bodyParser: false } };

const handler = toNodeHandler(auth.handler);

export default async function debugAuthHandler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`🔍 [AUTH HANDLER] ${req.method} ${req.url}`);
  console.log(`🔍 [AUTH HANDLER] Headers:`, Object.keys(req.headers));
  
  try {
    console.log(`🔍 [AUTH HANDLER] Calling Better Auth handler...`);
    const result = await handler(req, res);
    console.log(`✅ [AUTH HANDLER] Success`);
    return result;
  } catch (error) {
    console.error(`❌ [AUTH HANDLER] Error:`, error);
    console.error(`❌ [AUTH HANDLER] Error stack:`, error instanceof Error ? error.stack : 'No stack');
    
    // Send a more detailed error response
    if (!res.headersSent) {
      return res.status(500).json({
        error: 'Authentication handler failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
      });
    }
    throw error;
  }
}