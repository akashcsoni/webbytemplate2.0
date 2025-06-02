// import { useState, useEffect } from "react";
import { themeConfig } from "@/config/theamConfig";
import { strapiPost } from "@/lib/api/strapiClient";
import { Input } from "@heroui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function FormSingleFile({
  data,
  onChange,
  error,
  defaultValueData,
}) {
  const [localError, setlocalError] = useState("");
  const [value, setValue] = useState(defaultValueData || null);
  const [zipLoading, setZipLoading] = useState(false);
  const [correctZip, setCorrectZip] = useState(false);

  const handleChange = () => {
    onChange(data.name, value);
  };

  const handleZipUpload = async (e) => {
    setZipLoading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("files", file);

    try {
      const fileData = await strapiPost(`upload`, formData, themeConfig.TOKEN);
      setValue(fileData[0].id);
      setZipLoading(false);
      setCorrectZip(true);
      setTimeout(() => {
        setCorrectZip(false);
      }, 2000);
    } catch (error) {
      setZipLoading(false);
      if (error.status === 413) {
        setZipLoading(false);
        toast.error(error.response.data.error.message);
      }
    }
  };

  useEffect(() => {
    handleChange(); // Call handleChange whenever the value changes
  }, [value]);

  useEffect(() => {
    setlocalError(error); // Call handleChange whenever the error changes
  }, [error]);

  const isInvalid = localError && localError.length > 0 ? true : false; // Check if there are errors
  const errorMessage = localError && localError.length > 0 ? localError[0] : ""; // Get the first localError message if errors exist

  const getRules = (rules) => {
    return Array.isArray(rules) && rules.includes("required") ? "*" : "";
  };

  return (
    <Input
      name={data?.name}
      classNames={{
        input:
          "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
        inputWrapper:
          "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
        label:
          "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
        errorMessage: "!text-red",
      }}
      onChange={handleZipUpload}
      description={
        data?.description && (
          <div className="flex items-center gap-[5px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M10.6667 12.6667L14 9.33335L10.6667 6.00002"
                stroke="#505050"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004"
                stroke="#505050"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="xl:text-sm md:text-[13px] text-xs md:leading-5 leading-[17px] text-gray-200">
              {data?.description}
            </p>
          </div>
        )
      }
      accept=".zip"
      label={`${data?.label}${getRules(data.rules)}`}
      labelPlacement="outside"
      placeholder={data?.placeholder}
      type={data?.type}
      isInvalid={isInvalid}
      endContent={
        zipLoading ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 50 50"
            fill="none"
          >
            <circle cx="40" cy="25" r="3" fill="currentColor">
              <animate
                attributeName="opacity"
                values="1;0.2;1"
                dur="1.2s"
                begin="0s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="37.99038105676658" cy="32.5" r="3" fill="currentColor">
              <animate
                attributeName="opacity"
                values="1;0.2;1"
                dur="1.2s"
                begin="0.1s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="32.5" cy="37.99038105676658" r="3" fill="currentColor">
              <animate
                attributeName="opacity"
                values="1;0.2;1"
                dur="1.2s"
                begin="0.2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="25" cy="40" r="3" fill="currentColor">
              <animate
                attributeName="opacity"
                values="1;0.2;1"
                dur="1.2s"
                begin="0.30000000000000004s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="17.500000000000004"
              cy="37.99038105676658"
              r="3"
              fill="currentColor"
            >
              <animate
                attributeName="opacity"
                values="1;0.2;1"
                dur="1.2s"
                begin="0.4s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="12.00961894323342" cy="32.5" r="3" fill="currentColor">
              <animate
                attributeName="opacity"
                values="1;0.2;1"
                dur="1.2s"
                begin="0.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="10" cy="25.000000000000004" r="3" fill="currentColor">
              <animate
                attributeName="opacity"
                values="1;0.2;1"
                dur="1.2s"
                begin="0.6000000000000001s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="12.009618943233418"
              cy="17.500000000000004"
              r="3"
              fill="currentColor"
            >
              <animate
                attributeName="opacity"
                values="1;0.2;1"
                dur="1.2s"
                begin="0.7000000000000001s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="17.499999999999993"
              cy="12.009618943233423"
              r="3"
              fill="currentColor"
            >
              <animate
                attributeName="opacity"
                values="1;0.2;1"
                dur="1.2s"
                begin="0.8s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="24.999999999999996" cy="10" r="3" fill="currentColor">
              <animate
                attributeName="opacity"
                values="1;0.2;1"
                dur="1.2s"
                begin="0.9s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="32.5" cy="12.009618943233422" r="3" fill="currentColor">
              <animate
                attributeName="opacity"
                values="1;0.2;1"
                dur="1.2s"
                begin="1s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="37.99038105676658"
              cy="17.499999999999993"
              r="3"
              fill="currentColor"
            >
              <animate
                attributeName="opacity"
                values="1;0.2;1"
                dur="1.2s"
                begin="1.1s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        ) : correctZip ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="30"
            height="30"
            viewBox="0 0 48 48"
          >
            <polyline
              fill="none"
              stroke="currentColor"
              strokeMiterlimit="10"
              strokeWidth="4"
              points="6,27.5 17,38.5 42,13.5"
            ></polyline>
          </svg>
        ) : (
          ""
        )
      }
      errorMessage={() => (
        <ul>
          <li className="2xl:text-sm md:text-[13px] text-xs">{errorMessage}</li>
        </ul>
      )}
      variant="bordered"
    />
  );
}
