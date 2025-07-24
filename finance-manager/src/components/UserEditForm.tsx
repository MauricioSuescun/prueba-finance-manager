import { useState } from "react";

interface UserEditFormProps {
  user: { id: string; name: string | null; role: string };
  onSubmit: (data: { id: string; name: string; role: string }) => void;
  onClose: () => void;
}

export default function UserEditForm({
  user,
  onSubmit,
  onClose,
}: UserEditFormProps) {
  const [name, setName] = useState(user.name || "");
  const [role, setRole] = useState(user.role);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!name.trim() || !role) {
      setError("Todos los campos son obligatorios");
      return false;
    }
    if (name.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    onSubmit({ id: user.id, name: name.trim(), role });
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
        <h2 className="text-lg font-bold mb-4">Editar Usuario</h2>
        <div className="mb-3">
          <label className="block mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Rol</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>
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
