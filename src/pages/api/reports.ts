import { withAuth } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

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

export default withAuth(handler);
