"use server";
import { db } from "@/lib/db";

import { getCurrentUser } from "./user";
import { getListingById } from "./listing";

export const createReview = async ({
    cleanliness,
    accuracy,
    check_in,
    communication,
    location_score,
    value,
    description,
    listingId,
}: {
    cleanliness: number,
    accuracy: number,
    check_in: number,
    communication: number,
    location_score: number,
    value: number,
    description: string,
    listingId: string
}) => {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized!");

    const listing = await getListingById(listingId);
    if (!listing) throw new Error("No listings!");

    const review = await db.review.create({
        data: {
            cleanliness,
            accuracy,
            check_in,
            communication,
            location_score,
            value,
            description,
            userId: user.id,
            listingId: listing.id,
        }
    })
    return review;
};

export const getReviews = async (listingId: string) => {
    try {
        const listing = await getListingById(listingId);
        if (!listing?.Review) throw new Error("Error no data");

        return listing.Review;
    } catch (error) {
        console.error("Failed to get Reviews data!, ", error);
    }
}
