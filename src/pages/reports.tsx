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
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Download,
  Activity,
  PieChart,
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

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
  const [downloading, setDownloading] = useState(false);

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
        setMovements(data.movements || []);
        setSaldo(data.saldo || 0);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Agrupar movimientos por mes y tipo (ingreso/egreso)
  const chartData = useMemo(() => {
    const grouped: Record<string, { ingresos: number; egresos: number }> = {};
    if (Array.isArray(movements)) {
      movements.forEach((m) => {
        const month = new Date(m.date).toLocaleString("default", {
          year: "numeric",
          month: "short",
        });
        if (!grouped[month]) grouped[month] = { ingresos: 0, egresos: 0 };
        if (m.amount >= 0) grouped[month].ingresos += m.amount;
        else grouped[month].egresos += Math.abs(m.amount);
      });
    }
    const labels = Object.keys(grouped).sort();
    return {
      labels,
      datasets: [
        {
          label: "Ingresos",
          data: labels.map((l) => grouped[l].ingresos),
          backgroundColor: "#10b981",
          borderColor: "#059669",
          borderWidth: 1,
        },
        {
          label: "Egresos",
          data: labels.map((l) => grouped[l].egresos),
          backgroundColor: "#ef4444",
          borderColor: "#dc2626",
          borderWidth: 1,
        },
      ],
    };
  }, [movements]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Movimientos por Mes',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(tickValue: string | number) {
            const value = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const handleDownloadCSV = () => {
    if (!Array.isArray(movements) || !movements.length) return;
    
    setDownloading(true);
    const csv = Papa.unparse(
      movements.map((m) => ({
        Concepto: m.concept,
        Monto: m.amount,
        Fecha: new Date(m.date).toLocaleDateString(),
        Usuario: m.user?.name || m.user?.email,
        Tipo: m.amount >= 0 ? 'Ingreso' : 'Egreso'
      }))
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `reporte-financiero-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloading(false);
  };

  // Calculate additional stats
  const totalIncome = movements
    .filter(m => m.amount > 0)
    .reduce((sum, m) => sum + m.amount, 0);
  
  const totalExpenses = movements
    .filter(m => m.amount < 0)
    .reduce((sum, m) => sum + Math.abs(m.amount), 0);
  
  const monthlyAverage = movements.length > 0 ? saldo / Math.max(1, new Set(movements.map(m => 
    new Date(m.date).toLocaleString("default", { year: "numeric", month: "short" })
  )).size) : 0;

  const topCategories = useMemo(() => {
    const categories: Record<string, number> = {};
    movements.forEach(m => {
      const category = m.concept.split(' ')[0]; // Simple categorization
      categories[category] = (categories[category] || 0) + Math.abs(m.amount);
    });
    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  }, [movements]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reportes Financieros</h1>
            <p className="text-gray-600 mt-1">Análisis detallado de tus finanzas</p>
          </div>
          <Button
            onClick={handleDownloadCSV}
            disabled={downloading || movements.length === 0}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Download className="w-4 h-4 mr-2" />
            {downloading ? "Descargando..." : "Descargar CSV"}
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                Balance Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                ${saldo.toLocaleString()}
              </div>
              <p className="text-xs text-blue-600 mt-1 flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                Saldo actual
              </p>
            </CardContent>
          </Card>

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
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                Total acumulado
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
              <p className="text-xs text-red-600 mt-1 flex items-center">
                <ArrowDownRight className="w-3 h-3 mr-1" />
                Total acumulado
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">
                Promedio Mensual
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                ${monthlyAverage.toLocaleString()}
              </div>
              <p className="text-xs text-purple-600 mt-1">
                Por mes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Análisis Mensual
              </CardTitle>
              <CardDescription>
                Comparación de ingresos vs egresos por mes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : movements.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No hay datos para mostrar</p>
                  </div>
                </div>
              ) : (
                <div className="h-64">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Categories */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-green-600" />
                Categorías Principales
              </CardTitle>
              <CardDescription>
                Top 5 categorías por monto total
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : topCategories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <PieChart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No hay categorías para mostrar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topCategories.map(([category, amount], index) => (
                    <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{category}</p>
                          <p className="text-sm text-gray-500">
                            {((amount / totalExpenses) * 100).toFixed(1)}% del total
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-purple-600" />
              Resumen Ejecutivo
            </CardTitle>
            <CardDescription>
              Estadísticas generales del período
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {movements.length}
                </div>
                <p className="text-sm text-blue-600 mt-1">Total Movimientos</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {movements.filter(m => m.amount > 0).length}
                </div>
                <p className="text-sm text-green-600 mt-1">Ingresos</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {movements.filter(m => m.amount < 0).length}
                </div>
                <p className="text-sm text-red-600 mt-1">Egresos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default withAuth(ReportsPage);
