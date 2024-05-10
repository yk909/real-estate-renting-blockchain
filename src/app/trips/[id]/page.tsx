"use client";

import React, { Suspense, useEffect, useTransition } from "react";

import EmptyState from "@/components/EmptyState";
import Heading from "@/components/Heading";

import { getGlobalState, useGlobalState } from "@/store";
import {
  checkInApartment,
  getReservations,
  getUnavailableDates,
  hasReservatedDateReached,
  refund,
} from "@/Blockchain.services";
import { useParams } from "next/navigation";
import Link from "next/link";
import SpinnerMini from "@/components/Loader";

interface IParams {
  id: string;
}

const ReservationsPage = ({ params: { id } }: { params: IParams }) => {
  const [reservations] = useGlobalState("reservations");

  useEffect(() => {
    const init = async () => {
      await getReservations(id);
    };
    init();
  }, []);

  if (reservations.length === 0) {
    return (
      <EmptyState
        title="No reservations found"
        subtitle="Looks like you haven't reserved"
      />
    );
  }

  return (
    <section className="main-container">
      <Heading title="Reservations" subtitle="" backBtn />
      <div className=" mt-8 md:mt-10 ">
        {reservations.map((reservation, index) => (
          <ReservationDisplay key={index} reservation={reservation} />
        ))}
      </div>
    </section>
  );
};

const ReservationDisplay = ({ reservation }: { reservation: any }) => {
  const { id } = useParams();
  const connectedAccount = getGlobalState("connectedAccount");

  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    async () => {
      const params = {
        id,
        reservationId: reservation.id,
      };
      await hasReservatedDateReached(params);
    };
  }, []);

  const handleCheckIn = () => {
    startTransition(async () => {
      await checkInApartment(id, reservation.id)
        .then(async () => {
          await getReservations(id);
        })
        .catch(() => {});
    });
  };

  const handleRefund = () => {
    startTransition(async () => {
      const params = {
        id,
        reservationId: reservation.id,
        date: new Date(reservation.date).getTime(),
      };

      await refund(params)
        .then(async () => {
          await getUnavailableDates(id);
          await getReservations(id);
        })
        .catch(() => {});
    });
  };

  const reservatedDayStatus = (reservation: any) => {
    const reservatedDate = new Date(reservation.date).getTime();
    const current = new Date().getTime();
    const reservatedDayStatus =
      reservatedDate < current && !reservation.checked;
    return reservatedDayStatus;
  };

  return (
    <>
      {reservation.tenant != connectedAccount.toLowerCase() ||
      reservation.cancelled == true ? null : (
        <div className="w-full flex justify-between items-center my-3 bg-gray-100 p-3">
          <Link className=" font-medium underline" href={"/listings/" + id}>
            {reservation.date}
          </Link>
          {reservatedDayStatus(reservation) ? (
            <button
              disabled={isLoading}
              className="p-2 bg-green-500 text-white rounded-full text-sm px-4"
              onClick={handleCheckIn}
            >
              {isLoading ? <SpinnerMini /> : <span>Check In</span>}
            </button>
          ) : reservation.checked ? (
            <button className="p-2 bg-yellow-500 text-white font-medium italic rounded-full text-sm px-4">
              Checked In
            </button>
          ) : (
            <button
              className="p-2 bg-[#ff385c] text-white rounded-full text-sm px-4"
              onClick={handleRefund}
              disabled={isLoading}
            >
              {isLoading ? <SpinnerMini /> : <span>Refund</span>}
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default ReservationsPage;
