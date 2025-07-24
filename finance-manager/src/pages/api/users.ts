import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuth } from "@/lib/apiAuth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, phone: true, role: true } });
    return res.status(200).json(users);
  }
  res.status(405).json({ error: "Method not allowed" });
}

export default withApiAuth(handler, ["ADMIN"]); // Solo administradores
