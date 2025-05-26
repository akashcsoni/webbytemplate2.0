"use client";

import React, { useState, useRef, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { Button } from "@heroui/button";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

const countries = [
  { code: "in", flag: "/images/india-flag.png" },
  { code: "us", flag: "/images/india-flag.png" },
  { code: "gb", flag: "/images/india-flag.png" },
];

export default function CheckoutPage() {

  const router = useRouter();

  const { isLoading, cartItems = [], totalPrice = 0 } = useCart() || {}

  const [selected, setSelected] = useState(countries[0]);
  const [isCountry, setIsCountry] = useState(false);
  const [isState, setIsState] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const countryRef = useRef(null);
  const stateRef = useRef(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    state: "",
    country: "",
    phone: "",
    agreed: false,
  });

  const [errors, setErrors] = useState({});

  const toggleCountryDropdown = () => setIsCountry(!isCountry);
  const toggleStateDropdown = () => setIsState(!isState);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setIsCountry(false);
      }
      if (stateRef.current && !stateRef.current.contains(event.target)) {
        setIsState(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!form.company.trim()) newErrors.company = "company name is required.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Valid email is required.";
    if (!form.address.trim()) newErrors.address = "Address is required.";
    if (!form.city.trim()) newErrors.city = "City is required.";
    if (!form.zip.trim()) newErrors.zip = "ZIP code is required.";
    if (!form.state.trim()) newErrors.state = "State is required.";
    if (!form.country.trim()) newErrors.country = "Country is required.";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!form.agreed) newErrors.agreed = "You must agree to the terms.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handlePayNow = () => {
    const newErrors = {};

    if (validateForm()) {
      if (!form.state) {
        newErrors.state = "Please select your state";
      }

      if (!form.country) {
        newErrors.country = "Please select your country";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        alert("Form is valid. Proceeding with payment...");
      }
    }
  };

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setForm((prev) => ({ ...prev, state: state })); // Update form state
    setIsState(false);
    setErrors((prev) => ({ ...prev, state: "" })); // Clear error for state
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setForm((prev) => ({ ...prev, country: country })); // Update form state
    setIsCountry(false);
    setErrors((prev) => ({ ...prev, country: "" })); // Clear error for country
  };

  const inputClass = (name) =>
    `p2 border ${errors[name] ? "border-red-500" : "border-gray-100"} text-gray-300 placeholder:text-gray-300 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full outline-none`;

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // useEffect(() => {
  //   if (cartItems.length == 0) {
  //     router.push('/')
  //   }
  // }, [cartItems, router])

  return (
    <div className="container px-4 py-8">
      {/* Checkout Title */}
      <h1 className="h2 border-b border-primary/10 xl:pb-[30px] pb-4">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-[45px] sm:gap-7 gap-5 sm:mt-[25px] mt-4">
        {/* Billing Details */}
        <div className="lg:col-span-2">
          <h2 className="h3 mb-[6px]">Billing Detail</h2>
          <p className="p2 md:mb-[30px] mb-5">
            Discover the most in-demand top-downloaded items trusted by top
            businesses.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 2xl:gap-y-5 gap-y-4">
            {/* First Name */}
            <div>
              <label className="p2 !text-black mb-[6px]">First name</label>
              <input
                type="text"
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={inputClass("firstName")}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            {/* Last Name */}
            <div>
              <label className="p2 !text-black mb-[6px]">Last name</label>
              <input
                type="text"
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={inputClass("lastName")}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
            {/* Company Name */}
            <div>
              <label className="p2 !text-black mb-[6px]">Company name</label>
              <input
                type="text"
                placeholder="Company Name"
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className={inputClass("company")}
              />
              {errors.company && (
                <p className="text-red-500 text-xs mt-1">{errors.company}</p>
              )}
            </div>
            {/* Email Address */}
            <div>
              <label className="p2 !text-black mb-[6px]">Email</label>
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={inputClass("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            {/* Address */}
            <div>
              <label className="p2 !text-black mb-[6px]">Street address</label>
              <input
                type="text"
                placeholder="Address"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className={inputClass("address")}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>
            {/* City */}
            <div>
              <label className="p2 !text-black mb-[6px]">Town/City</label>
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className={inputClass("city")}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>
            {/* ZIP/Postal Code */}
            <div>
              <label className="p2 !text-black mb-[6px]">Postcode / ZIP</label>
              <input
                type="text"
                placeholder="ZIP/Postal Code"
                value={form.zip}
                onChange={(e) => handleChange("zip", e.target.value)}
                className={inputClass("zip")}
              />
              {errors.zip && (
                <p className="text-red-500 text-xs mt-1">{errors.zip}</p>
              )}
            </div>
            {/* State Dropdown */}
            <div className="relative" ref={stateRef}>
              <label className="p2 !text-black mb-[6px]">State</label>
              <div className="relative">
                <div
                  className={`border p2 ${errors.state ? "border-red-500" : "border-gray-100"} !text-gray-300 placeholder:!text-gray-300 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full cursor-pointer flex justify-between items-center`}
                  onClick={toggleStateDropdown}
                >
                  <span className="text-gray-200">
                    {selectedState || "State"}
                  </span>
                  <div className="flex items-center">
                    <svg
                      className={`w-4 h-4 transform transition-transform duration-300 ${isState ? "rotate-180" : "rotate-0"}`}
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
                {isState && (
                  <div className="absolute left-0 right-0 mt-1 border border-gray-100 bg-white rounded-b-md shadow-lg z-10">
                    <ul className="text-gray-800">
                      {["Gujarat", "Maharashtra", "Kerala"].map((state) => (
                        <li
                          key={state}
                          onClick={() => handleStateSelect(state)} // Use handleStateSelect
                          className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                        >
                          {state}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
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

              {/* Error Message */}
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">{errors.country}</p>
              )}
            </div>
            <div>
              <label className="p2 !text-black block">Phone Number</label>
              <div
                className={`
                     flex items-center border border-gray-100 rounded-md overflow-visible py-[11px] px-2 bg-white
                     ${errors.phone ? "border border-red-500" : "border border-gray-100"}
                   `}
              >
                {/* Custom flag-only dropdown */}
                <Listbox
                  value={selected}
                  onChange={setSelected}
                  className="border-r border-gray-100 pr-[10px]"
                >
                  <div className="relative">
                    <Listbox.Button className="relative w-full flex items-center justify-center cursor-pointer">
                      <Image
                        src={selected.flag}
                        alt="flag"
                        width={24}
                        height={16}
                        className="rounded-sm mr-2"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 9 9"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_1233_287)">
                          <path
                            d="M4.11673 7.15175C4.33218 7.35027 4.66391 7.35027 4.87937 7.15175L8.81858 3.52223C8.93421 3.41568 9 3.26561 9 3.10837V2.78716C9 2.29637 8.4156 2.04078 8.05523 2.37395L4.88007 5.30948C4.66441 5.50886 4.33168 5.50886 4.11602 5.30948L0.940859 2.37395C0.58049 2.04078 -0.00390625 2.29637 -0.00390625 2.78716V3.10837C-0.00390625 3.26561 0.0618803 3.41568 0.177518 3.52223L4.11673 7.15175Z"
                            fill="#808080"
                          />
                        </g>
                      </svg>
                    </Listbox.Button>
                    <Listbox.Options className="absolute mt-3 rounded shadow-xl left-0 z-20 w-[48px] py-1 outline-none !border-gray-100 border">
                      {countries.map((country) => (
                        <Listbox.Option
                          key={country.code}
                          value={country}
                          className="flex items-center justify-center cursor-pointer py-2 hover:bg-gray-100"
                        >
                          <Image
                            src={country.flag}
                            alt="flag"
                            width={20}
                            height={14}
                            className="rounded-sm"
                          />
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>

                {/* Phone number input */}
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="outline-none w-full ml-2 text-gray-200"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <label className="inline-flex items-start gap-2">
              <input
                type="checkbox"
                checked={form.agreed}
                onChange={(e) => handleChange("agreed", e.target.checked)}
                className="mr-2 xl:w-5 xl:h-5 w-4 h-4 border-gray-100"
              />
              <span className="font-medium">
                I agree to the{" "}
                <a href="#" className="text-primary ml-1">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary ml-1">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agreed && (
              <p className="text-red-500 text-xs mt-1">{errors.agreed}</p>
            )}
          </div>

          <Button
            onPress={handlePayNow}
            className="group btn btn-primary flex items-center justify-center gap-[10px] w-[220px] xl:!py-[11px] py-[10px] h-auto sm:mt-7 mt-5"
          >
            Pay Now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="15"
              viewBox="0 0 16 15"
              fill="none"
              className="group-hover:fill-primary group-active:fill-primary group-focus:fill-primary fill-white"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.80057 7.49988L1.48828 2.18928L2.68342 0.994141L9.18747 7.49988L2.68342 14.0056L1.48828 12.8122L6.80057 7.49988ZM11.8647 7.49988L6.55243 2.18928L7.74757 0.994141L14.2516 7.49988L7.74757 14.0056L6.55243 12.8122L11.8647 7.49988Z"
              />
            </svg>
          </Button>
        </div>

        {/* Cart Total */}
        <div className="md:space-y-4 space-y-2 divide-y divide-primary/10">
          <h4>Your Cart Total</h4>
          <div className="text-sm text-gray-700 sm:space-y-4 space-y-2 mt-[18px] mb-[22px] pt-[18px]">
            {
              cartItems?.map((item, index) => {
                return (
                  <div key={index} className="flex justify-between py-1 1xl:gap-20 xl:gap-12 gap-4">
                    <span className="p2">
                      {item?.product?.title}
                    </span>
                    <span className="p2 !text-black !font-medium">${item?.total?.toFixed(2)}</span>
                  </div>
                )
              })
            }
          </div>

          {/* <div className="flex justify-between sm:pt-3 pt-4 sm:pb-0 pb-2">
            <span className="p2">Subtotal</span>
            <span className="p2 !text-black !font-medium">$413.00</span>
          </div> */}

          {/* <div className="xl:pt-[18px] pt-3 sm:pb-0 pb-2">
            <label
              htmlFor="coupon"
              className="block font-medium xl:mb-3 mb-2 p !text-black"
            >
              Enter Coupon Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="coupon"
                className="border border-gray-100 2xl:text-base xl:text-[15px] text-sm placeholder:text-gray-300 rounded-[5px] sm:px-5 px-3 2xl:py-3 xl:py-[11px] py-2.5 w-full"
                placeholder="Coupon code"
              />
              <Button className="btn btn-primary h-auto xl:!px-[31px] lg:!px-5 sm:!px-10">
                Apply
              </Button>
            </div>
          </div> */}

          <div>
            <div className="flex justify-between py-2 font-semibold">
              <p className="font-medium !text-black">Total</p>
              <p className="font-medium !text-black">${totalPrice?.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2 xl:mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M22 3.93994L12 0.439941L2 3.93994V11.9999C2 16.1269 4.534 19.0119 6.896 20.8029C8.32208 21.8734 9.88622 22.7463 11.546 23.3979C11.6593 23.4406 11.7733 23.4813 11.888 23.5199L12 23.5599L12.114 23.5199C12.3327 23.444 12.5494 23.3626 12.764 23.2759C14.3097 22.6391 15.7681 21.8081 17.104 20.8029C19.467 19.0119 22 16.1269 22 11.9999V3.93994ZM11.001 15.4149L6.76 11.1719L8.174 9.75694L11.002 12.5859L16.659 6.92894L18.074 8.34294L11.001 15.4149Z"
                  fill="#0156D5"
                />
              </svg>
              <p className="text-black font-medium">
                10 day money back guarantee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
