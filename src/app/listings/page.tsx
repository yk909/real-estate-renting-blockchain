"use client";
import React, { FC, Suspense } from "react";

import ListingCard from "@/components/ListingCard";
import LoadMore from "@/components/LoadMore";
import EmptyState from "@/components/EmptyState";

import { getListings } from "@/services/listing";
import { getFavorites } from "@/services/favorite";

import { useGlobalState } from "@/store";
export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams?: { [key: string]: string | undefined };
}

const Home: FC<HomeProps> = ({ searchParams }) => {
  const [appartments] = useGlobalState("appartments");
  const [all_hasfavorites] = useGlobalState("all_hasfavorites");
  // const favorites = await getFavorites();
  // console.log(favorites)
  if (!appartments || appartments.length === 0) {
    return (
      <EmptyState
        title="No Listings found"
        subtitle="Looks like you have no properties."
      />
    );
  }

  return (
    <section className="py-8 px-14 flex justify-center flex-wrap space-x-4 w-full">
      {appartments.map((appartment, index) => {
        return (
          <ListingCard
            key={index}
            data={appartment}
            hasFavorited={all_hasfavorites[index]}
          />
        );
      })}
    </section>
  );
};

export default Home;
