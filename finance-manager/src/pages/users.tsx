import { withAuth } from "@/lib/withAuth";

function UsersPage() {
  // Aquí irá la lógica y UI de usuarios
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      {/* Tabla de usuarios y formulario de edición */}
    </main>
  );
}

export default withAuth(UsersPage, ["ADMIN"]); // Solo administradores
