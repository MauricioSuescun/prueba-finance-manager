import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
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
    },
    async session({ session, user }) {
      // Incluye el id y el rol en la sesión
      if (session?.user) {
        const u = user as { id?: string; role?: string };
        if (u.id) session.user.id = u.id;
        if (u.role) session.user.role = u.role;
      }
      return session;
    },
  },
  session: {
    strategy: "database",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin", // Puedes personalizar la página de login si lo deseas
  },
};

export default NextAuth(authOptions);
