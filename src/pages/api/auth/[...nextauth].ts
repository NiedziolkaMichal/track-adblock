import NextAuth, { AuthOptions, DefaultSession, getServerSession as _getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/db/prisma";
import { GetServerSidePropsContext } from "next/types";
import { verifyEmail, verifyPassword } from "../../../lib/util/verifyInput";
import { logError } from "../../../lib/util/log";
import { hashPassword, samePassword } from "../../../lib/util/password";

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
        email: {},
        password: {},
        canRegister: {}, // Set to "1"" in `register` page, while it's missing in `login` page
      },
      async authorize(options: { email?: string; password?: string; canRegister?: string } | undefined) {
        if (!options) {
          logError("Missing data while checking credentials");
          throw new Error("MissingData");
        }
        return checkCredentials(options.email, options.password, Boolean(options.canRegister));
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
  callbacks: {
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      };
    },
  },
};

export default NextAuth(authOptions);

declare module "next-auth" {
  interface Session {
    user: {
      id: string | undefined;
    } & DefaultSession["user"];
  }
}

async function checkCredentials(email: string | undefined, password: string | undefined, canRegister: boolean) {
  if (!email || !password) {
    logError("Missing email or password while checking credentials");
    throw new Error("MissingData");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
      password: true,
    },
  });

  if (existingUser) {
    if (!existingUser.password) {
      throw new Error("AccountCreatedByOAuth");
    }

    const validPassword = await samePassword(password, existingUser.password);
    if (validPassword) {
      return {
        id: existingUser.id,
        email,
        name: existingUser.name,
        image: existingUser.image,
      };
    } else {
      throw new Error("InvalidPassword");
    }
  } else if (canRegister) {
    if (!verifyEmail(email)) {
      logError("Invalid input email while checking credentials");
      throw new Error("MissingData");
    }
    if (verifyPassword(password) !== "ok") {
      logError("Invalid input password while checking credentials");
      throw new Error("MissingData");
    }

    const passwordHash = await hashPassword(password);

    return prisma.user.create({
      data: {
        email,
        password: passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });
  } else {
    throw new Error("CannotRegister");
  }
}

export async function getServerSession(context: GetServerSidePropsContext) {
  return await _getServerSession(context.req, context.res, authOptions);
}
