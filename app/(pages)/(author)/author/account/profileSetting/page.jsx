"use client";

import { Button, Image } from "@nextui-org/react";
import React, { useState, useRef } from "react";

const flags = [
  { code: "in", flag: "/images/india-flag.png" },
  { code: "us", flag: "/images/india-flag.png" },
  { code: "uk", flag: "/images/india-flag.png" },
];

const profileSetting = () => {
  const [profileImage, setProfileImage] = useState(null);
  const countryRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isCountry, setIsCountry] = useState(false);
  const [isFlags, setIsFlags] = useState(false);
  const [selectedFlags, setSelectedFlags] = useState("");

  // const [selected, setSelected] = useState(countries[0]);

  const toggleCountryDropdown = () => setIsCountry(!isCountry);
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setFormData((prev) => ({ ...prev, country: country }));
    setIsCountry(false);
    setErrors((prev) => ({ ...prev, country: "" }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  // form start
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    bio: "",
    email: "",
    company: "",
    country: "",
    state: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!/^[A-Za-z]+$/.test(formData.firstName)) {
      newErrors.firstName =
        "First name can only contain alphabetic characters.";
    }
    if (!/^[A-Za-z]+$/.test(formData.lastName)) {
      newErrors.lastName = "Last name can only contain alphabetic characters.";
    }
    if (!/^[A-Za-z]+$/.test(formData.userName)) {
      newErrors.userName = "User name can only contain alphabetic characters.";
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Enter a valid email (e.g., user@example.com)";
    }

    if (!formData.state.trim()) {
      newErrors.state = "Please select or enter your state/province/region.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Form is valid!");
    }
  };

  const toggleFlagsDropdown = () => setIsFlags(!isFlags);

  const handleFlagsSelect = (code) => {
    setSelectedFlags(code);
    setFormData((prev) => ({ ...prev, country: code }));
    setIsFlags(false);
    setErrors((prev) => ({ ...prev, country: "" }));
  };

  // form end

  return (
    <div>
      <h1 className="h2 mb-5 mt-[30px]">Profile Settings</h1>
      <div className="bg-gray-50">
        <div className="mx-auto">
          <div className="border border-primary/10 rounded-md overflow-hidden mb-[20px] bg-white">
            <div className="flex items-center justify-between sm:flex-nowrap flex-wrap gap-1.5 w-full border-b border-primary/10 sm:px-5 px-3 py-[6px] bg-white overflow-hidden">
              <p className="text-black">Profile Information</p>
            </div>
            <div className="py-6 px-5">
              {/* Profile Picture */}
              <div className="flex items-center justify-between w-full border-b border-primary/10 pb-[25px] mb-[25px]">
                <div className="flex items-center gap-[22px]">
                  <div className="w-[100px] h-[100px] rounded-full bg-transparent flex items-center justify-center">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        alt="Profile"
                        width={100}
                        height={100}
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      <Image
                        src="/images/no-image.svg"
                        alt="No Profile"
                        width={100}
                        height={100}
                        className="h-full w-full object-cover rounded-full"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="h2 mb-[6px]">Profile Settings</h3>
                    <p className="text-sm text-gray-500">
                      Image upload: 400x400 Min, 2MB Max
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="file"
                    id="fileInput"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                  />
                  <button
                    htmlFor="fileInput"
                    className="btn btn-primary flex items-center justify-center gap-[10px]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_3267_7117)">
                        <path
                          d="M1.38281 10.9412V12.4706C1.38281 12.8762 1.54395 13.2652 1.83077 13.552C2.11759 13.8389 2.5066 14 2.91222 14H12.0887C12.4943 14 12.8833 13.8389 13.1702 13.552C13.457 13.2652 13.6181 12.8762 13.6181 12.4706V10.9412M3.67693 4.82353L7.50046 1M7.50046 1L11.324 4.82353M7.50046 1V10.1765"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                    Upload Image
                  </button>
                </div>
              </div>
              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="p2 !text-black">First Name</label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded px-3 py-[13px] text-sm border outline-none ${
                        errors.firstName ? "border-red-500" : "border-gray-100"
                      }`}
                      placeholder="Enter first name"
                    />
                    <div className="flex items-center gap-[5px] mt-1">
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
                      <p className="text-sm text-gray-200">
                        Maximum 50 characters; no special symbols
                      </p>
                    </div>
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  {/* Last Name */}
                  <div>
                    <label className="p2 !text-black">Last Name</label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded px-3 py-[13px] text-sm border outline-none ${
                        errors.lastName ? "border-red-500" : "border-gray-100"
                      }`}
                      placeholder="Enter last name"
                    />
                    <div className="flex items-center gap-[5px] mt-1">
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
                      <p className="text-sm text-gray-200">
                        Maximum 50 characters; no special symbols
                      </p>
                    </div>
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                  {/* User Name */}
                  <div>
                    <label className="p2 !text-black">User Name</label>
                    <input
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded px-3 py-[13px] text-sm border outline-none ${
                        errors.userName ? "border-red-500" : "border-gray-100"
                      }`}
                      placeholder="Enter user name"
                    />
                    <div className="flex items-center gap-[5px] mt-1">
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
                      <p className="text-sm text-gray-200">
                        Maximum 30 characters; no spaces or special symbols
                      </p>
                    </div>
                    {errors.userName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.userName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="p2 !text-black">About Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Write about bio..."
                    className="w-full border border-primary/10 py-3 px-5 h-[120px] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {/* email*/}
                  <div>
                    <label className="p2 !text-black">Email address</label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded px-3 py-[13px] text-sm border outline-none ${
                        errors.email ? "border-red-500" : "border-gray-100"
                      }`}
                      placeholder="Enter email address"
                    />
                    <div className="flex items-center gap-[5px] mt-1">
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
                      <p className="text-sm text-gray-200">
                        Maximum 50 characters; no special symbols
                      </p>
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  {/* Company Name */}
                  <div>
                    <label className="p2 !text-black">Company Name</label>
                    <input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded px-3 py-[13px] text-sm border outline-none ${
                        errors.company ? "border-red-500" : "border-gray-100"
                      }`}
                      placeholder="Enter company name"
                    />
                    <div className="flex items-center gap-[5px] mt-1">
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
                      <p className="text-sm text-gray-200">
                        Maximum 100 characters
                      </p>
                    </div>
                    {errors.company && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.company}
                      </p>
                    )}
                  </div>
                  {/* Country Dropdown */}
                  <div className="relative" ref={countryRef}>
                    <label className="p2 !text-black mb-[6px]">Country</label>
                    <div className="relative">
                      <div
                        className={`border p2 ${errors.country ? "border-red-500" : "border-gray-100"} text-gray-300 placeholder:text-gray-300 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full cursor-pointer flex justify-between items-center`}
                        onClick={toggleCountryDropdown}
                      >
                        <span className="text-gray-200">
                          {selectedCountry || "Country / Region"}
                        </span>
                        <div className="flex items-center">
                          <svg
                            className={`w-4 h-4 transform transition-transform duration-300 ${isCountry ? "rotate-180" : "rotate-0"}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Dropdown Menu */}
                      {isCountry && (
                        <div className="absolute left-0 right-0 mt-1 border border-gray-100 bg-white rounded-b-md shadow-lg z-10">
                          <ul className="text-gray-800">
                            {["India", "USA", "Canada"].map((country) => (
                              <li
                                key={country}
                                onClick={() => handleCountrySelect(country)}
                                className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                              >
                                {country}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-[5px] mt-1">
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
                      <p className="text-sm text-gray-200">
                        Select from predefined options
                      </p>
                    </div>

                    {/* Error Message */}
                    {errors.country && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="p2 !text-black">Address</label>
                  <textarea
                    type="text"
                    placeholder="Write your address..."
                    className="w-full border border-primary/10 py-3 px-5 h-[120px] focus:outline-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {/* City */}
                  <div>
                    <label className="p2 !text-black">City</label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded px-3 py-[13px] text-sm border outline-none ${
                        errors.city ? "border-red-500" : "border-gray-100"
                      }`}
                      placeholder="Enter city name"
                    />
                    <div className="flex items-center gap-[5px] mt-1">
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
                      <p className="text-sm text-gray-200">
                        Maximum 100 characters
                      </p>
                    </div>
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>

                  {/* State / Province / Region */}
                  <div>
                    <label className="p2 !text-black">
                      State / Province / Region
                    </label>
                    <input
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded px-3 py-[13px] text-sm border outline-none ${
                        errors.state ? "border-red-500" : "border-gray-100"
                      }`}
                      placeholder="Enter state / province / region"
                    />
                    <div className="flex items-center gap-[5px] mt-1">
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
                      <p className="text-sm text-gray-200">
                        Maximum 100 characters
                      </p>
                    </div>
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>
                  {/*Zip / Postal Code */}
                  <div>
                    <label className="p2 !text-black">Zip / Postal Code</label>
                    <input
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded px-3 py-[13px] text-sm border outline-none ${
                        errors.zipCode ? "border-red-500" : "border-gray-100"
                      }`}
                      placeholder="Enter zip / postal code"
                    />
                    <div className="flex items-center gap-[5px] mt-1">
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
                      <p className="text-sm text-gray-200">
                        Maximum 10 characters
                      </p>
                    </div>
                    {errors.zipCode && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.zipCode}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="p2 !text-black block">Phone Number</label>
                    <div
                      className={`mt-1 w-full rounded px-3 text-sm border outline-none flex items-center ${
                        errors.zipCode ? "border-red-500" : "border-gray-100"
                      }`}
                    >
                      {/* Country flag dropdown */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={toggleFlagsDropdown}
                          className="flex items-center  justify-center gap-[7px] pr-[10px] w-max relative border-r border-gray-100"
                        >
                          <img
                            src={
                              selectedFlags
                                ? flags.find((f) => f.code === selectedFlags)
                                    ?.flag
                                : "/images/india-flag.png"
                            }
                            alt="Flag"
                            className="w-[22px] h-[22px] object-cover rounded-full"
                          />

                          {/* Arrow icon */}
                          <svg
                            className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-300 ${
                              isFlags ? "rotate-180" : "rotate-0"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {isFlags && (
                          <ul className="absolute left-0 mt-1 z-10 bg-white border rounded shadow overflow-auto">
                            {flags.map((flag) => (
                              <li
                                key={flag.code}
                                className="px-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center"
                                onClick={() => handleFlagsSelect(flag.code)}
                              >
                                <img
                                  src={flag.flag}
                                  alt={flag.name}
                                  className="w-6 h-6 object-cover rounded-full mr-2"
                                />
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Phone number input */}
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className=" block w-full rounded px-3 py-[13px] text-sm outline-none"
                      />
                    </div>

                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="group btn btn-primary flex items-center justify-center gap-[10px] w-[220px] xl:!py-[11px] py-[10px] h-auto sm:mt-7 mt-5"
                >
                  Upload Product
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default profileSetting;
