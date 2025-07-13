import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
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

        console.log("🧪 Credentials received:", {
          email,
          password,
          adminpassword,
        });

        if (!email || !password) return null;

        let user = await prisma.user.findUnique({ where: { email } });
        console.log("🔍 Fetched user:", user);

        if (!user) {
          console.log("👶 Creating user...");

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

          if (!isValid) {
            console.log("⛔ Invalid password");
            return null;
          }

          const isTryingAdmin = Boolean(adminpassword);
          const isCorrectAdmin = adminpassword === "Keshav";

          if (isTryingAdmin && !isCorrectAdmin) {
            console.log(
              "⚠️ Incorrect admin password — treating as regular user"
            );
            user.isAdmin = false;
          }
        }

        console.log("✅ Auth success:", {
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
        });

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
        token.isAdmin = (user as User & { isAdmin?: boolean })?.isAdmin;
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
      // Check if the callbackUrl includes a hint about admin status
      const parsedUrl = new URL(url, baseUrl);
      const isAdmin = parsedUrl.searchParams.get("admin") === "true";

      console.log("Redirect callback:", { url, baseUrl, isAdmin });

      // Construct absolute URLs
      const adminUrl = new URL("/admin/dashboard", baseUrl).toString();
      const userUrl = new URL("/user/dashboard", baseUrl).toString();

      // Redirect based on isAdmin status
      return isAdmin ? adminUrl : userUrl;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };