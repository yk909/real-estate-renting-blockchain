"use client";
import React from "react";
import Link from "next/link";
import { format } from "date-fns";
// import { Listing } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";

import HeartButton from "./HeartButton";
import Image from "./Image";
import { formatPrice } from "@/utils/helper";
import ListingMenu from "./ListingMenu";
import { GrFormNext } from "react-icons/gr";
import { GrFormPrevious } from "react-icons/gr";
import { SlLocationPin } from "react-icons/sl";
import { FaEthereum } from "react-icons/fa";

interface ListingCardProps {
  data: {
    id: string;
    title: string;
    description: string;
    category: string;
    images: string[];
    location: string[];
    bathrooms: number;
    rooms: number;
    guests: number;
    owner: string;
    price: number;
  };
  reservations?: {
    id: string;
    date: Date;
    price: number;
  }[];
  hasFavorited: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservations,
  hasFavorited,
}) => {
  const router = useRouter();
  const price = reservations ? reservations.length * data?.price : data?.price;
  const [displayIndex, setDisplayIndex] = useState(0);
  const [showbutton, setShowButton] = useState(false);

  const handleClick = () => {
    router.push(`/listings/${data.id}`);
  };

  let reservationDate;
  if (reservations) {
    const start = new Date(reservations[0].date);
    const end = new Date(reservations[reservations.length - 1].date);
    reservationDate = `${format(start, "PP")} - ${format(end, "PP")}`;
  }

  return (
    <div className="relative shadow-md w-80 pb-2 rounded-b-2xl mb-20 hover:cursor-pointer">
      <div className="absolute top-0 left-0 p-3 flex items-center justify-between w-full">
        <div className="z-5">
          {/* <ListingMenu id={reservation?.id || data.id} /> */}
          <ListingMenu id={data.id} />
        </div>

        <div className="w-[28px] h-[28px] flex items-center justify-center">
          <HeartButton
            listingId={data.id}
            key={data.id}
            hasFavorited={hasFavorited}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div
          className=" overflow-hidden md:rounded-t-lg rounded-t-md"
          onMouseEnter={() => {
            setShowButton(true);
          }}
          onMouseLeave={() => {
            setShowButton(false);
          }}
        >
          <div className="aspect-[380/240] relative bg-gray-100">
            <div onClick={handleClick}>
              <Image
                className="w-full object-cover"
                imageSrc={data.images[displayIndex]}
                fill
                alt={data.title}
                effect="zoom"
              />
            </div>
            {showbutton && (
              <div className="relative transform top-1/2 -translate-y-1/2 px-[15px]">
                {displayIndex > 0 && (
                  <div
                    className="bg-slate-50 rounded-full w-[25px] h-[25px] flex items-center justify-center hover:scale-110 transition-all absolute left-[10px]"
                    onClick={() => {
                      setDisplayIndex(displayIndex - 1);
                    }}
                  >
                    <GrFormPrevious className="text-gray-900 w-[15px] h-[15px]" />
                  </div>
                )}
                {displayIndex < data.images.length - 1 && (
                  <div
                    className="bg-slate-50 rounded-full w-[25px] h-[25px] flex items-center justify-center hover:scale-110 transition-all absolute right-[10px]"
                    onClick={() => {
                      setDisplayIndex(displayIndex + 1);
                    }}
                  >
                    <GrFormNext className="text-gray-900 w-[15px] h-[15px]" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="py-[5px] px-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[16px] mt-[4px] flex gap-x-[10px]  items-center">
              <SlLocationPin />
              {data?.location[0]}, {data?.location[1]}
            </span>
            <span className="font-light text-neutral-500 text-sm">
              {data.category}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-light text-neutral-500 text-sm">
              {reservationDate}
            </span>

            <div className="flex items-center gap-2">
              <span className="font-bold text-[#444] text-[14px] flex items-center gap-x-[4px]">
                <FaEthereum size={14} />
                {formatPrice(price)}
              </span>
              {!reservations && <span className="font-light">night</span>}
            </div>
          </div>
        </div>
      </div>
      {/* </Link> */}
    </div>
  );
};

export default ListingCard;

export const ListingSkeleton = () => {
  return (
    <div className="col-span-1 ">
      <div className="flex flex-col gap-1 w-full">
        <Skeleton
          width={"100%"}
          height={"100%"}
          borderRadius={"12px"}
          className="aspect-square"
        />

        <div className="flex flex-row gap-3">
          <Skeleton height={"18px"} width={"84px"} />
          <Skeleton height={"18px"} width={"84px"} />
        </div>
        <Skeleton height={"16px"} width={"102px"} />
        <Skeleton height={"18px"} width={"132px"} />
      </div>
    </div>
  );
};
