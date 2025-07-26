import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Better Auth will automatically detect the base URL
});

export const { signIn, signOut, signUp, useSession } = authClient;