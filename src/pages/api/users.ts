import { withAuth } from "@/lib/apiAuth";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // GET /api/users - Obtener todos los usuarios
    res.status(200).json({
      message: "Lista de usuarios obtenida exitosamente",
      users: [
        { id: "1", name: "Usuario 1", email: "usuario1@ejemplo.com", role: "ADMIN" },
        { id: "2", name: "Usuario 2", email: "usuario2@ejemplo.com", role: "USER" },
      ],
    });
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}

export default withAuth(handler);
