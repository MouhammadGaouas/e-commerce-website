import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  },),
  advanced: {
    database: {
      joins: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 3600,
    sendResetPassword: async ({ user, url, token }) => {
      console.log(`[auth] password reset requested`, { email: user.email, url, token });
    },
  },
  emailVerification: {
    enabled: true,
    sendOnSignUp: true,
    sendOnSignIn: true,
    expiresIn: 3600,
    sendVerificationEmail: async ({ user, url, token }) => {
      console.log(`[auth] verification email sent`, { email: user.email, url, token });
    },
  },
  plugins: [admin()],
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
      },
      wilaya: {
        type: "string",
        required: false,
      },
      city: {
        type: "string",
        required: false,
      },
    },
  },
});