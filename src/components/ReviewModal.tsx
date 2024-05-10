import React from "react";


import { TfiSpray } from "react-icons/tfi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { GoKey } from "react-icons/go";
import { RiMessage2Line } from "react-icons/ri";
import { FiTag } from "react-icons/fi";
import { GrMapLocation } from "react-icons/gr";

import { title } from "process";
import Image from "next/image";

import ReviewCard from "./ReviewCard";

interface ReviewCardProps {
    name: string,
    location: string,
    description: string,
}

interface ReviewInfoProps {
    reviews: ReviewCardProps[],
    closeModal: () => void,
    scores: Number[],
    total: Number
}

interface ReviewIconProps {
    title: string,
    score: string,
    icon: React.ReactElement
}
const ReviewIcon: React.FC<ReviewIconProps> = ({

    title,
    score,
    icon
}) => {
    return (
        <div className="flex pb-3 mt-3 items-center w-full justify-between border-b-2 mb-5">
            <div>
                {icon}
            </div>
            <div className="mx-3"> <h1 className="flex p-0 ">{title}</h1></div>

            <h1 className="flex justify-end">{score}</h1>
        </div>

    )
}

const SearchBox = () => {
    return (
        <div className="rounded-5xl">
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-dark sr-only dark:text-white">Search</label>
            <div className="relative rounded-2xl">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-black dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <input type="search" id="default-search" className="block rounded-full h-[40px] w-full ps-10 text-sm text-gray-900 border border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />

            </div>
        </div>
    )
}

const ReviewModal: React.FC<ReviewInfoProps> = ({
    reviews,
    closeModal,
    total,
    scores
}) => {
    return (
        <>
            <div className="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-hidden h-full w-full px-4 ">
                <div className="relative top-20 mx-auto shadow-xl rounded-md bg-white w-[50vw] h-[90vh]">

                    <div className="  p-5">
                        <button type="button"
                            onClick={closeModal}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                    <div >
                        <div className="grid gap-0 grid-cols-8 ">
                            {/*  */}
                            <div className="col-span-3 ">
                                <div className=" hidden xl:block">
                                    {/* Logo */}
                                    <div className="flex items-center justify-center">
                                        <Image src={"https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-GuestFavorite/original/78b7687c-5acf-4ef8-a5ea-eda732ae3b2f.png"} alt={""} width={60} height={100} />
                                        <h1 className=" text-6xl font-bold py-10 mb-5 font-Circular" >{total.toFixed(2)}</h1>
                                        <Image src={"   https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-GuestFavorite/original/b4005b30-79ff-4287-860c-67829ecd7412.png"} alt={""} width={60} height={100} />
                                    </div>

                                    {/* description */}
                                    <div className="flex flex-col justify-center items-center">

                                        <h1 className="">Guest favorite</h1>
                                        <h1 className="px-10 py-2 text-[14px] mb-6">One of the most loved homes on Airbnb based on ratings, reviews, and reliability</h1>

                                    </div>
                                    <hr className="px-4 w-[70%] mx-auto mb-20" />
                                    <div className="pl-10 pr-5">
                                        <ReviewIcon
                                            title="Cleanliness"
                                            score={scores[0].toString()}
                                            icon={<TfiSpray size={30} />}
                                        />
                                        <ReviewIcon
                                            title="Accuracy"
                                            score={scores[1].toString()}
                                            icon={<IoIosCheckmarkCircleOutline size={30} />}
                                        />
                                        <ReviewIcon
                                            title="Check-in"
                                            score={scores[2].toString()}
                                            icon={<GoKey size={30} />}
                                        />
                                        <ReviewIcon
                                            title="Communication"
                                            score={scores[3].toString()}
                                            icon={<RiMessage2Line size={30} />}
                                        />
                                        <ReviewIcon
                                            title="Location"
                                            score={scores[4].toString()}
                                            icon={<GrMapLocation size={30} />}
                                        />
                                        <ReviewIcon
                                            title="Value"
                                            score={scores[5].toString()}
                                            icon={<FiTag size={30} />}
                                        />

                                    </div>
                                </div>

                            </div>
                            {/* Content */}
                            <div className="col-span-5">
                                {/* title */}
                                <div className="flex  bg-white justify-between items-center  px-10 py-5">
                                    <h1 className="flex justify-start text-semibold text-2xl font-bold"> {reviews?.length} Reviews</h1>
                                    <select className="w-[30%] py-2 justify-end  px-4 pe-9 block border-dark rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 border-2">

                                        <option>Most recent</option>
                                        <option>Most recent</option>
                                        <option>Most recent</option>
                                    </select>
                                </div>
                                <div className=" justify-between items-center  px-10 mb-5">
                                    <SearchBox />
                                </div>

                                <div className="flex overflow-scroll h-[65vh] overflow-x-hidden">
                                    <div className="  h-full mt-5">
                                        {
                                            reviews?.map((item, index) => {
                                                return (
                                                    <ReviewCard
                                                        key={index}
                                                        name={item.name}
                                                        location={item.location}
                                                        description={item.description} />
                                                )
                                            })}
                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default ReviewModal;