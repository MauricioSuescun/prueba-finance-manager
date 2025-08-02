import React from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/router";

export default function Navigation() {
  const { data: session } = useSession();
  const router = useRouter();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session?.user as any)?.role || "ADMIN";
  const isAdmin = userRole === "ADMIN";

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      current: router.pathname === "/",
    },
    {
      name: "Movimientos",
      href: "/movements",
      current: router.pathname === "/movements",
    },
    {
      name: "Usuarios",
      href: "/users",
      current: router.pathname === "/users",
      adminOnly: true,
    },
    {
      name: "Reportes",
      href: "/reports",
      current: router.pathname === "/reports",
      adminOnly: true,
    },
  ];

  const filteredNavigation = navigation.filter(item => !item.adminOnly || isAdmin);

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-900">Finance Manager</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.current
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* User Info */}
            {session?.user && (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-700">
                  <div className="font-medium">{session.user.name || session.user.email}</div>
                  <div className="text-xs text-gray-500">
                    Rol: {userRole}
                    {isAdmin && (
                      <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {filteredNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                item.current
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
} 