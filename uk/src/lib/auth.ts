// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import pool from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const result = await pool.query(
          `SELECT id, name, email, image, password_hash
           FROM users
           WHERE email = $1 AND auth_provider = 'credentials'`,
          [credentials.email.toLowerCase()]
        );

        const user = result.rows[0];
        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        if (!isValid) throw new Error("Invalid password");

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email, // 🔒 email fixed
          image: user.image,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // 🔐 JWT = source of truth
    async jwt({ token, user, trigger, session }) {
      // First login
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email; // 🔒 set once
        token.image = user.image;
      }

      // Manual session.update()
      if (trigger === "update" && session?.user) {
        // ✅ Image update allowed
        if (session.user.image !== undefined) {
          token.image = session.user.image;
        }

        // ✅ Name update allowed
        if (session.user.name !== undefined) {
          token.name = session.user.name;
        }

        // ❌ EMAIL UPDATE BLOCKED (intentionally)
        // token.email is NEVER touched here
      }

      return token;
    },

    // 🚀 Session from JWT (no DB hit)
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string; // read-only
        session.user.image = token.image as string | null;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
};
