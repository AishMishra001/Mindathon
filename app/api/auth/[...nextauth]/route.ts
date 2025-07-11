import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        firstname: { label: "Firstname", type: "text" },
        lastname: { label: "Lastname", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        adminpassword: { label: "Admin Password", type: "password" },
      },
      async authorize(credentials) {
        const { firstname, lastname, email, password, adminpassword } = credentials as any;

        if (!email || !password) return null;

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user = await prisma.user.create({
            data: {
              email,
              name: `${firstname} ${lastname}`,
              password: hashedPassword,
              isAdmin: adminpassword === "Keshav",
            },
          });
        } else {
          const isValid = await bcrypt.compare(password, user.password || "");
          if (!isValid) return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = (user as any).isAdmin;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },

    async redirect() {
      return "/user/dashboard";
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
