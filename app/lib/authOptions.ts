import { NextAuthOptions, User, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
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
      authorize: async (credentials) => {
        const { firstname, lastname, email, password, adminpassword } =
          credentials as {
            firstname?: string;
            lastname?: string;
            email: string;
            password: string;
            adminpassword?: string;
          };

        if (!email || !password) return null;

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          const hashedPassword = await bcrypt.hash(password, 10);
          const isAdmin = adminpassword === "Keshav";

          const safeFirstname = firstname || "Anonymous";
          const safeLastname = lastname || "User";

          try {
            user = await prisma.user.create({
              data: {
                email,
                name: `${safeFirstname} ${safeLastname}`,
                password: hashedPassword,
                isAdmin,
              },
            });
          } catch (err) {
            console.error("❌ Failed to create user:", err);
            return null;
          }
        } else {
          const isValid = await bcrypt.compare(password, user.password || "");

          if (!isValid) return null;

          const isTryingAdmin = Boolean(adminpassword);
          const isCorrectAdmin = adminpassword === "Keshav";

          if (isTryingAdmin && !isCorrectAdmin) {
            user.isAdmin = false;
          }
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

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      const parsedUrl = new URL(url, baseUrl);
      const isAdmin = parsedUrl.searchParams.get("admin") === "true";

      const adminUrl = new URL("/admin/dashboard", baseUrl).toString();
      const userUrl = new URL("/user/dashboard", baseUrl).toString();

      return isAdmin ? adminUrl : userUrl;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },
};
