import { useState } from "react";

interface MovementFormProps {
  onSubmit: (data: { concept: string; amount: number; date: string }) => void;
  onClose: () => void;
}

export default function MovementForm({ onSubmit, onClose }: MovementFormProps) {
  const [concept, setConcept] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!concept.trim() || amount === "" || !date) {
      setError("Todos los campos son obligatorios");
      return false;
    }
    if (typeof amount === "string" || isNaN(amount) || amount <= 0) {
      setError("El monto debe ser un número positivo");
      return false;
    }
    const today = new Date();
    const inputDate = new Date(date);
    if (inputDate > today) {
      setError("La fecha no puede ser futura");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    onSubmit({ concept: concept.trim(), amount: Number(amount), date });
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80 relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-4">Nuevo Movimiento</h2>
        <div className="mb-3">
          <label className="block mb-1">Concepto</label>
          <input
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Monto</label>
          <input
            type="number"
            value={amount}
            min={0.01}
            step={0.01}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-2 disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}
