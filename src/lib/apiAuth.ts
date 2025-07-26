import { auth } from "@/lib/auth";
import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

export async function getServerSession(req: NextApiRequest) {
  try {
    const session = await auth.api.getSession({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      headers: req.headers as any,
    });
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export function withAuth(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const session = await getServerSession(req);
      
      if (!session) {
        return res.status(401).json({ error: "No autorizado" });
      }

      // Add session to request object
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).session = session;
      
      return handler(req, res);
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(500).json({ error: "Error de autenticación" });
    }
  };
}
