import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import pool from "./db";
import { User } from "@/types/users";

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Manual Credentials Provider
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
          // Find user by email
          const result = await pool.query<User>(
            "SELECT * FROM users WHERE email = $1 AND auth_provider = 'credentials'",
            [credentials.email.toLowerCase()]
          );

          const user = result.rows[0];

          if (!user) {
            throw new Error("No account found with this email");
          }

          // Check password
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
            image: user.image,
          };
        } catch (error: any) {
          console.error("Auth error:", error);
          throw new Error(error.message || "Authentication failed");
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
    // signUp: "/signup",
    error: "/login",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      // Google Sign In
      if (account?.provider === "google") {
        try {
          const email = user.email?.toLowerCase();
          
          // Check if user exists
          const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
          );

          if (existingUser.rows.length === 0) {
            // Create new Google user
            await pool.query(
              `INSERT INTO users (name, email, image, auth_provider, google_id, email_verified)
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [
                user.name,
                email,
                user.image,
                'google',
                account.providerAccountId,
                true
              ]
            );
          } else {
            // Update existing user
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

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
