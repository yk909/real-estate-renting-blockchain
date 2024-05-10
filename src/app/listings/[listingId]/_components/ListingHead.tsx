import React from "react";
import Image from "@/components/Image";

import Heading from "@/components/Heading";
import HeartButton from "@/components/HeartButton";
import { getFavorites } from "@/services/favorite";

interface ListingHeadProps {
  title: string;
  country: string | null;
  region: string | null;
  image: string[];
  id: string;
}

const ListingHead: React.FC<ListingHeadProps> = async ({
  title,
  country = "",
  region = "",
  image,
  id,
}) => {
  return (
    <>
      <Heading title={title} subtitle={`${region}, ${country}`} backBtn />
      <div className="mt-8 h-[32rem] flex rounded-2xl overflow-hidden">
        <div className="relative md:w-1/2 w-full h-full overflow-hidden">
          <Image
            imageSrc={image[0]}
            fill
            alt={"picture"}
            className="w-full object-cover"
          />
        </div>
        <div className="relative w-1/2 md:flex hidden flex-wrap">
          <div className="relative w-1/2 h-1/2">
            <Image
              className="object-cover pl-2 pb-1 pr-1"
              imageSrc={image[1]}
              fill
              alt={"picture"}
              effect="zoom"
            />
          </div>

          <div className="relative w-1/2 h-1/2">
            <Image
              className="object-cover p1-1 pb-1 "
              imageSrc={image[2]}
              fill
              alt={"picture"}
              effect="zoom"
            />
          </div>

          <div className="relative w-1/2 h-1/2">
            <Image
              className="object-cover pl-2 pt-1 pr-1"
              imageSrc={image[3]}
              fill
              alt={"picture"}
              effect="zoom"
            />
          </div>

          <div className="relative w-1/2 h-1/2">
            <Image
              className="object-cover pl-0 pt-1"
              imageSrc={image[4]}
              fill
              alt={"picture"}
              effect="zoom"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingHead;
