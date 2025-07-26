import { withAuth } from "@/lib/apiAuth";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // GET /api/users/[id] - Obtener usuario por ID
    const { id } = req.query;
    res.status(200).json({
      message: `Obteniendo usuario con ID: ${id}`,
      user: { id, name: "Usuario Ejemplo", email: "usuario@ejemplo.com" },
    });
  } else if (req.method === "PUT") {
    // PUT /api/users/[id] - Actualizar usuario
    const { id } = req.query;
    res.status(200).json({ message: `Usuario ${id} actualizado exitosamente` });
  } else if (req.method === "DELETE") {
    // DELETE /api/users/[id] - Eliminar usuario
    const { id } = req.query;
    res.status(200).json({ message: `Usuario ${id} eliminado exitosamente` });
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}

export default withAuth(handler);
