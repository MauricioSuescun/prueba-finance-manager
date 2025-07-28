import { withAuth } from "@/lib/withAuth";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import UserEditForm from "@/components/UserEditForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit,
  MoreHorizontal
} from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === "ADMIN").length;
  const regularUsers = users.filter(u => u.role === "USER").length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-600 mt-1">Administra los usuarios del sistema</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                Total Usuarios
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {totalUsers}
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Usuarios registrados
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Administradores
              </CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {adminUsers}
              </div>
              <p className="text-xs text-green-600 mt-1">
                Con permisos de admin
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">
                Usuarios Regulares
              </CardTitle>
              <UserPlus className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {regularUsers}
              </div>
              <p className="text-xs text-purple-600 mt-1">
                Acceso básico
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button variant="outline" className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Lista de Usuarios</CardTitle>
            <CardDescription>
              Gestiona los permisos y información de los usuarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Los usuarios aparecerán aquí cuando se registren'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name || user.email}&background=random`} />
                        <AvatarFallback>
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {user.name || "Sin nombre"}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={user.role === "ADMIN" ? "default" : "secondary"}
                        className={user.role === "ADMIN" ? "bg-blue-100 text-blue-800" : ""}
                      >
                        {user.role}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        className="flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Edit Form Modal */}
      {editUser && (
        <UserEditForm
          user={editUser}
          onSubmit={handleUpdateUser}
          onClose={() => setEditUser(null)}
        />
      )}
    </Layout>
  );
}

export default withAuth(UsersPage);
