"use client";
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { formatISO } from "date-fns";

import Modal from "./Modal";
import Button from "../Button";
import Heading from "../Heading";
import Counter from "../inputs/Counter";
import CountrySelect from "../inputs/CountrySelect";

interface SearchCountryModalProps {
  onCancel: () => void;
  onOK: (value: number ) => void;
}

const SearchGuest: React.FC<SearchCountryModalProps>  = ({ onCancel, onOK}) => {


  const { handleSubmit, setValue, watch, getValues } = useForm<FieldValues>({
    defaultValues: {
      guestCount: 1,

    },
  });

  const handleCancelClick = () => {
    onCancel();
 }

 const handleOKClick = () => {
   const selectedValue = getValues().guestCount;
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
    <div className="flex flex-col gap-6">
      <Heading
        title="More information"
        subtitle="Find your perfect place!"
      />
      <Counter
        title="Guests"
        subtitle="How many guests do you allow?"
        watch={watch}
        onChange={setCustomValue}
        name="guestCount"
      />
      <div className="flex gap-x-[10px] justify-end pt-[20px]">
        <button className="rounded-[10px] bg-pink-500 py-[5px] px-[15px] text-white" onClick = { handleCancelClick}>Cancel</button>
        <button className="rounded-[10px] bg-green-600 py-[5px] px-[15px] text-white" onClick={ handleOKClick}>OK</button>
      </div>
    </div>
  );

};

export default SearchGuest;
