import { withAuth } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/movements:
 *   get:
 *     summary: Obtener todos los movimientos financieros
 *     description: Retorna la lista completa de movimientos con información del usuario
 *     tags: [Movements]
 *     security:
 *       - session: []
 *     responses:
 *       200:
 *         description: Lista de movimientos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Movimientos obtenidos exitosamente"
 *                 movements:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "clx1234567890"
 *                       concept:
 *                         type: string
 *                         example: "Salario enero"
 *                       amount:
 *                         type: number
 *                         example: 2500.00
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T00:00:00.000Z"
 *                       user:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Juan Pérez"
 *                           email:
 *                             type: string
 *                             example: "juan@example.com"
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *   post:
 *     summary: Crear un nuevo movimiento financiero
 *     description: Crea un nuevo ingreso o egreso en el sistema
 *     tags: [Movements]
 *     security:
 *       - session: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - concept
 *               - amount
 *               - date
 *               - userId
 *             properties:
 *               concept:
 *                 type: string
 *                 description: Descripción del movimiento
 *                 example: "Salario enero"
 *               amount:
 *                 type: number
 *                 description: Monto del movimiento (positivo para ingresos, negativo para egresos)
 *                 example: 2500.00
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Fecha del movimiento
 *                 example: "2024-01-15"
 *               userId:
 *                 type: string
 *                 description: ID del usuario que crea el movimiento
 *                 example: "clx1234567890"
 *     responses:
 *       201:
 *         description: Movimiento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Movimiento creado exitosamente"
 *                 movement:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "clx1234567890"
 *                     concept:
 *                       type: string
 *                       example: "Salario enero"
 *                     amount:
 *                       type: number
 *                       example: 2500.00
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T00:00:00.000Z"
 *       400:
 *         description: Datos inválidos o faltantes
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      // GET /api/movements - Obtener todos los movimientos desde DB
      console.log("📋 Getting movements from database...");
      
      const movements = await prisma.movement.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      console.log(`✅ Found ${movements.length} movements`);
      
      res.status(200).json({
        message: "Movimientos obtenidos exitosamente",
        movements: movements,
      });
      
    } else if (req.method === "POST") {
      // POST /api/movements - Crear nuevo movimiento en DB
      const { concept, amount, date, userId } = req.body;
      
      if (!concept || !amount || !date || !userId) {
        return res.status(400).json({ 
          error: "Faltan campos requeridos: concept, amount, date, userId" 
        });
      }

      console.log("💰 Creating new movement:", { concept, amount, date, userId });
      
      const newMovement = await prisma.movement.create({
        data: {
          concept,
          amount: parseFloat(amount),
          date: new Date(date),
          userId,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      console.log("✅ Movement created:", newMovement);
      
      res.status(201).json({
        message: "Movimiento creado exitosamente",
        movement: newMovement,
      });
      
    } else {
      res.status(405).json({ error: "Método no permitido" });
    }
  } catch (error) {
    console.error("❌ Error in movements API:", error);
    res.status(500).json({ 
      error: "Error interno del servidor",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export default withAuth(handler);
