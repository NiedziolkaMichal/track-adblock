import NextAuth, { AuthOptions, getServerSession as _getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../db/prisma";
import { GetServerSidePropsContext } from "next/types";
import { verifyEmail, verifyPassword } from "../../../util/verifyInput";
import bcrypt from "bcrypt";

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
          throw new Error("MissingData");
        }
        //TODO try-catch + log
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
};

export default NextAuth(authOptions);

async function checkCredentials(email: string | undefined, password: string | undefined, canRegister: boolean) {
  if (!email || !password) {
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

    const validPassword = await bcrypt.compare(password, existingUser.password);
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
      throw new Error("MissingData");
    }
    if (verifyPassword(password) !== "ok") {
      throw new Error("MissingData");
    }

    const passwordHash = await bcrypt.hash(password, 10);

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
