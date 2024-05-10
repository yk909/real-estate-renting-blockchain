"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { TfiSpray } from "react-icons/tfi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { GoKey } from "react-icons/go";
import { RiMessage2Line } from "react-icons/ri";
import { FiTag } from "react-icons/fi";
import { GrMapLocation } from "react-icons/gr";

import { getReviews } from "@/services/review";

import ReviewItem from "./ReviewItem";
import ReviewInfo from "./ReviewInfo";
import Review from "./Review";
import { useGlobalState } from "@/store";
import { loadReviews } from "@/Blockchain.services";

export const Reviewdetails = ({ apartmentId }: { apartmentId: string }) => {
  const [reservated] = useGlobalState("reservated");
  const [all_reviews] = useGlobalState("reviews");

  const [isOpen, setIsOpen] = useState(false);
  const [reviews, setReviews] = useState<any>(all_reviews);

  const [scores, setScores] = useState([0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
  const [total, setTotal] = useState(0.0);

  const closeModal = () => {
    setIsOpen(false);
  };
  const calculateScore = () => {
    let totalscore = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    reviews.forEach(
      (item: {
        cleanliness: any;
        accuracy: any;
        check_in: any;
        communication: any;
        location_score: any;
        value: any;
      }) => {
        totalscore[0] += Number(item.cleanliness);
        totalscore[1] += Number(item.accuracy);
        totalscore[2] += Number(item.check_in);
        totalscore[3] += Number(item.communication);
        totalscore[4] += Number(item.location_score);
        totalscore[5] += Number(item.value);
      }
    );

    totalscore.map((item, index) => {
      totalscore[index] /= reviews.length;
      totalscore[index] = Number(totalscore[index].toFixed(2));
    });
    setScores(totalscore);
    setTotal(totalscore.reduce((sum, item) => sum + item, 0) / 6);
  };

  useEffect(() => {
    async () => {
      await loadReviews(apartmentId)
        .then(() => setReviews(all_reviews))
        .catch((error) => console.error(error));
    };
  }, []);

  useEffect(() => {
    calculateScore();
  }, [reviews]);

  return (
    <div className="py-5">
      <div className="hidden sm:block py-10 border-y-[1px]">
        <div className="flex items-center justify-center">
          <Image
            src={
              "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-GuestFavorite/original/78b7687c-5acf-4ef8-a5ea-eda732ae3b2f.png"
            }
            alt={""}
            width={90}
            height={160}
          />
          <h1 className=" text-8xl font-bold py-10 mb-5 font-Circular">
            {total.toFixed(2)}
          </h1>
          <Image
            src={
              "   https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-GuestFavorite/original/b4005b30-79ff-4287-860c-67829ecd7412.png"
            }
            alt={""}
            width={90}
            height={160}
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold">
            {total > 4 ? "Guest favorite" : "Guest bad"}
          </h1>
          <h1 className="px-10 py-2 text-[16px] mb-6">
            One of the most loved homes on Airbnb<br></br> based on ratings,
            reviews, and reliability
          </h1>
        </div>

        <div className="grid grid-cols-6 gap-2">
          <ReviewItem
            label="Cleanliness"
            score={scores[0].toString()}
            icon={<TfiSpray size={30} />}
          />
          <ReviewItem
            label="Accuracy"
            score={scores[1].toString()}
            icon={<IoIosCheckmarkCircleOutline size={30} />}
          />
          <ReviewItem
            label="Check-in"
            score={scores[2].toString()}
            icon={<GoKey size={30} />}
          />
          <ReviewItem
            label="Communication"
            score={scores[3].toString()}
            icon={<RiMessage2Line size={30} />}
          />
          <ReviewItem
            label="Location"
            score={scores[4].toString()}
            icon={<GrMapLocation size={30} />}
          />
          <ReviewItem
            label="Value"
            score={scores[5].toString()}
            icon={<FiTag size={30} />}
          />
        </div>
      </div>
      <ReviewInfo reviews={reviews} scores={scores} total={total} />
      {isOpen && <Review closeModal={closeModal} apartmentId={apartmentId} />}
      <div className="fixed bottom-3 right-3">
        {reservated && (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full"
          >
            Review
          </button>
        )}
      </div>
    </div>
  );
};
