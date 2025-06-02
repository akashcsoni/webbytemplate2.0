// import { useState, useEffect } from "react";
import { Input, Textarea } from "@heroui/react";
import { useEffect, useState } from "react";

export default function FormTextArea({
  data,
  onChange,
  error,
  defaultValueData,
}) {
  const [localError, setlocalError] = useState("");
  const [value, setValue] = useState(defaultValueData || "");

  const handleChange = () => {
    onChange(data.name, value);
  };

  useEffect(() => {
    handleChange(); // Call handleChange whenever the value changes
  }, [value]);

  useEffect(() => {
    setValue(defaultValueData ?? "");
  }, [defaultValueData]);

  useEffect(() => {
    setlocalError(error); // Call handleChange whenever the error changes
  }, [error]);

  const isInvalid = localError && localError.length > 0 ? true : false; // Check if there are errors
  const errorMessage = localError && localError.length > 0 ? localError[0] : ""; // Get the first localError message if errors exist

  const getRules = (rules) => {
    return Array.isArray(rules) && rules.includes("required") ? "*" : "";
  };

  return (
    <Textarea
      name={data?.name}
      classNames={{
        inputWrapper:
          "w-full border border-primary/10 xl:py-3 py-2 xl:px-5 md:px-4 px-3 lg:!h-[120px] md:!h-[110px] !h-[100px] focus:outline-none !bg-white rounded-[5px]",
        base: "!bg-white",
        input:
          "xl:!text-base md:!text-[15px] !text-sm placeholder:!text-gray-300 !font-normal",
        label: "2xl:text-base md:text-[15px] !text-black text-sm ",
        errorMessage: "!text-red",
      }}
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
      onChange={(e) => {
        setValue(e.target.value);
      }}
      value={value}
      label={`${data?.label}${getRules(data.rules)}`}
      labelPlacement="outside"
      placeholder={data?.placeholder}
      type={data?.type}
      isInvalid={isInvalid}
      errorMessage={() => (
        <ul>
          <li className="xl:text-sm text-[13px]">{errorMessage}</li>
        </ul>
      )}
      variant="bordered"
    />
  );
}
