import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, adminClient } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  /**
   * Dynamic base URL fallback:
   * Uses NEXT_PUBLIC_APP_URL in production, window.location.origin in browser,
   * or defaults to http://localhost:3000 for SSR.
   */
  baseURL:
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000"),
  plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
});