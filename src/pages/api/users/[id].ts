import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuth } from "@/lib/apiAuth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method === "PUT") {
    const { name, role } = req.body;
    if (!name || !role) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const updated = await prisma.user.update({
      where: { id: id as string },
      data: { name, role },
    });
    return res.status(200).json(updated);
  }
  res.status(405).json({ error: "Method not allowed" });
}

export default withApiAuth(handler, ["ADMIN"]);
