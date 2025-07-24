import type { NextApiRequest, NextApiResponse } from "next";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "@/lib/swagger";

// Next.js API route para servir Swagger UI
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Redirigir a /api/docs en modo navegador
  if (req.method === "GET" && req.url === "/") {
    res.setHeader("Content-Type", "text/html");
    // Renderizar Swagger UI
    // @ts-expect-error Swagger UI Express no soporta Next.js API routes directamente
    swaggerUi.setup(swaggerSpec)(req, res);
    return;
  }
  // Servir el JSON de OpenAPI
  if (req.method === "GET" && req.url === "/swagger.json") {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(swaggerSpec));
    return;
  }
  res.status(404).end();
}
