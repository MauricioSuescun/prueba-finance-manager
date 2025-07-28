import { withAuth } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = (req as any).session;
    const userId = session?.user?.id;
    
    if (!userId) {
      return res.status(400).json({ error: "No user ID found in session" });
    }

    // Buscar el usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }

    let action = "no_change";
    let updatedUser = user;

    // Si el usuario no tiene rol o no es ADMIN, actualizarlo
    if (!user.role || user.role !== "ADMIN") {
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: "ADMIN" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });
      action = "updated_to_admin";
    }

    const result = {
      message: "User role check completed",
      action,
      user: updatedUser,
      session_user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        role: (session.user as any)?.role || "NOT_IN_SESSION"
      },
      timestamp: new Date().toISOString()
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fixing user role:", error);
    res.status(500).json({ 
      error: "Error fixing user role",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export default withAuth(handler); 