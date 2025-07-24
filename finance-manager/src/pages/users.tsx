import { withAuth } from "@/lib/withAuth";
import { useEffect, useState } from "react";
import UserEditForm from "@/components/UserEditForm";

type User = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
};

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar usuarios");
        setLoading(false);
      });
  }, []);

  const handleEdit = (user: User) => setEditUser(user);

  const handleUpdateUser = async (data: {
    id: string;
    name: string;
    role: string;
  }) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/users/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, role: data.role }),
      });
      if (!res.ok) throw new Error("Error al actualizar usuario");
      const updated = await res.json();
      setUsers(
        users.map((u) => (u.id === updated.id ? { ...u, ...updated } : u))
      );
      setEditUser(null);
    } catch {
      setError("Error al actualizar usuario");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
      </div>
      {loading && <div>Cargando usuarios...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Nombre</th>
                <th className="px-4 py-2 border">Correo</th>
                <th className="px-4 py-2 border">Teléfono</th>
                <th className="px-4 py-2 border">Rol</th>
                <th className="px-4 py-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="even:bg-gray-50">
                  <td className="px-4 py-2 border">{u.name || "-"}</td>
                  <td className="px-4 py-2 border">{u.email}</td>
                  <td className="px-4 py-2 border">{u.phone || "-"}</td>
                  <td className="px-4 py-2 border">{u.role}</td>
                  <td className="px-4 py-2 border">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      onClick={() => handleEdit(u)}
                      disabled={submitting}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editUser && (
        <UserEditForm
          user={editUser}
          onSubmit={handleUpdateUser}
          onClose={() => setEditUser(null)}
        />
      )}
    </main>
  );
}

export default withAuth(UsersPage, ["ADMIN"]);
