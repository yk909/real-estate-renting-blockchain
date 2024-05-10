import bcrypt from "bcrypt";
import { AuthOptions, RequestInternal  } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { ethers } from "ethers";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { db } from "./db";

async function authorizeCrypto(
  credentials: Record<"walletAddress" | "signedNonce", string> | undefined,
  req: Pick<RequestInternal, "body" | "headers" | "method" | "query">
) {
  if (!credentials) return null;

  const { walletAddress, signedNonce } = credentials;

  // Get user from database with their generated nonce
  const user = await db.user.findUnique({
    where: { walletAddress },
  });

  if (!user?.walletAddress) return null;

  const verifyNonce = "Welcome to sign in ComHouse!";
  // Compute the signer address from the saved nonce and the received signature
  const signerAddress = ethers.verifyMessage(
    verifyNonce,
    signedNonce
  );

  // Check that the signer address matches the public address
  //  that is trying to sign in
  if (signerAddress !== walletAddress) return null;

  return {
    id: user.id,
    walletAddress: user.walletAddress,
  };
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: {
          label: "password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user?.password) throw new Error("Invalid credentials");

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) throw new Error("Invalid credentials");

        return user;
      },
    }),
    CredentialsProvider({
      id: "crypto",
      name: "Crypto Wallet Auth",
      credentials: {
        walletAddress: { label: "Public Address", type: "text" },
        signedNonce: { label: "Signed Nonce", type: "text" },
      },
      authorize: authorizeCrypto,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }

      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
