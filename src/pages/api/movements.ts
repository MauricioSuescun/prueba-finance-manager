import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuth } from "@/lib/apiAuth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const movements = await prisma.movement.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { date: "desc" },
    });
    return res.status(200).json(movements);
  }
  if (req.method === "POST") {
    const { concept, amount, date, userId } = req.body;
    if (!concept || !amount || !date || !userId) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const movement = await prisma.movement.create({
      data: {
        concept,
        amount: parseFloat(amount),
        date: new Date(date),
        userId,
      },
    });
    return res.status(201).json(movement);
  }
  res.status(405).json({ error: "Method not allowed" });
}

export default withApiAuth(handler); // Todos los autenticados
