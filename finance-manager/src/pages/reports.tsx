import { withAuth } from "@/lib/withAuth";

function ReportsPage() {
  // Aquí irá la lógica y UI de reportes
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Reportes Financieros</h1>
      {/* Gráfico, saldo y botón de descarga CSV */}
    </main>
  );
}

export default withAuth(ReportsPage, ["ADMIN"]); // Solo administradores
