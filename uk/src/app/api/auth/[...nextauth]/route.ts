import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import pool from "@/lib/db";

export const authOptions: NextAuthOptions = {
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
      if (account?.provider === "google" && profile) {
        const email = profile.email as string;
        const name = profile.name as string;
        const image = (profile as any).picture as string;
        const googleId = profile.sub as string;

        const existingUser = await pool.query(
          "SELECT id FROM users WHERE email = $1",
          [email]
        );

        let userId: string;

        if (existingUser.rowCount === 0) {
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
          userId = existingUser.rows[0].id;

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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
