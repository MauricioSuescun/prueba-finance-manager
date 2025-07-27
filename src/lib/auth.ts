import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL || "https://prueba-finance-manager.vercel.app" || "https://prueba-finance-manager-git-cur-e3b501-mauriciosuescuns-projects.vercel.app",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  // user: { // Removed due to incompatibility with Better Auth 1.1.1
  //   defaultRole: "ADMIN",
  // },
});
