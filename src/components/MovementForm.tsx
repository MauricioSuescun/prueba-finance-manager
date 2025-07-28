import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, DollarSign, Calendar, FileText } from "lucide-react";

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Nuevo Movimiento</CardTitle>
              <CardDescription>
                Registra un nuevo ingreso o egreso
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Concepto
              </label>
              <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Descripción del movimiento"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Monto
              </label>
              <input
                type="number"
                value={amount}
                min={0.01}
                step={0.01}
                onChange={(e) =>
                  setAmount(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Fecha
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={submitting}
              >
                {submitting ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
