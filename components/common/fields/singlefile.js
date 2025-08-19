import { themeConfig } from "@/config/theamConfig";
import { strapiPost } from "@/lib/api/strapiClient";
import { Input } from "@heroui/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const MAX_FILE_SIZE_MB = 50;

export default function FormSingleFile({
  data,
  onChange,
  error,
  defaultValueData,
}) {
  const [localError, setLocalError] = useState("");
  const [value, setValue] = useState(defaultValueData || null);
  const [zipLoading, setZipLoading] = useState(false);
  const [correctZip, setCorrectZip] = useState(false);

  const handleChange = () => {
    onChange(data.name, value);
  };

  const handleZipUpload = async (e) => {
    const file = e.target.files[0];

    // ✅ 1. Size validation
    if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      const errorMsg = `File size must be under ${MAX_FILE_SIZE_MB}MB`;
      setLocalError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setZipLoading(true);
    const formData = new FormData();
    formData.append("files", file);

    try {
      const fileData = await strapiPost(`upload`, formData, themeConfig.TOKEN);
      setValue(fileData[0].id);
      setLocalError(""); // ✅ Clear previous error
      setCorrectZip(true);
      setTimeout(() => setCorrectZip(false), 2000);
    } catch (error) {
      if (error.status === 413) {
        toast.error("File is too large for the server");
      } else {
        toast.error("Upload failed. Try again.");
      }
    } finally {
      setZipLoading(false);
    }
  };

  useEffect(() => {
    handleChange(); // Send value change up
  }, [value]);

  useEffect(() => {
    setLocalError(error || ""); // External error passed down
  }, [error]);

  const isInvalid = !!localError;
  const errorMessage = localError;

  const getRules = (rules) =>
    Array.isArray(rules) && rules.includes("required") ? "*" : "";

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
        errorMessage: "!text-[#ef4444]",
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
          <span className="animate-spin">⏳</span>
        ) : correctZip ? (
          <span className="text-green-500">✔️</span>
        ) : null
      }
      errorMessage={() =>
        errorMessage && (
          <ul>
            <li className="2xl:text-sm md:text-[13px] text-xs">
              {errorMessage}
            </li>
          </ul>
        )
      }
      variant="bordered"
    />
  );
}
