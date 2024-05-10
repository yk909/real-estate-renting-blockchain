"use client";
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";

interface SearchCountryModalProps {
    onCancel: () => void;
    onOK: (value: string) => void;
  }

const SearchCountryModal: React.FC<SearchCountryModalProps> = ({ onCancel, onOK} ) => {

const { handleSubmit, setValue, watch, getValues } = useForm<FieldValues>({
    defaultValues: {
        location: null,
    },
    });
const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
    });
    };

  const location = watch("location");
  const country = location?.label;

  const handleCancelClick = () => {
     onCancel();
  }

  const handleOKClick = () => {
    const selectedValue = getValues().location?.label;
     onOK(selectedValue);
  }

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [country]
  );
        return (
          <div className="flex flex-col gap-4 w-[350px]">
            <CountrySelect value={location} onChange={setCustomValue} />
            <div className="h-[240px]">
              <Map center={location?.latlng} />
            </div>
            <div className="flex gap-x-[10px] justify-end pt-[10px]">
                <button className="rounded-[10px] bg-pink-500 py-[5px] px-[15px] text-white" onClick={handleCancelClick}>Cancel</button>
                <button className="rounded-[10px] bg-green-600 py-[5px] px-[15px] text-white" onClick={handleOKClick}>OK</button>
            </div>
          </div>
        );
  };

  
export default SearchCountryModal;
