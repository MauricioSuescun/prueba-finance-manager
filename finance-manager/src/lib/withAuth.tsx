import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  allowedRoles: string[] = []
) {
  return function AuthenticatedComponent(props: T) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      getSession().then((session) => {
        if (!session) {
          router.replace("/auth/signin");
        } else if (
          allowedRoles.length > 0 &&
          (!session.user?.role || !allowedRoles.includes(session.user.role))
        ) {
          router.replace("/");
        } else {
          setAuthorized(true);
        }
        setLoading(false);
      });
    }, [router]);

    if (loading) return <div className="p-8">Cargando...</div>;
    if (!authorized) return null;
    return <Component {...props} />;
  };
}
