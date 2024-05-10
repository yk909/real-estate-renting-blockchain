"use client";

import { useState } from "react";
import ReviewCard from "./ReviewCard";
import ReviewModal from "./ReviewModal";

interface ReviewCardProps {
  name: string;
  location: string;
  reviewText: string;
}

interface ReviewInfoProps {
  reviews: ReviewCardProps[];
  scores: Number[];
  total: Number;
}

const ReviewInfo: React.FC<ReviewInfoProps> = ({ reviews, scores, total }) => {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 py-10">
        {reviews?.map((item, index) => {
          return (
            index < 6 && (
              <ReviewCard
                key={index}
                name={item.name}
                location={item.location}
                description={item.reviewText}
              />
            )
          );
        })}
      </div>
      {reviews?.length >= 7 && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 border-black   border-[1px] rounded-md"
        >
          Show all {reviews?.length} reviews
        </button>
      )}
      {isOpen && (
        <ReviewModal
          reviews={reviews}
          closeModal={closeModal}
          scores={scores}
          total={total}
        />
      )}
    </>
  );
};

export default ReviewInfo;
