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
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error || "Error de permisos o de servidor");
        }
        return res.json();
      })
      .then((data) => {
        // Fix: API returns {users: [...]} but we need the array
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Error al cargar usuarios");
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
      const responseData = await res.json();
      // Fix: API returns {user: {...}} but we need the user object
      const updated = responseData.user || responseData;
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
              {Array.isArray(users) && users.length > 0 ? (
                users.map((u) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 border text-center text-gray-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
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

export default withAuth(UsersPage);
