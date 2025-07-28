import { withAuth } from "@/lib/apiAuth";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = (req as any).session;
    
    const debugInfo = {
      session: {
        exists: !!session,
        user: session?.user ? {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
          // Mostrar todas las propiedades del usuario
          allProperties: Object.keys(session.user),
          rawUser: session.user
        } : null,
        // Mostrar toda la sesión
        rawSession: session
      },
      headers: {
        authorization: req.headers.authorization,
        cookie: req.headers.cookie ? "Present" : "Missing"
      },
      timestamp: new Date().toISOString()
    };

    res.status(200).json(debugInfo);
  } catch (error) {
    res.status(500).json({ 
      error: "Error debugging session",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export default withAuth(handler); 