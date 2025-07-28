import { withAdminAuth } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    
    if (typeof id !== 'string') {
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    if (req.method === "GET") {
      // GET /api/users/[id] - Obtener usuario por ID
      console.log(`👤 Getting user by ID: ${id}`);
      
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          emailVerified: true,
          image: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.status(200).json({
        message: `Usuario obtenido exitosamente`,
        user: user,
      });
      
    } else if (req.method === "PUT") {
      // PUT /api/users/[id] - Actualizar usuario
      const { name, role } = req.body;
      
      if (!name || !role) {
        return res.status(400).json({ 
          error: "Faltan campos requeridos: name, role" 
        });
      }

      console.log(`✏️ Updating user ${id}:`, { name, role });
      
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          name,
          role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          emailVerified: true,
          image: true,
          createdAt: true,
        },
      });

      console.log(`✅ User updated:`, updatedUser);
      
      res.status(200).json({
        message: "Usuario actualizado exitosamente",
        user: updatedUser,
      });
      
    } else if (req.method === "DELETE") {
      // DELETE /api/users/[id] - Eliminar usuario
      console.log(`🗑️ Deleting user: ${id}`);
      
      await prisma.user.delete({
        where: { id },
      });

      console.log(`✅ User deleted: ${id}`);
      
      res.status(200).json({ 
        message: "Usuario eliminado exitosamente",
        id: id,
      });
      
    } else {
      res.status(405).json({ error: "Método no permitido" });
    }
  } catch (error) {
    console.error("❌ Error in user [id] API:", error);
    res.status(500).json({ 
      error: "Error interno del servidor",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export default withAdminAuth(handler);
