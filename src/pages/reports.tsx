import React, { useState, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Papa from "papaparse";
import { withAuth } from "../lib/withAuth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Movement = {
  id: string;
  concept: string;
  amount: number;
  date: string;
  user: { name: string; email: string };
};

function ReportsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/reports")
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error || "Error de permisos o de servidor");
        }
        return res.json();
      })
      .then((data) => {
        setMovements(data.movements);
        setSaldo(data.saldo);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Error al cargar reportes");
        setLoading(false);
      });
  }, []);

  // Agrupar movimientos por mes y tipo (ingreso/egreso)
  const chartData = useMemo(() => {
    const grouped: Record<string, { ingresos: number; egresos: number }> = {};
    movements.forEach((m) => {
      const month = new Date(m.date).toLocaleString("default", {
        year: "numeric",
        month: "short",
      });
      if (!grouped[month]) grouped[month] = { ingresos: 0, egresos: 0 };
      if (m.amount >= 0) grouped[month].ingresos += m.amount;
      else grouped[month].egresos += Math.abs(m.amount);
    });
    const labels = Object.keys(grouped).sort();
    return {
      labels,
      datasets: [
        {
          label: "Ingresos",
          data: labels.map((l) => grouped[l].ingresos),
          backgroundColor: "#22c55e",
        },
        {
          label: "Egresos",
          data: labels.map((l) => grouped[l].egresos),
          backgroundColor: "#ef4444",
        },
      ],
    };
  }, [movements]);

  const handleDownloadCSV = () => {
    if (!movements.length) return;
    const csv = Papa.unparse(
      movements.map((m) => ({
        Concepto: m.concept,
        Monto: m.amount,
        Fecha: new Date(m.date).toLocaleDateString(),
        Usuario: m.user?.name || m.user?.email,
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `reporte-movimientos.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Reportes Financieros</h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
          onClick={handleDownloadCSV}
          disabled={!movements.length}
        >
          Descargar CSV
        </button>
      </div>
      {loading && <div>Cargando reportes...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <>
          <div className="mb-6">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" as const },
                  title: { display: true, text: "Movimientos por mes" },
                },
              }}
            />
          </div>
          <div className="mb-4 text-lg font-semibold">
            Saldo actual:{" "}
            <span className="text-blue-700">${saldo.toFixed(2)}</span>
          </div>
        </>
      )}
    </main>
  );
}

export default withAuth(ReportsPage, ["ADMIN"]);
