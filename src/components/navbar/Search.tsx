"use client";
import React, { useMemo, useState } from "react";
import { differenceInDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import Modal from "antd/es/modal/Modal";
import { Popover } from "antd";
import SearchCountryModal from "../modals/SearchCountry";

import SearchModal from "../modals/SearchModal";
import SearchDate from "../modals/SearchDate";
import SearchGuest from "../modals/Searchguests";
import { Footer } from "antd/es/layout/layout";
import { MdOutlineCancel } from "react-icons/md";
import { useRouter } from "next/navigation";
import { MdLocalAirport } from "react-icons/md";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { GrUserManager } from "react-icons/gr";

import AnimatedTab from "../Animated tab";

const MENU = [
  { title: "Anywhere" },
  { title: "Anytime" },
  { title: "Add guests" },
];

type dateRange = {
  startDate: Date;
  endDate: Date;
  key: string;
};

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [country, setCountry] = useState(searchParams?.get("country"));
  const [day, setDay] = useState(searchParams?.get("startDate"));
  const [guestCount, setGuestCount] = useState(searchParams?.get("guestCount"));

  const [countryModalShow, setCountryModalShow] = useState(false);
  const [dateModalShow, setDateModalShow] = useState(false);
  const [guestModalShow, setGuestModalShow] = useState(false);

  const guestLabel = guestCount ? `${guestCount} Guests` : "Guests";

  const handleCountryClick = () => {
    setCountryModalShow(true);
    setDateModalShow(false);
    setGuestModalShow(false);
  };

  const handelDateClick = () => {
    setDateModalShow(true);
    setCountryModalShow(false);
    setGuestModalShow(false);
  };

  const handleGuestClick = () => {
    setGuestModalShow(true);
    setDateModalShow(false);
    setCountryModalShow(false);
  };

  const handleModalCancel = () => {
    setCountryModalShow(false);
    setDateModalShow(false);
    setGuestModalShow(false);
  };

  const handleModalOK = (value: string) => {
    setCountryModalShow(!countryModalShow);
    setCountry(value);
    setGuestModalShow(false);
  };

  const handleDateModalOK = (value: dateRange) => {
    // console.log(value.startDate, value.endDate);
    const startday = getDate(value.startDate);
    const endday = getDate(value.endDate);
    const date = `${startday} ~ ${endday}`;
    setDay(date);
    setDateModalShow(false);
  };

  const handleGuestModalOK = (value: number) => {
    // console.log(value, "----------------------")
    setGuestCount(`${value}`);
    setGuestModalShow(false);
  };

  const getDate = (date: Date) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    const dayIndex = date.getDay();
    const dayName = daysOfWeek[dayIndex];
    const formattedDate = `${dayName}-${month}-${dayOfMonth}`;
    return formattedDate;
  };

  const handleSearch = () => {
    router.push(
      `/listings?country=${country}&startDate=${day}&guestCount=${guestCount}`
    );
  };

  return (
    <>
      <button
        type="button"
        className="border-[2px] border-pink-400  rounded-full shadow-sm hover:shadow-md transition duration-300 cursor-pointer bg-white"
      >
        <div className="flex flex-row justify-between items-center py-[4px]">
          <Popover
            visible={countryModalShow}
            content={
              <SearchCountryModal
                onCancel={handleModalCancel}
                onOK={handleModalOK}
              />
            }
            trigger={"click"}
          >
            <div onClick={handleCountryClick}>
              <small className="text-sm font-bold px-6 text-[#585858] flex items-center justify-between ">
                <div className="pr-[5px]">
                  <MdLocalAirport />
                </div>

                {country ? country : "Anywhere"}
                {country && (
                  <div
                    onClick={(event) => {
                      event.stopPropagation();
                      setCountry(null);
                    }}
                    className="pl-[10px]"
                  >
                    {" "}
                    <MdOutlineCancel />
                  </div>
                )}
              </small>
            </div>
          </Popover>

          <Popover
            visible={dateModalShow}
            content={
              <SearchDate
                onCancel={handleModalCancel}
                onOK={handleDateModalOK}
              />
            }
            trigger={"click"}
          >
            <div onClick={handelDateClick}>
              <small className="  text-sm font-bold px-6 border-x-[1px] flex items-center justify-between text-center text-[#585858] ">
                <div className="pr-[5px]">
                  <IoCalendarNumberOutline />
                </div>

                {day ? day : "Anytime"}
                {day && (
                  <div
                    onClick={(event) => {
                      event.stopPropagation();
                      setDay(null);
                    }}
                    className="pl-[10px]"
                  >
                    {" "}
                    <MdOutlineCancel />
                  </div>
                )}
              </small>
            </div>
          </Popover>

          <Popover
            visible={guestModalShow}
            content={
              <SearchGuest
                onCancel={handleModalCancel}
                onOK={handleGuestModalOK}
              />
            }
            trigger={"click"}
          >
            <div
              className="text-sm pl-6 pr-2 text-[#585858] flex flex-row items-center justify-between gap-x-[10px]"
              onClick={handleGuestClick}
            >
              <small className="flex justify-between items-center font-normal text-sm w-[80%] text-[#585858]">
                <div className="pr-[5px]">
                  <GrUserManager />
                </div>
                {guestLabel}
                {guestCount && (
                  <div
                    onClick={(event) => {
                      event.stopPropagation();
                      setGuestCount(null);
                    }}
                    className="pl-[10px]"
                  >
                    {" "}
                    <MdOutlineCancel />
                  </div>
                )}
              </small>

              <div
                className="p-2  bg-rose-500 rounded-full  text-white"
                onClick={(event) => {
                  event.stopPropagation();
                  handleSearch();
                }}
              >
                <FaSearch className="text-[12px]" />
              </div>
            </div>
          </Popover>
        </div>
      </button>
    </>
  );
};

export default Search;
