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

        console.log("🔍 Authorize - Checking user for:", credentials.email);

        const result = await pool.query(
          `SELECT id, name, email, image, password_hash 
           FROM users 
           WHERE email = $1 AND auth_provider = 'credentials'`,
          [credentials.email.toLowerCase()]
        );

        console.log("🔍 Authorize - Found users:", result.rowCount);

        const user = result.rows[0];
        if (!user) {
          console.log("❌ Authorize - User not found");
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        if (!isValid) {
          console.log("❌ Authorize - Invalid password");
          throw new Error("Invalid password");
        }

        console.log("✅ Authorize - Success! User data:", {
          id: user.id,
          name: user.name,
          image: user.image,
        });

        // ⭐ Return user with ID
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    // ⭐ JWT Callback
    async jwt({ token, user, trigger, session }) {
      console.log("🔍 JWT - Triggered");

      // ⭐ Store user ID on first login
      if (user) {
        token.id = user.id;
        token.email = user.email;
        console.log("✅ JWT - Stored user ID:", user.id);
      }

      // Handle manual updates
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }

      console.log("🔍 JWT - Token ID:", token.id);
      return token;
    },

    // ⭐ Session Callback
    async session({ session, token }) {
      console.log("🔍 Session - Token ID:", token.id);

      if (session.user && token.id) {
        // ⭐ Fetch latest data from database
        try {
          const result = await pool.query(
            "SELECT id, name, email, image FROM users WHERE id::text = $1",
            [token.id as string]
          );

          console.log("🔍 Session - DB query result:", result.rows);

          if (result.rows.length > 0) {
            const dbUser = result.rows[0];

            session.user.id = dbUser.id;
            session.user.name = dbUser.name;
            session.user.email = dbUser.email;
            session.user.image = dbUser.image; // ⭐ Latest image

            console.log("✅ Session - Image from DB:", dbUser.image);
          }
        } catch (error) {
          console.error("❌ Session - DB error:", error);
        }
      } else {
        console.log("❌ Session - No token.id found");
      }

      console.log("🔍 Session - Final:", session.user);
      return session;
    },
  },

  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // ⭐ Enable debug mode
};
