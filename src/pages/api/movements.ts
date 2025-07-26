import { withAuth } from "@/lib/apiAuth";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // GET /api/movements - Obtener todos los movimientos
    res.status(200).json({
      message: "Movimientos obtenidos exitosamente",
      movements: [
        {
          id: "1",
          concept: "Salario",
          amount: 2500,
          date: "2024-01-15",
          type: "income",
        },
        {
          id: "2",
          concept: "Renta",
          amount: -800,
          date: "2024-01-01",
          type: "expense",
        },
      ],
    });
  } else if (req.method === "POST") {
    // POST /api/movements - Crear nuevo movimiento
    const { concept, amount, date } = req.body;
    res.status(201).json({
      message: "Movimiento creado exitosamente",
      movement: { id: Date.now().toString(), concept, amount, date },
    });
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}

export default withAuth(handler);
