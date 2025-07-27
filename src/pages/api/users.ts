import { withAuth } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      // GET /api/users - Obtener todos los usuarios desde DB
      console.log("👥 Getting users from database...");
      
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          emailVerified: true,
          image: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      console.log(`✅ Found ${users.length} users`);
      
      res.status(200).json({
        message: "Lista de usuarios obtenida exitosamente",
        users: users,
      });
      
    } else {
      res.status(405).json({ error: "Método no permitido" });
    }
  } catch (error) {
    console.error("❌ Error in users API:", error);
    res.status(500).json({ 
      error: "Error interno del servidor",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export default withAuth(handler);
