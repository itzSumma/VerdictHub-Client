import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const getAuthBaseURL = () => {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (typeof window === "undefined") return envUrl || "http://localhost:3000";

  const isLocalBrowser = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (!isLocalBrowser) return window.location.origin;

  return envUrl || window.location.origin;
};

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
  plugins: [jwtClient()],
});
