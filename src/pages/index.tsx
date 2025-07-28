import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useSession, signIn, signOut } from "@/lib/auth-client";
import Navigation from "@/components/Navigation";

export default function Home() {
  const { data: session, isPending } = useSession();

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

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.reload();
          },
        },
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Finance Manager</title>
        <meta
          name="description"
          content="Gestión financiera personal y empresarial"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-100">
        {/* Navigation */}
        <Navigation />
        
        {/* Auth Section */}
        <div className="absolute top-4 right-4">
          {isPending ? (
            <div className="text-gray-600">Cargando...</div>
          ) : session ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                Hola, {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
              Iniciar Sesión con GitHub
            </button>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-2 drop-shadow">
              Finance Manager
            </h1>
            <p className="text-lg md:text-xl text-gray-700 font-medium">
              Gestiona tus finanzas de manera simple, segura y eficiente
            </p>
          </header>

        {/* Navigation Menu - Always visible */}
        <nav className="flex flex-col md:flex-row gap-6 items-center justify-center w-full max-w-xl">
          <Link
            href="/movements"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg shadow-lg font-semibold text-lg transition-colors w-64 text-center"
          >
            Gestión de Ingresos y Egresos
          </Link>
          <Link
            href="/users"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg shadow-lg font-semibold text-lg transition-colors w-64 text-center"
          >
            Gestión de Usuarios
          </Link>
          <Link
            href="/reports"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg shadow-lg font-semibold text-lg transition-colors w-64 text-center"
          >
            Reportes Financieros
          </Link>
        </nav>

        {!session && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Para acceder a todas las funcionalidades, inicia sesión
            </p>
            <button
              onClick={handleSignIn}
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg text-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
              Iniciar Sesión con GitHub
            </button>
          </div>
        )}

        </div>

        <footer className="mt-16 text-gray-500 text-sm text-center">
          © {new Date().getFullYear()} Finance Manager. Todos los derechos
          reservados.
        </footer>
      </div>
    </>
  );
}
