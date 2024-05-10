"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";
import { useState } from "react";
import { GrFormNext } from "react-icons/gr";
import { GrFormPrevious } from "react-icons/gr";

declare global {
  var cloudinary: any;
}

const uploadPreset = "dbtldkyn";

interface ImageUploadProps {
  onChange: (value: string[]) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  const [displayIndex, setDisplayIndex] = useState(0);

  const handleUpload = useCallback(
    (result: any) => {
      onChange([...value, result.info.secure_url]);
    },
    [onChange, value]
  );

  // console.log(value, "---------------")

  return (
    <CldUploadWidget
      onUpload={handleUpload}
      uploadPreset={uploadPreset}
      options={{
        maxFiles: 10,
      }}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className="
              relative
              cursor-pointer
              transition
              border-dashed 
              border-2 
              p-20 
              border-neutral-300
              flex
              flex-col
              justify-center
              items-center
              gap-4
              text-neutral-600
            "
          >
            <TbPhotoPlus size={50} />
            <div className="font-semibold text-lg">Click to upload</div>
            {value.length && (
              <div
                className="
              absolute inset-0 w-full h-full"
              >
                <Image
                  fill
                  style={{ objectFit: "cover" }}
                  src={value[displayIndex]}
                  alt="House"
                />

                {/* <div className="relative transform top-1/2 -translate-y-1/2 px-[15px]">
                  {displayIndex > 1 && (
                    <div className="bg-slate-50 rounded-full w-[25px] h-[25px] flex items-center justify-center hover:scale-110 transition-all absolute right-[10px]" onClick={() => {setDisplayIndex(displayIndex+1)}}>
                      <GrFormPrevious className="text-gray-900 w-[15px] h-[15px]" />
                    </div>
                  )}
                  {displayIndex < value.length && (
                    <div className="bg-slate-50 rounded-full w-[25px] h-[25px] flex items-center justify-center hover:scale-110 transition-all absolute right-[10px]"  onClick={() => {setDisplayIndex(displayIndex-1)}}>
                      <GrFormNext className="text-gray-900 w-[15px] h-[15px]" />
                    </div>
                  )}
                </div> */}
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;
