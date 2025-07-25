import type { NextApiRequest, NextApiResponse } from "next";
import swaggerSpec from "@/lib/swagger";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Servir el JSON de OpenAPI en /api/docs/swagger.json
  if (req.method === "GET") {
    res.setHeader("Content-Type", "application/json");
    res.status(200).end(JSON.stringify(swaggerSpec));
    return;
  }
  res.status(404).end();
}
