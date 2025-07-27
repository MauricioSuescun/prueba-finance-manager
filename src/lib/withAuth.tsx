import React from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (!isPending && !session) {
        router.push("/");
      }
    }, [session, isPending, router]);

    if (isPending) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Cargando...</div>
        </div>
      );
    }

    if (!session) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Redirigiendo...</div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
