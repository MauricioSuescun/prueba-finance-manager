import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        // Asigna el rol ADMIN automáticamente a nuevos usuarios
        if (user && user.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });
          if (dbUser && !dbUser.role) {
            await prisma.user.update({
              where: { email: user.email },
              data: { role: "ADMIN" },
            });
          }
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async session({ session, user }) {
      try {
        // Incluye el id y el rol en la sesión
        if (session?.user && user) {
          const u = user as { id?: string; role?: string };
          if (u.id) session.user.id = u.id;
          if (u.role) session.user.role = u.role;
        }
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },
  },
  session: {
    strategy: "database",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error", // Agregar página de error personalizada
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
