// import { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem, Avatar } from "@heroui/react";
import { useEffect, useState } from "react";

export default function FormSelect({
  data,
  onChange,
  error,
  defaultValueData,
}) {
  const [localError, setlocalError] = useState("");
  const [value, setValue] = useState(defaultValueData || "");
  const [options, setOptions] = useState([]);

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

  useEffect(() => {
    if (data.options && Array.isArray(data.options)) {
      const formattedOptions = data.options.map((option) => {
        const images = option.image ? option.image : option.cover;
        return {
          title: option.title,
          documentId: option.documentId,
          url: images ? images.url : option.url || "",
        };
      });

      setOptions(formattedOptions);
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
    <Autocomplete
      className={`!bg-white custom-auto-complete ${isInvalid ? "custom-auto-complete-error" : ""}`}
      classNames={{
        mainWrapper: "!bg-white",
        innerWrapper: `!bg-white 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full cursor-pointer flex justify-between items-center ${isInvalid ? "border !border-danger" : "border !border-gray-100"}`,
        input:
          "!2xl:text-base md:text-[15px] sm:text-sm !text-gray-300 placeholder:text-gray-300",
        label: "2xl:!text-base md:!text-[15px] !text-black !text-md",
        inputWrapper: "!bg-transparent" + isInvalid ? " !border-danger" : "",
      }}
      label={`${data?.label}${getRules(data.rules)}`}
      labelPlacement="outside"
      placeholder={data.placeholder}
      defaultItems={options}
      onSelectionChange={(e) => {
        setValue(e);
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
      selectedKey={value}
      startContent={
        data?.startContent &&
        value?.length > 0 && (
          <Avatar
            alt={value}
            className="w-5 h-5 flex-shrink-0"
            src={getFlagUrl(value)}
          />
        )
      }
      isInvalid={isInvalid}
      errorMessage={
        <ul>
          <li className="2xl:text-sm md:text-[13px] text-xs">{errorMessage}</li>
        </ul>
      }
    >
      {(item) => (
        <AutocompleteItem
          key={String(item.documentId)}
          startContent={
            data?.startContent && (
              <Avatar
                alt={item.documentId}
                className="w-5 h-5 flex-shrink-0"
                src={item.url}
              />
            )
          }
        >
          {item.title}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
