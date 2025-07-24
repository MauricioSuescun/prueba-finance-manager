import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Asigna el rol ADMIN automáticamente a nuevos usuarios
      if (user && user.email) {
        const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (!existingUser) {
          await prisma.user.update({
            where: { email: user.email },
            data: { role: "ADMIN" },
          });
        }
      }
      return true;
    },
    async session({ session, user }) {
      // Incluye el rol en la sesión
      if (session?.user && user?.role) {
        session.user.role = user.role;
      }
      return session;
    },
  },
  session: {
    strategy: "database",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);