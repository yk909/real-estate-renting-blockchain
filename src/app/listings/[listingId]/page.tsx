"use client";

import React, { useState, useEffect } from "react";

import EmptyState from "@/components/EmptyState";
import ListingHead from "./_components/ListingHead";
import ListingInfo from "./_components/ListingInfo";
import ListingClient from "./_components/ListingClient";

import { getCurrentUser } from "@/services/user";
import { getListingById } from "@/services/listing";
import { categories } from "@/utils/constants";
import { Reviewdetails } from "@/components/Reviewdetails";

import { useGlobalState } from "@/store";
import { getReservations, loadAppartment } from "@/Blockchain.services";

import { useRouter } from "next/navigation";

interface IParams {
  listingId: string;
}

const ListingPage = ({ params: { listingId } }: { params: IParams }) => {
  const [appartment] = useGlobalState("appartment");
  const [reservations] = useGlobalState("reservations");
  const [currentUser] = useGlobalState("connectedAccount");

  useEffect(() => {
    const init = async () => {
      await loadAppartment(listingId);
      await getReservations(listingId);
      const user = await getCurrentUser();
    };
    init();
  }, []);

  if (!appartment) return <EmptyState />;

  const {
    title,
    images: imageSrc,
    location,
    category,
    id,
    user: owner,
    price,
    description,
    romms: roomCount,
    guests: guestCount,
    bathrooms: bathroomCount,
  } = appartment;

  const tempcategory = categories.find((cate) => cate.label === category);

  const latlng = [location[2], location[3]];

  return (
    <section className="main-container">
      <div className="">
        <ListingHead
          title={title}
          image={imageSrc}
          country={location[1]}
          region={location[0]}
          id={id}
        />
      </div>

      <ListingClient
        id={id}
        price={price}
        reservations={reservations}
        user={currentUser}
        title={title}
      >
        <ListingInfo
          user={owner}
          category={tempcategory}
          description={description}
          roomCount={roomCount}
          guestCount={guestCount}
          bathroomCount={bathroomCount}
          latlng={latlng}
        />
      </ListingClient>

      <Reviewdetails apartmentId={listingId} />
    </section>
  );
};

export default ListingPage;
