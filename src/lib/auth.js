import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

if (!process.env.MONGODB_URI) {
  throw new Error("Missing MONGODB_URI. Add it to the VerdictHub client environment variables in Vercel.");
}

const googleCredentials = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
const productionUrl = "https://verdict-hub-client.vercel.app";
const authBaseUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || productionUrl;
const trustedOrigins = [
  authBaseUrl,
  "http://localhost:3000",
  productionUrl,
].filter(Boolean);

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME || "verdictHub");

export const auth = betterAuth({
  baseURL: authBaseUrl,
  trustedOrigins,
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: googleCredentials ? {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  } : {},
  user: {
    additionalFields: {
      role: {
        defaultValue: "user",
      },
      plan: {
        defaultValue: "free",
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 24 * 60,
    },
  },
  plugins: [jwt()],
});
