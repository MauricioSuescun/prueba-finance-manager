import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

/**
 * Middleware para requerir rol de administrador
 */
export function withAdminAuth(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const session = await getServerSession(req);
      
      if (!session) {
        console.log("❌ No session found in admin middleware");
        return res.status(401).json({ error: "No autorizado" });
      }

      console.log("🔍 Admin middleware - Session user:", {
        id: session.user?.id,
        email: session.user?.email,
        name: session.user?.name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        role: (session.user as any)?.role,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        allUserProps: Object.keys(session.user as any || {})
      });

      // Get user role from database since it's not in session
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
      });

      const userRole = user?.role;
      const isAdmin = userRole === "ADMIN" || userRole === "admin";
      
      console.log("🔍 Admin check:", { userRole, isAdmin, userId: session.user.id });

      if (!isAdmin) {
        console.log("❌ Access denied - User role:", userRole);
        return res.status(403).json({ 
          error: "Acceso denegado - Solo administradores",
          debug: { userRole, isAdmin }
        });
      }

      console.log("✅ Admin access granted for user:", session.user?.email);

      // Add session to request object
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).session = session;
      
      return handler(req, res);
    } catch (error) {
      console.error("Admin auth middleware error:", error);
      return res.status(500).json({ error: "Error de autenticación" });
    }
  };
}
