"use client";

import React, { Suspense } from "react";

import EmptyState from "@/components/EmptyState";
import Heading from "@/components/Heading";
import ListingCard from "@/components/ListingCard";
import LoadMore from "@/components/LoadMore";

import { getCurrentUser } from "@/services/user";
import { getReservations } from "@/services/reservation";
import { getFavorites } from "@/services/favorite";
import { useGlobalState } from "@/store";
import { userAgent } from "next/server";

const TripsPage = () => {
  // const user = await getCurrentUser();
  // const favorites = await getFavorites();
  const [user] = useGlobalState("connectedAccount");
  const [reservatedAppartments] = useGlobalState("reservatedAppartments");
  const [all_reservations] = useGlobalState("all_reservations");
  const [all_hasfavorites] = useGlobalState("all_hasfavorites");

  if (!user) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  // const { listings, nextCursor } = await getReservations({ userId: user.id });

  if (reservatedAppartments.length === 0) {
    return (
      <EmptyState
        title="No trips found"
        subtitle="Looks like you haven't reserved any trips."
      />
    );
  }

  return (
    <section className="main-container">
      <Heading
        title="Trips"
        subtitle="Where you've been and where you're going."
        backBtn
      />
      <div className=" mt-8 md:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 md:gap-8 gap-4">
        {reservatedAppartments.map((reservatedAppartment, index) => {
          // const { reservation, ...data } = listing;
          // const hasFavorited = favorites.includes(listing.id);
          const { id } = reservatedAppartment;
          return (
            <ListingCard
              key={index}
              data={reservatedAppartment}
              reservations={all_reservations[index]}
              hasFavorited={all_hasfavorites[id - 1]}
            />
          );
        })}
      </div>
    </section>
  );
};

export default TripsPage;
