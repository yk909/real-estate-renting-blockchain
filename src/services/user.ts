"use server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
};


export const createUser = async (walletAddress : any) => {
  const user = await db.user.upsert({
    where: { walletAddress},
    create:{
      walletAddress
    },
    update:{
      walletAddress,
    }
  })
  return user;
};

