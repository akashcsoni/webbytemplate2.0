"use client";
import { useEffect, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { strapiDelete, strapiPost } from "@/lib/api/strapiClient";
import { themeConfig } from "@/config/theamConfig";
import toast from "react-hot-toast";

export default function FormDropzone({
  data,
  onChange,
  error,
  defaultValueData,
  type = "add",
}) {
  const [localError, setLocalError] = useState("");
  const [value, setValue] = useState(
    defaultValueData || (data.multiple ? [] : "")
  );
  const [image, setImage] = useState(
    defaultValueData || (data.multiple ? [] : "")
  );
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const isInvalid = !!(localError && localError.length > 0);
  const errorMessage = isInvalid ? localError[0] : "";

  const getRules = (rules) => {
    return Array.isArray(rules) && (rules.includes("required") || rules.includes("editModeRequired")) ? "*" : "";
  };

  useEffect(() => {
    onChange(data.name, value);
  }, [value]);

  useEffect(() => {
    if (defaultValueData) {
      if (data.multiple) {
        const formatedData = defaultValueData?.map((file) => ({
          name: file.name,
          url: file.url,
          id: file.id,
        }));
        setImage(formatedData);
        setValue(formatedData.map((file) => file.id));
      } else {
        setImage([defaultValueData]);
        setValue(defaultValueData?.id);
      }
    }
  }, [defaultValueData]);

  useEffect(() => {
    setLocalError(error);
  }, [error]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    handleFileSelection(files);
  };

  const handleFileSelection = async (files) => {
    if (!files.length) return;

    const formData = new FormData();

    if (data.multiple) {
      files.forEach((file) => formData.append("files", file, file.name));
    } else {
      formData.append("files", files[0], files[0].name);
    }

    try {
      setUploading(true);
      setUploadSuccess(false);

      const uploadedFiles = await strapiPost(
        "upload",
        formData,
        themeConfig.TOKEN
      );

      if (!uploadedFiles || uploadedFiles.length === 0) {
        throw new Error("No files returned from server.");
      }

      const formattedFiles = uploadedFiles.map((file) => ({
        name: file.name,
        url: file.url,
        id: file.id,
      }));

      if (data.multiple) {
        setImage((prev) => [...prev, ...formattedFiles]);
        setValue((prev) => [...prev, ...formattedFiles.map((file) => file.id)]);
      } else {
        setImage(formattedFiles);
        setValue(formattedFiles?.[0]?.id);
      }

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2000);
    } catch (error) {
      console.error(error); 
      if (error.status === 413 && error.response?.data?.error?.message) {
        toast.error(error.response.data.error.message);
      } else {
        toast.error("Upload failed. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const removeFile = async (index) => {
    if (type === "add") {
      await strapiDelete(`upload/files/${index}`, themeConfig.TOKEN);
    }

    const updatedImages = image.filter((_, i) => _.id !== index);

    if (data.multiple) {
      setImage(updatedImages);
      setValue(updatedImages.map((file) => file.id));
    } else {
      setImage([]);
      setValue(null);
    }
  };

  return (
    <div className="py-4 px-5 space-y-2">
      <div className="flex justify-between">
        <label
          htmlFor={data.name}
          className="text-sm font-medium text-gray-900"
        >
          {`${data.label}${getRules(data.rules)}`}
        </label>
      </div>

      <div
        className={`border-2 border-dashed ${
          isInvalid ? "border-red-300" : "border-gray-300"
        } rounded-md h-[200px] flex items-center justify-center cursor-pointer transition-all ${
          isDragging ? "bg-blue-50" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById(data.name).click()}
      >
        <input
          type="file"
          id={data.name}
          hidden
          name={data.name}
          accept="image/png,image/jpeg,image/gif"
          multiple={data.multiple}
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center justify-center pointer-events-none">
          <UploadCloud className="h-10 w-10 text-blue-500 mb-2" />
          <p className="text-sm text-center mb-2">
            Drag and drop files, or{" "}
            <span className="text-blue-500">Browse</span>
          </p>
          {data.support && (
            <p className="text-sm text-gray-400">Supports: {data.support}</p>
          )}
        </div>
      </div>

      {/* Upload Status */}
      <div className="mt-2">
        {uploading ? (
          <span className="animate-spin text-blue-500">⏳ Uploading...</span>
        ) : uploadSuccess ? (
          <span className="text-green-500">✔️ Upload successful</span>
        ) : null}
      </div>

      {/* Description */}
      <div className="flex items-center gap-1.5 mt-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 16 16"
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
        <p className="text-xs text-gray-500"> {data.description}</p>
      </div>

      {/* Error Message */}
      {isInvalid && (
        <p className="text-xs text-red-500 font-medium mt-1">{errorMessage}</p>
      )}

      {/* Uploaded Image Previews */}
      {image.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-4">
          {image.map((item, index) => (
            <div
              key={index}
              className="relative w-[120px] h-[140px] p-1 bg-blue-100 border border-blue-200 rounded-md"
            >
              <img
                src={item.url || "/placeholder.svg"}
                alt={`preview-${index}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(item.id)}
                className="absolute -top-2 -right-2 border-2 border-white bg-blue-500 rounded-full p-1 text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
