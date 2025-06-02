"use client";
import { RadioGroup, Radio } from "@heroui/react";
import { useEffect, useRef, useState } from "react";

export default function FormRadio({ data, onChange, error, defaultValueData }) {
  const [localError, setLocalError] = useState("");
  const [value, setValue] = useState(
    typeof defaultValueData === "boolean"
      ? String(defaultValueData)
      : defaultValueData || ""
  );

  const hasChanged = useRef(false);

  useEffect(() => {
    if (defaultValueData !== undefined && !hasChanged.current) {
      setValue(String(defaultValueData));
      hasChanged.current = true;
    }
  }, [defaultValueData]);

  useEffect(() => {
    onChange(data.name, value);
  }, [value]);

  useEffect(() => {
    setLocalError(error?.[0] || "");
  }, [error]);

  const isInvalid = Boolean(localError);

  const getRequiredMark = (rules) =>
    Array.isArray(rules) && rules.includes("required") ? "*" : "";

  return (
    <RadioGroup
      label={`${data?.label}${getRequiredMark(data.rules)}`}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      orientation="horizontal"
      classNames={{
        label:
          "items-baseline 2xl:!text-base md:!text-[15px] sm:!text-sm !text-black block sm:!pb-1 !font-normal",
      }}
      isInvalid={isInvalid}
      errorMessage={
        isInvalid && (
          <ul>
            <li className="2xl:text-sm md:text-[13px] text-xs">{localError}</li>
          </ul>
        )
      }
      description={
        data?.description && (
          <div className="flex sm:items-center items-start gap-[5px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="flex-shrink-0 sm:w-4 sm:h-4 w-3 h-3 sm:m-0 mt-1"
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
            <span className="xl:text-sm md:text-[13px] text-xs md:leading-5 leading-[17px] text-gray-200">
              {data?.description}
            </span>
          </div>
        )
      }
    >
      <div className="grid 1xl:grid-cols-2 grid-cols-1 gap-2">
        {data?.options?.map((option, index) => (
          <Radio
            key={index}
            value={String(option?.value)}
            classNames={{
              base: "items-baseline",
              wrapper: "lg:w-5 lg:h-5 sm:w-[18px] sm:h-[18px] w-4 h-4",
              label:
                "2xl:text-base 1xl:text-[15px] text-sm sm:leading-6 leading-5 text-gray-200",
            }}
            description={
              option?.description && (
                <div className="flex items-center gap-[5px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="flex-shrink-0"
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
                    {option?.description}
                  </p>
                </div>
              )
            }
          >
            {option?.label}
          </Radio>
        ))}
      </div>
    </RadioGroup>
  );
}
