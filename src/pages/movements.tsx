import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { withAuth } from "@/lib/withAuth";
import MovementForm from "@/components/MovementForm";

type Movement = {
  id: string;
  concept: string;
  amount: number;
  date: string;
  user: { name: string; email: string };
};

function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    fetch("/api/movements")
      .then((res) => res.json())
      .then((data) => {
        // Fix: API returns {movements: [...]} but we need the array
        setMovements(data.movements || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading movements:", error);
        setError("Error al cargar movimientos");
        setLoading(false);
      });
  }, []);

  const handleAddMovement = async (data: {
    concept: string;
    amount: number;
    date: string;
  }) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId: session?.user?.id }),
      });
      if (!res.ok) throw new Error("Error al guardar movimiento");
      const responseData = await res.json();
      // Fix: API returns {movement: {...}} but we need the movement object
      const newMovement = responseData.movement || responseData;
      setMovements([newMovement, ...movements]);
      setShowModal(false);
    } catch {
      setError("Error al guardar movimiento");
    } finally {
      setSubmitting(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Gestión de Ingresos y Egresos</h1>
        {isAdmin && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            onClick={() => setShowModal(true)}
            disabled={submitting}
          >
            Nuevo
          </button>
        )}
      </div>
      {loading && <div>Cargando movimientos...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Concepto</th>
                <th className="px-4 py-2 border">Monto</th>
                <th className="px-4 py-2 border">Fecha</th>
                <th className="px-4 py-2 border">Usuario</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(movements) && movements.length > 0 ? (
                movements.map((m) => (
                  <tr key={m.id} className="even:bg-gray-50">
                    <td className="px-4 py-2 border">{m.concept}</td>
                    <td className="px-4 py-2 border">${m.amount.toFixed(2)}</td>
                    <td className="px-4 py-2 border">
                      {new Date(m.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border">
                      {m.user?.name || m.user?.email}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 border text-center text-gray-500">
                    No hay movimientos registrados. {isAdmin && "¡Crea el primero!"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <MovementForm
          onSubmit={handleAddMovement}
          onClose={() => setShowModal(false)}
        />
      )}
    </main>
  );
}

export default withAuth(MovementsPage);
