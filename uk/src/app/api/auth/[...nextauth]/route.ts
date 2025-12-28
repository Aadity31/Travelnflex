import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    /* ---------------- GOOGLE LOGIN ---------------- */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    /* ---------------- MANUAL / CREDENTIALS LOGIN ---------------- */
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
          `
          SELECT id, name, email, image, password_hash
          FROM users
          WHERE email = $1
            AND auth_provider = 'credentials'
          `,
          [credentials.email.toLowerCase()]
        );

        const user = result.rows[0];

        if (!user || !user.password_hash) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        /* 🔑 THIS RETURN CREATES SESSION */
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  /* ---------------- SESSION ---------------- */
  session: {
    strategy: "jwt",
  },

  /* ---------------- CALLBACKS ---------------- */
  callbacks: {
    async signIn({ user, account }) {
      /* Google user DB sync */
      if (account?.provider === "google") {
        const email = user.email?.toLowerCase();
        if (!email) return false;

        const existingUser = await pool.query(
          "SELECT id FROM users WHERE email = $1",
          [email]
        );

        if (existingUser.rowCount === 0) {
          await pool.query(
            `
            INSERT INTO users
              (name, email, image, auth_provider, google_id, email_verified)
            VALUES
              ($1, $2, $3, 'google', $4, true)
            `,
            [user.name, email, user.image, account.providerAccountId]
          );
        } else {
          await pool.query(
            `
            UPDATE users
            SET image = COALESCE($1, image),
                google_id = COALESCE($2, google_id),
                email_verified = true,
                updated_at = NOW()
            WHERE email = $3
            `,
            [user.image, account.providerAccountId, email]
          );
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
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

  /* ---------------- PAGES ---------------- */
  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
