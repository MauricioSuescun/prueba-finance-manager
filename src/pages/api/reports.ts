import { withAuth } from "@/lib/apiAuth";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // GET /api/reports - Generar reporte financiero
    res.status(200).json({
      message: "Reporte generado exitosamente",
      report: {
        totalIncome: 5000,
        totalExpenses: 3000,
        balance: 2000,
        period: "Último mes",
      },
    });
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}

export default withAuth(handler);
