"use client";
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Heading from "../Heading";

 type dateRange ={
  startDate: Date,
  endDate: Date,
  key: string,
}

interface SearchCountryModalProps {
  onCancel: () => void;
  onOK: (value: dateRange ) => void;
}
const Calendar = dynamic(() => import("@/components/Calender"), { ssr: false });

const SearchDate: React.FC<SearchCountryModalProps>  = ({ onCancel, onOK}) => {


  const { handleSubmit, setValue, watch, getValues } = useForm<FieldValues>({
    defaultValues: {
      dateRange: {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    },
  });

  const dateRange = watch("dateRange");

  const handleCancelClick = () => {
    onCancel();
 }

 const handleOKClick = () => {
   const selectedValue = getValues().dateRange;
    onOK(selectedValue);
 }
 
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  

   
        return (
          <div className="flex flex-col gap-3">
            <Heading
              title="When do you plan to go?"
              subtitle="Make sure everyone is free!"
            />
            <div className="h-[348px] w-full">
              <Calendar onChange={setCustomValue} value={dateRange} />
            </div>
            <div className="flex gap-x-[10px] justify-end pt-[40px]">
                <button className="rounded-[10px] bg-pink-500 py-[5px] px-[15px] text-white" onClick={handleCancelClick}>Cancel</button>
                <button className="rounded-[10px] bg-green-600 py-[5px] px-[15px] text-white" onClick={handleOKClick}>OK</button>
            </div>
          </div>
        );


};

export default SearchDate;
