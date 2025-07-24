import { getProviders, signIn } from "next-auth/react";

export default function SignInPage() {
  // Página personalizada de login
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Iniciar sesión</h1>
      <button
        className="bg-black text-white px-4 py-2 rounded"
        onClick={() => signIn("github")}
      >
        Iniciar sesión con GitHub
      </button>
    </main>
  );
}
