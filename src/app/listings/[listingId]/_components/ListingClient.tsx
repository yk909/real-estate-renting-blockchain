"use client";
import React, {
  ReactNode,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { Range } from "react-date-range";
import { User } from "next-auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import ListingReservation from "./ListingReservation";
import { createReservation } from "@/services/reservation";

import moment from "moment";
import { appartmentReservation } from "@/Blockchain.services";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

interface ListingClientProps {
  reservations?: {
    date: Date;
  }[];
  children: ReactNode;
  id: string;
  title: string;
  price: number;
  user: any;
}

const ListingClient: React.FC<ListingClientProps> = ({
  price,
  reservations = [],
  children,
  user,
  id,
  title,
}) => {
  const [totalPrice, setTotalPrice] = useState(price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();
  const queryClient = useQueryClient();

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];
    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.date),
        end: new Date(reservation.date),
      });

      dates = [...dates, ...range];
    });
    return dates;
  }, [reservations]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if (dayCount && price) {
        setTotalPrice((dayCount + 1) * price);
      } else {
        setTotalPrice(price);
      }
    }
  }, [dateRange.endDate, dateRange.startDate, price]);

  const onCreateReservation = () => {
    if (!user) return toast.error("Please log in to reserve listing.");
    startTransition(async () => {
      try {
        const { endDate, startDate } = dateRange;

        const start = moment(startDate);
        const end = moment(endDate);
        const timestampArray = [];

        while (start <= end) {
          timestampArray.push(start.valueOf());
          start.add(1, "days");
        }

        const params = {
          id,
          datesArray: timestampArray,
          amount: price * timestampArray.length,
        };

        await appartmentReservation(params).then(() => {
          router.push("/trips");
          toast.success(`You've successfully reserved "${title}".`);
        });

        // await createReservation({
        //   listingId: id,
        //   endDate,
        //   startDate,
        //   totalPrice,
        // });

        // queryClient.invalidateQueries(["trips", user.id]);
        // queryClient.invalidateQueries(["reservations", user.id]);
      } catch (error: any) {
        toast.error(error?.message);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
      {children}

      <div className="order-first mb-10 md:order-last md:col-span-3">
        <ListingReservation
          price={price}
          totalPrice={totalPrice}
          onChangeDate={(name, value) => setDateRange(value)}
          dateRange={dateRange}
          onSubmit={onCreateReservation}
          isLoading={isLoading}
          disabledDates={disabledDates}
        />
      </div>
    </div>
  );
};

export default ListingClient;
