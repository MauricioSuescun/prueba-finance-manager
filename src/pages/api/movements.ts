import { withAuth } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

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
