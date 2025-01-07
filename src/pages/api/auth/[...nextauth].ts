// src/pages/api/auth/[...nextauth].ts
import { loginWithGoogle } from "@/services/services";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth/next";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }: any) {
      if (account?.provider === "credentials") {
        token.email = user.email;
        token.name = user.name;
      }
    
      if (account?.provider === "google") {
        const data = {
          username: profile.name,
          email: profile.email,
        };
    
        const user = await loginWithGoogle(data);
        token.email = user.email;
        token.name = user.name;
      }
    
      return token;
    },

    async session({ session, token }: any) {
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);
