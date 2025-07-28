import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { withAuth } from "@/lib/withAuth";
import Layout from "@/components/Layout";
import MovementForm from "@/components/MovementForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  User,
  Search,
  Filter
} from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    fetch("/api/movements")
      .then((res) => res.json())
      .then((data) => {
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
  const userRole = (session?.user as any)?.role;
  const isAdmin = !!session?.user && (userRole === "ADMIN" || !userRole);

  // Calculate stats
  const totalIncome = movements
    .filter(m => m.amount > 0)
    .reduce((sum, m) => sum + m.amount, 0);
  
  const totalExpenses = movements
    .filter(m => m.amount < 0)
    .reduce((sum, m) => sum + Math.abs(m.amount), 0);
  
  const balance = totalIncome - totalExpenses;

  // Filter movements based on search
  const filteredMovements = movements.filter(movement =>
    movement.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movement.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movement.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Movimientos</h1>
            <p className="text-gray-600 mt-1">Administra tus ingresos y egresos financieros</p>
          </div>
          <Button
            onClick={() => isAdmin && setShowModal(true)}
            disabled={submitting || !isAdmin}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Movimiento
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Ingresos Totales
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                ${totalIncome.toLocaleString()}
              </div>
              <p className="text-xs text-green-600 mt-1">
                Total de ingresos
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">
                Egresos Totales
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">
                ${totalExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-red-600 mt-1">
                Total de egresos
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
                ${balance.toLocaleString()}
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Saldo actual
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
                  placeholder="Buscar movimientos..."
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

        {/* Movements List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Movimientos Recientes</CardTitle>
            <CardDescription>
              Lista de todos los movimientos financieros registrados
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
            ) : filteredMovements.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No se encontraron movimientos' : 'No hay movimientos'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primer movimiento'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMovements.map((movement) => (
                  <div
                    key={movement.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        movement.amount > 0 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {movement.amount > 0 ? (
                          <TrendingUp className="w-6 h-6" />
                        ) : (
                          <TrendingDown className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{movement.concept}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(movement.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {movement.user.name || movement.user.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${
                        movement.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {movement.amount > 0 ? '+' : ''}${movement.amount.toLocaleString()}
                      </div>
                      <Badge variant="secondary" className="mt-1">
                        {movement.amount > 0 ? 'Ingreso' : 'Egreso'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Movement Form Modal */}
      {showModal && (
        <MovementForm
          onSubmit={handleAddMovement}
          onClose={() => setShowModal(false)}
        />
      )}
    </Layout>
  );
}

export default withAuth(MovementsPage);
