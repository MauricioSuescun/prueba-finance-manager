import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
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

        <footer className="mt-16 text-gray-500 text-sm text-center">
          © {new Date().getFullYear()} Finance Manager. Todos los derechos
          reservados.
        </footer>
      </div>
    </>
  );
}
