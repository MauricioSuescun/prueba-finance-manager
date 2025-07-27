import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL || process.env.AUTH_URL || process.env.NEXTAUTH_URL,
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "ADMIN", // As per requirements, all new users should be ADMIN
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins: process.env.NODE_ENV === "production" 
    ? [process.env.NEXTAUTH_URL || "https://prueba-finance-manager-git-cur-e3b501-mauriciosuescuns-projects.vercel.app"]
    : ["http://localhost:3000"],
});