import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000",
});

export const { signIn, signOut, signUp, useSession } = authClient;