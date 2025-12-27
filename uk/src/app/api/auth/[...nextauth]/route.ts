import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import pool from "@/lib/db";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface JWT {
    userId?: string;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      // Only on Google login
      if (account?.provider === "google" && profile) {
        const email = profile.email as string;
        const name = profile.name as string;
        const image = profile.image as string;
        const googleId = profile.sub as string;

        // 1️⃣ Check if user exists
        const existingUser = await pool.query(
          "SELECT id FROM users WHERE email = $1",
          [email]
        );

        let userId: string;

        if (existingUser.rowCount === 0) {
          // 2️⃣ CREATE user
          const newUser = await pool.query(
            `
            INSERT INTO users (name, email, image, auth_provider, google_id, email_verified)
            VALUES ($1, $2, $3, 'google', $4, true)
            RETURNING id
            `,
            [name, email, image, googleId]
          );

          userId = newUser.rows[0].id;
        } else {
          // 3️⃣ LOGIN (existing user)
          userId = existingUser.rows[0].id;

          // Optional: link Google account if missing
          await pool.query(
            `
            UPDATE users
            SET google_id = COALESCE(google_id, $1),
                image = COALESCE(image, $2)
            WHERE id = $3
            `,
            [googleId, image, userId]
          );
        }

        // 4️⃣ Attach DB user id to JWT
        token.userId = userId;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
