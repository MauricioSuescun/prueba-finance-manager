import { withAuth } from "@/lib/withAuth";

function MovementsPage() {
  // Aquí irá la lógica y UI de movimientos
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestión de Ingresos y Egresos</h1>
      {/* Tabla y botón Nuevo */}
    </main>
  );
}

export default withAuth(MovementsPage); // Todos los roles pueden acceder
