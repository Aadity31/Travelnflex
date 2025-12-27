import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import pool from "./db";
import { User } from "@/types/users";

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
          throw new Error("Please enter email and password");
        }

        try {
          const result = await pool.query<User>(
            "SELECT * FROM users WHERE email = $1 AND auth_provider = 'credentials'",
            [credentials.email.toLowerCase()]
          );

          const user = result.rows[0];

          if (!user) {
            throw new Error("No account found with this email");
          }

          if (!user.email_verified) {
            throw new Error("Please verify your email first");
          }

          if (!user.password_hash) {
            throw new Error("Invalid login method");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password_hash
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image || null,
          };
        } catch (error) {
          console.error("Auth error:", error);
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Authentication failed");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const email = user.email?.toLowerCase();

          if (!email) {
            console.error("No email provided by Google");
            return false;
          }

          const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
          );

          if (existingUser.rows.length === 0) {
            await pool.query(
              `INSERT INTO users (name, email, image, auth_provider, google_id, email_verified)
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [
                user.name,
                email,
                user.image,
                "google",
                account.providerAccountId,
                true,
              ]
            );
          } else {
            await pool.query(
              `UPDATE users 
               SET name = $1, image = $2, google_id = $3, email_verified = $4, updated_at = NOW()
               WHERE email = $5`,
              [user.name, user.image, account.providerAccountId, true, email]
            );
          }

          return true;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // ✅ This is fine - NextAuth limitation workaround
    async session({ session, token }) {
      if (session?.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).id = token.id;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
