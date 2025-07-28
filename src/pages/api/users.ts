import { withAdminAuth } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios del sistema
 *     description: Retorna la lista completa de usuarios registrados (solo para administradores)
 *     tags: [Users]
 *     security:
 *       - session: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lista de usuarios obtenida exitosamente"
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "clx1234567890"
 *                       name:
 *                         type: string
 *                         nullable: true
 *                         example: "Juan Pérez"
 *                       email:
 *                         type: string
 *                         example: "juan@example.com"
 *                       phone:
 *                         type: string
 *                         nullable: true
 *                         example: "+1234567890"
 *                       role:
 *                         type: string
 *                         enum: [ADMIN, USER]
 *                         example: "ADMIN"
 *                       emailVerified:
 *                         type: boolean
 *                         example: true
 *                       image:
 *                         type: string
 *                         nullable: true
 *                         example: "https://avatars.githubusercontent.com/u/123456"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T00:00:00.000Z"
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Solo administradores
 *       500:
 *         description: Error interno del servidor
 */

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

export default withAdminAuth(handler);
