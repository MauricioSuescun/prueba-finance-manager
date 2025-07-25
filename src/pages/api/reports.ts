import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuth } from "@/lib/apiAuth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Ejemplo: obtener resumen de movimientos y saldo
    const movements = await prisma.movement.findMany();
    const saldo = movements.reduce((acc: number, m) => acc + m.amount, 0);
    return res.status(200).json({ movements, saldo });
  }
  res.status(405).json({ error: "Method not allowed" });
}

export default withApiAuth(handler, ["ADMIN"]); // Solo administradores
