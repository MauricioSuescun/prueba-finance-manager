import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

// Get the correct base URL for the current environment
const getBaseURL = () => {
  // In production, use the NEXTAUTH_URL or try to detect from environment
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXTAUTH_URL || 
           process.env.BETTER_AUTH_URL || 
           process.env.AUTH_URL;
  }
  // In development, use localhost
  return "http://localhost:3000";
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: getBaseURL(),
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
  advanced: {
    generateId: () => {
      return crypto.randomUUID();
    },
  },
});