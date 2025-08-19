// import { useState, useEffect } from "react";
import { Avatar, Input } from "@heroui/react";
import { useEffect, useState } from "react";

export default function FormInput({
  data,
  onChange,
  error,
  defaultValueData,
  formValues,
}) {
  const [localError, setlocalError] = useState("");
  const [value, setValue] = useState(defaultValueData || "");
  const [options, setOptions] = useState([]);

  const handleChange = () => {
    onChange(data.name, value);
  };

  useEffect(() => {
    handleChange();
  }, [value]);

  useEffect(() => {
    setValue(defaultValueData ?? "");
  }, [defaultValueData]);

  useEffect(() => {
    setlocalError(error); // Call handleChange whenever the error changes
  }, [error]);

  const isInvalid = localError && localError.length > 0 ? true : false; // Check if there are errors
  const errorMessage = localError && localError.length > 0 ? localError[0] : ""; // Get the first localError message if errors exist

  useEffect(() => {
    if (data.options && data.startContent) {
      setOptions(data.options);
    }
  }, [data]);

  function getFlagUrl(documentId) {
    const country = options.find((option) => option.documentId === documentId);
    return country ? country.url : "";
  }

  const getRules = (rules) => {
    return Array.isArray(rules) && rules.includes("required") ? "*" : "";
  };

  return (
    <Input
      name={data?.name}
      classNames={{
        input: `xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light ${data?.startContent && "!pl-3"}`,
        inputWrapper:
          "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
        label:
          "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
        errorMessage: "!text-[#ef4444]",
        startContent: "pl-2",
      }}
      onChange={(e) => {
        setValue(e.target.value);
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
      readOnly={data?.readOnly}
      value={value}
      label={`${data?.label}${getRules(data.rules)}`}
      labelPlacement="outside"
      placeholder={data?.placeholder}
      type={data?.type || "text"}
      isInvalid={isInvalid}
      startContent={
        data?.startContent && (
          <Avatar
            alt={formValues?.[data?.relation]}
            className="w-6 h-6 flex-shrink-0"
            src={getFlagUrl(formValues?.[data?.relation])}
          />
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
