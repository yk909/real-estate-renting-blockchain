import React, { FC, Suspense } from "react";

import ListingCard from "@/components/ListingCard";
import LoadMore from "@/components/LoadMore";
import EmptyState from "@/components/EmptyState";

import { getListings } from "@/services/listing";
import { getFavorites } from "@/services/favorite";
import Image from "next/image";
import Search from "@/components/navbar/Search";

export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams?: { [key: string]: string | undefined };
}

const Home: FC<HomeProps> = async ({ searchParams }) => {


  return (

    <div className="bg-gradient-to-r from-indigo-500 via-transparent to-pink-200 h-[calc(100vh-64px)] py-3">
      <div className="relative main-container">
        <div className="z-0 absolute right-[24px] top-[50px] hidden md:block">
          <Image src="/images/bg.webp" width={500} height={200} alt="Image" ></Image>
        </div>

        <div className="w-full h-full transform translate-y-[25vh] flex flex-col z-10">
          <div className="w-[50%] text-white font-bold text-[33px] pb-[10px]">
            The world&apos;s largest selection of room rentals
          </div>

        </div>

      </div>
    </div>

  );
};

export default Home;