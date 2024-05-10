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

const ReservationPage = () => {
  // const user = await getCurrentUser();
  // const favorites = await getFavorites();
  const [user] = useGlobalState("connectedAccount");
  const [reservatedAppartments] = useGlobalState("reservatedAppartments");

  if (!user) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  // const { listings, nextCursor } = await getReservations({ userId: user.id });

  if (reservatedAppartments.length === 0) {
    return (
      <EmptyState
        title="No reservations found"
        subtitle="Looks like you have no reservations on your properties."
      />
    );
  }
  return (
    <section className="main-container">
      <Heading
        title="Reservations"
        subtitle="Reservatoins on your properties"
        backBtn
      />
      <div className=" mt-8 md:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 md:gap-8 gap-4">
        {reservatedAppartments.map((reservatedAppartment, index) => {
          // const { reservation, ...data } = listing;
          // const hasFavorited = favorites.includes(listing.id);
          return (
            <ListingCard
              key={index}
              data={reservatedAppartment}
              reservation={undefined}
              hasFavorited={false}
            />
          );
        })}
      </div>
    </section>
  );
};

export default ReservationPage;
