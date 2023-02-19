import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../db/prisma";
import { GetServerSidePropsContext } from "next/types";
import { getServerSession as _getServerSession } from "next-auth";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
    signOut: "/", // Disabling "Are you sure you want to sign out?" page
  },
  session: {
    strategy: "jwt", // We are forced to use JSON Web Tokens, because of CredentialsProvider
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        return null;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_OAUTH_ID || "",
      clientSecret: process.env.GITHUB_OAUTH_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_ID || "",
      clientSecret: process.env.GOOGLE_OAUTH_SECRET || "",
    }),
  ],
  adapter: PrismaAdapter(prisma),
};

export default NextAuth(authOptions);

export async function getServerSession(context: GetServerSidePropsContext) {
  return await _getServerSession(context.req, context.res, authOptions);
}

export const MISSING_SESSION_REDIRECT = {
  redirect: {
    destination: "/api/auth/signin",
    permanent: false,
  },
};
