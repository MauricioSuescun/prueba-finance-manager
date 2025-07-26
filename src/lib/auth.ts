import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: false, // Disable email/password since we're using GitHub
  },
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
        defaultValue: "ADMIN",
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  callbacks: {
    after: [
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        matcher(context: any) {
          return context.type === "signUp";
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (ctx: any) => {
          // Assign ADMIN role to new users
          if (ctx.user?.email) {
            await prisma.user.update({
              where: { email: ctx.user.email },
              data: { role: "ADMIN" },
            });
          }
        },
      },
    ],
  },
});