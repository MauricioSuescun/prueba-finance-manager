import { withAdminAuth } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Generar reporte financiero completo
 *     description: Retorna movimientos, saldo actual y estadísticas financieras (solo para administradores)
 *     tags: [Reports]
 *     security:
 *       - session: []
 *     responses:
 *       200:
 *         description: Reporte generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reporte generado exitosamente"
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
 *                 saldo:
 *                   type: number
 *                   description: Saldo actual (suma de todos los movimientos)
 *                   example: 1500.00
 *                 report:
 *                   type: object
 *                   properties:
 *                     totalIncome:
 *                       type: number
 *                       description: Total de ingresos
 *                       example: 5000.00
 *                     totalExpenses:
 *                       type: number
 *                       description: Total de egresos
 *                       example: 3500.00
 *                     balance:
 *                       type: number
 *                       description: Saldo actual
 *                       example: 1500.00
 *                     period:
 *                       type: string
 *                       description: Período del reporte
 *                       example: "Todos los movimientos"
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
      // GET /api/reports - Generar reporte financiero desde DB
      console.log("📊 Generating financial report from database...");
      
      // Get all movements with user information
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
          date: 'desc',
        },
      });

      console.log(`✅ Found ${movements.length} movements for report`);
      
      // Calculate total balance (saldo)
      const saldo = movements.reduce((total, movement) => total + movement.amount, 0);
      
      // Calculate totals
      const totalIncome = movements
        .filter(m => m.amount > 0)
        .reduce((total, m) => total + m.amount, 0);
        
      const totalExpenses = movements
        .filter(m => m.amount < 0)
        .reduce((total, m) => total + Math.abs(m.amount), 0);

      console.log(`📈 Report stats: Income: ${totalIncome}, Expenses: ${totalExpenses}, Balance: ${saldo}`);
      
      res.status(200).json({
        message: "Reporte generado exitosamente",
        movements: movements,
        saldo: saldo,
        report: {
          totalIncome: totalIncome,
          totalExpenses: totalExpenses,
          balance: saldo,
          period: "Todos los movimientos",
        },
      });
      
    } else {
      res.status(405).json({ error: "Método no permitido" });
    }
  } catch (error) {
    console.error("❌ Error in reports API:", error);
    res.status(500).json({ 
      error: "Error interno del servidor",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export default withAdminAuth(handler);
