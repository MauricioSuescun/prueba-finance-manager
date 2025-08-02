import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useSession, signIn } from "@/lib/auth-client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Calendar,
  BarChart3
} from "lucide-react";

type Movement = {
  id: string;
  concept: string;
  amount: number;
  date: string;
  user: { name: string; email: string };
};

type DashboardStats = {
  totalMovements: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  recentMovements: Movement[];
};

export default function Home() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalMovements: 0,
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    recentMovements: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch("/api/reports")
        .then((res) => res.json())
        .then((data) => {
          const movements: Movement[] = data.movements || [];
          const totalIncome = movements
            .filter((m: Movement) => m.amount > 0)
            .reduce((sum: number, m: Movement) => sum + m.amount, 0);
          const totalExpenses = movements
            .filter((m: Movement) => m.amount < 0)
            .reduce((sum: number, m: Movement) => sum + Math.abs(m.amount), 0);
          
          setStats({
            totalMovements: movements.length,
            totalIncome,
            totalExpenses,
            balance: data.saldo || 0,
            recentMovements: movements.slice(0, 5)
          });
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleSignIn = async () => {
    try {
      await signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  if (!session) {
    return (
      <>
        <Head>
          <title>Finance Manager - Dashboard</title>
          <meta name="description" content="Gestión financiera personal y empresarial" />
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">F</span>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Finance Manager
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Gestiona tus finanzas de manera simple, segura y eficiente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleSignIn}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  Iniciar Sesión con GitHub
                </Button>
                <p className="text-center text-sm text-gray-500">
                  Para acceder a todas las funcionalidades
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Finance Manager - Dashboard</title>
        <meta name="description" content="Dashboard de gestión financiera" />
      </Head>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Hola, {session.user?.name || session.user?.email?.split('@')[0]}
              </h1>
              <p className="text-gray-600 mt-1">
                {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {new Date().toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Badge>
          </div>

          {/* Stats Cards */}
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
                  ${stats.balance.toLocaleString()}
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Saldo actual
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">
                  Ingresos
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">
                  ${stats.totalIncome.toLocaleString()}
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
                  Egresos
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-900">
                  ${stats.totalExpenses.toLocaleString()}
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
                  Movimientos
                </CardTitle>
                <Activity className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">
                  {stats.totalMovements}
                </div>
                <p className="text-xs text-purple-600 mt-1">
                  Registros totales
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Actividad Reciente
                </CardTitle>
                <CardDescription>
                  Últimos movimientos registrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : stats.recentMovements.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentMovements.map((movement) => (
                      <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            movement.amount > 0 ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <div>
                            <p className="font-medium text-gray-900">{movement.concept}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(movement.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            movement.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {movement.amount > 0 ? '+' : ''}${movement.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {movement.user.name || movement.user.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No hay movimientos recientes</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Resumen Mensual
                </CardTitle>
                <CardDescription>
                  Estadísticas del mes actual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Movimientos del mes</p>
                        <p className="text-sm text-gray-500">Registros en {new Date().toLocaleDateString('es-ES', { month: 'long' })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {stats.recentMovements.filter(m => 
                          new Date(m.date).getMonth() === new Date().getMonth()
                        ).length}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Ingresos del mes</p>
                        <p className="text-sm text-gray-500">Total acumulado</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        ${stats.recentMovements
                          .filter(m => m.amount > 0 && new Date(m.date).getMonth() === new Date().getMonth())
                          .reduce((sum, m) => sum + m.amount, 0)
                          .toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </>
  );
}
