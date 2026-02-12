"use client";

import { strapiGet, strapiPut } from "@/lib/api/strapiClient";
import { Button, Image, Tooltip, } from "@heroui/react";
import {
  FormInput,
} from "@/comman/fields";
import { useEffect, useState, useRef } from "react";
import { themeConfig } from "@/config/theamConfig";
import toast from "react-hot-toast";
import { countries, stripDialCode } from "@/lib/data/countries";
import { Listbox } from "@headlessui/react";
import { input } from "@heroui/theme";

const AccountInformationForm = ({ button, userData }) => {

  const [saveLoading, setSaveLoading] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [defaultValueData, setDefaultValueData] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const countryRef = useRef(null);

  const isTrue = (v) => v === true || v === "true" || v === 1 || v === "1";
  const isEmailVerified = isTrue(defaultValueData?.email_verified);
  const isPhoneVerified = isTrue(defaultValueData?.phone_no_verified);
  const authProvider = String(
    defaultValueData?.auth_provider || formValues?.auth_provider || ""
  ).toLowerCase();
  const isGoogleAuth = authProvider === "google";
  // For now, keep email locked for ALL users (until email-change + OTP verify flow is finalized)
  const isEmailLocked = true;

  // Match the original (previously static) "Verified" UI used in the Email field.
  const VerifiedBadge = () => (
    <div className="flex items-center gap-1 text-primary px-2 py-0.5 rounded text-xs font-medium">
      <Tooltip
        content="Verified"
        placement="top"
        showArrow
        classNames={{
          base: "max-w-fit",
          input: "outline-none",
          inputWrapper: "overflow-hidden",
          content:
            "text-[14px] leading-4 bg-white border-blue-300 py-[7px] px-3 text-primary rounded-[5px] border shadow-[0px_2px_25px_0px_#277AC626]",
        }}
      >
        <div className="bg-[#0041A3] p-1 sm:w-[56px] w-10 flex items-center justify-center absolute right-0 h-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="sm:w-6 sm:h-6 w-5.5 h-5.5"
            aria-hidden="true"
          >
            <path
              d="M14.9994 10L10.9994 14L8.99937 12M13.2454 3.45901L14.4664 4.49901C14.7744 4.76101 15.1564 4.91901 15.5584 4.95201L17.1584 5.08001C17.6131 5.11632 18.0401 5.31339 18.3628 5.63589C18.6855 5.95839 18.8828 6.38526 18.9194 6.84001L19.0464 8.44001C19.0794 8.84301 19.2384 9.22601 19.5004 9.53301L20.5404 10.753C20.8368 11.1005 20.9996 11.5423 20.9996 11.999C20.9996 12.4557 20.8368 12.8975 20.5404 13.245L19.5004 14.466C19.2384 14.774 19.0794 15.156 19.0474 15.559L18.9194 17.159C18.8831 17.6138 18.686 18.0408 18.3635 18.3634C18.041 18.6861 17.6141 18.8834 17.1594 18.92L15.5594 19.048C15.1565 19.0799 14.7741 19.2381 14.4664 19.5L13.2454 20.54C12.8979 20.8364 12.4561 20.9992 11.9994 20.9992C11.5426 20.9992 11.1009 20.8364 10.7534 20.54L9.53337 19.5C9.2254 19.2379 8.84253 19.0797 8.43937 19.048L6.83937 18.92C6.38446 18.8834 5.95746 18.686 5.63494 18.3631C5.31241 18.0402 5.11545 17.613 5.07937 17.158L4.95137 15.559C4.91898 15.1564 4.76046 14.7743 4.49837 14.467L3.45837 13.245C3.1625 12.8977 3 12.4563 3 12C3 11.5437 3.1625 11.1024 3.45837 10.755L4.49837 9.53301C4.76137 9.22501 4.91837 8.84301 4.95037 8.44001L5.07837 6.84101C5.11477 6.38577 5.31226 5.95841 5.63538 5.63566C5.9585 5.31291 6.38608 5.1159 6.84137 5.08001L8.43937 4.95301C8.8423 4.92083 9.2248 4.7623 9.53237 4.50001L10.7534 3.46001C11.1009 3.16361 11.5426 3.00079 11.9994 3.00079C12.4561 3.00079 12.8979 3.16261 13.2454 3.45901Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Tooltip>
    </div>
  );

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  const filteredflag = countries.filter(
    (country) => country.name === selectedCountry
  );

  const toggleCountryDropdown = () => {
    setIsCountryDropdownOpen(!isCountryDropdownOpen);
  };

  const handleCountrySelect = (countryName) => {
    setSelectedCountry(countryName);
    setIsCountryDropdownOpen(false);
    setCountrySearchTerm("");
    // handleFieldChange("country", countryName); // No direct field change needed here for non-formValues state? 
    // Actually, we usually want to update formValue or validation. 
    // Let's assume we might need to clear validation errors.
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      country: "",
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const accountInformationFields = [
    {
      position: 1,
      name: "first_name",
      label: "First Name",
      placeholder: "Enter your first name",
      type: "text",
      html: "input",
      description: "Maximum 50 characters. No special symbols.",
      validation: { required: "First name is required" },
      rules: ["required"],
      classNames: {
        inputWrapper: "!overflow-hidden",
        input: "!outline-none",
      },
      class: "w-full lg:w-1/3 xl:w-1/3 !p-[5px]",
    },
    {
      position: 2,
      name: "last_name",
      label: "Last Name",
      placeholder: "Enter your last name",
      type: "text",
      html: "input",
      classNames: {
        inputWrapper: "!overflow-hidden",
        input: "!outline-none",
      },
      description: "Maximum 50 characters. No special symbols.",
      validation: { required: "Last name is required" },
      rules: ["required"],
      class: "w-full lg:w-1/3 xl:w-1/3 !p-[5px]",
    },
    {
      position: 3,
      name: "email",
      label: "Email Address",
      placeholder: "Enter your email address",
      type: "email",
      html: "input",
      readOnly: isEmailLocked,
      classNames: {
        inputWrapper: `!overflow-hidden ${isEmailLocked
            ? "!cursor-not-allowed !bg-gray-50 !shadow-none !ring-0 focus-within:!ring-0 focus-within:!shadow-none focus-within:!border-gray-200"
            : ""
          }`,
        input: `!outline-none ${isEmailLocked ? "!cursor-not-allowed !text-gray-400" : ""
          }`,
      },
      endContent: isEmailVerified ? <VerifiedBadge /> : null,
      description: isGoogleAuth
        ? "Signed in with Google — email cannot be changed."
        : "Email change is temporarily disabled for safety. This email is used for account notifications and support communication.",
      validation: { required: "Email is required" },
      rules: ["required"],
      class: "w-full lg:w-1/3 xl:w-1/3 !p-[5px]",
    },
    {
      position: 4,
      name: "phone_no",
      label: "Mobile Number",
      placeholder: "Enter your mobile number",
      type: "tel",
      html: "input",
      description: "Used for important account and security notifications.",
      validation: {},
      rules: ["required"],
      class: "w-full lg:w-1/2 xl:w-1/2 !p-[5px]",
    },
  ];

  const getTokenData = async () => {
    try {
      const response = await fetch("/api/app-auth/session");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching token data:", error);
    }
  };

  const getUserData = async () => {
    const { authToken } = await getTokenData();
    if (authToken) {
      const userData = await strapiGet(`users/me`, {
        params: { populate: "*" },
        token: authToken,
      });
      if (userData) {
        setDefaultValueData(userData);
        setFormValues(userData);
        setSelectedCountry(userData.country || "");
      }
    }
  };

  useEffect(() => {
    if (userData) {
      setDefaultValueData(userData);
      setFormValues(userData);
      setSelectedCountry(userData.country || "");
    } else {
      getUserData();
    }
  }, [userData]);

  const validateAccountFields = (formValues) => {
    let isValid = true;
    const errors = { ...validationErrors };

    if (!formValues.first_name?.trim()) {
      if (!errors.first_name) errors.first_name = [];
      errors.first_name.push("First name is required");
      isValid = false;
    } else {
      delete errors.first_name;
    }

    if (!formValues.last_name?.trim()) {
      if (!errors.last_name) errors.last_name = [];
      errors.last_name.push("Last name is required");
      isValid = false;
    } else {
      delete errors.last_name;
    }

    if (!formValues.email?.trim()) {
      if (!errors.email) errors.email = [];
      errors.email.push("Email is required");
      isValid = false;
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formValues.email)) {
        if (!errors.email) errors.email = [];
        errors.email.push("Please enter a valid email address");
        isValid = false;
      } else {
        delete errors.email;
      }
    }

    if (!formValues.phone_no?.trim()) {
      if (!errors.phone_no) errors.phone_no = [];
      errors.phone_no.push("Mobile number is required");
      isValid = false;
    } else if (selectedCountry) {
      const countryObj = countries.find((c) => c.name === selectedCountry);
      if (countryObj) {
        let cleanPhone = stripDialCode(formValues.phone_no);
        cleanPhone = cleanPhone.replace(/\D/g, "");

        if (countryObj.phonePattern) {
          const phoneRegex = new RegExp(countryObj.phonePattern);
          if (!phoneRegex.test(cleanPhone)) {
            if (!errors.phone_no) errors.phone_no = [];
            errors.phone_no.push(
              `Invalid phone number format for ${countryObj.name} Expected format: ${countryObj.phoneLength?.join(" or ") || "10"} digits`
            );
            isValid = false;
          } else {
            delete errors.phone_no;
          }
        } else if (countryObj.phoneLength) {
          const validLengths = Array.isArray(countryObj.phoneLength)
            ? countryObj.phoneLength
            : [countryObj.phoneLength];
          if (!validLengths.includes(cleanPhone.length)) {
            if (!errors.phone_no) errors.phone_no = [];
            errors.phone_no.push(
              `Invalid phone number format for ${countryObj.name} Expected format: ${validLengths.join(" or ")} digits`
            );
            isValid = false;
          } else {
            delete errors.phone_no;
          }
        }
      }
    }

    if (!selectedCountry) {
      if (!errors.country) errors.country = [];
      errors.country.push("Country is required");
      isValid = false;
    } else {
      delete errors.country;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleFieldChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const saveAccountInformation = async (event) => {
    event.preventDefault();
    setSaveLoading(true);

    const isValid = validateAccountFields(formValues);
    if (!isValid) {
      setSaveLoading(false);
      return;
    }

    const updatedData = {};
    let hasChanges = false;

    const accountFields = ["first_name", "last_name", "email", "phone_no"];
    accountFields.forEach((key) => {
      const newValue = formValues[key];
      const oldValue = defaultValueData[key];
      if (newValue !== oldValue) {
        updatedData[key] = newValue;
        hasChanges = true;
      }
    });

    if (
      formValues.first_name !== defaultValueData.first_name ||
      formValues.last_name !== defaultValueData.last_name
    ) {
      updatedData.full_name =
        `${formValues.first_name} ${formValues.last_name}`.trim();
      hasChanges = true;
    }

    if (selectedCountry !== defaultValueData.country) {
      updatedData.country = selectedCountry;
      hasChanges = true;
    }

    if (!hasChanges) {
      toast.success("No changes detected in Account Information.");
      setSaveLoading(false);
      return;
    }

    // Clean phone number
    if (updatedData.hasOwnProperty("phone_no")) {
      const purePhone = updatedData.phone_no.replace(/\D/g, "");
      const countryDialCode = filteredflag?.[0]?.dialCode || "";
      updatedData.phone_no = `${countryDialCode}${purePhone}`;
    }

    try {
      const updateUserData = await strapiPut(
        `users/${defaultValueData.id}`,
        updatedData,
        themeConfig.TOKEN
      );
      if (updateUserData) {
        toast.success("Account Information updated successfully!");
        getUserData();
      } else {
        toast.error("Account Information update failed!");
      }
    } catch (error) {
      console.error("Update error:", error);
      let errorMessage = "Account Information update failed!";

      if (error.response) {
        if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setSaveLoading(false);
    }
  };

  const getFields = (data) => {
    const value = defaultValueData[data.name];
    const error = validationErrors[data.name];

    switch (data.html) {
      case "input":
        return (
          <FormInput
            data={data}
            onChange={handleFieldChange}
            error={error}
            defaultValueData={value}
            formValues={formValues}
          />
        );
      default:
        break;
    }
  };

  if (!defaultValueData || Object.keys(defaultValueData).length === 0) {
    return (
      <div className="border border-primary/10 rounded-md overflow-visible mb-[20px] bg-white">
        <div className="flex items-center justify-between sm:flex-nowrap flex-wrap gap-1.5 w-full border-b border-primary/10 sm:px-5 px-3 py-[6px] bg-white overflow-hidden">
          <p className="text-black">Account Information</p>
        </div>
        <div className="sm:py-6 py-4 sm:px-5 px-2">
          <div className="flex flex-wrap animate-pulse">
            {/* Row 1 (3 columns) */}
            <div className="w-full lg:w-1/3 xl:w-1/3 !p-[5px]">
              <div className="h-4 w-24 bg-gray-100 rounded mb-2" />
              <div className="h-[46px] bg-gray-100 rounded" />
              <div className="h-3 w-5/6 bg-gray-100 rounded mt-2" />
            </div>
            <div className="w-full lg:w-1/3 xl:w-1/3 !p-[5px]">
              <div className="h-4 w-24 bg-gray-100 rounded mb-2" />
              <div className="h-[46px] bg-gray-100 rounded" />
              <div className="h-3 w-5/6 bg-gray-100 rounded mt-2" />
            </div>
            <div className="w-full lg:w-1/3 xl:w-1/3 !p-[5px]">
              <div className="h-4 w-32 bg-gray-100 rounded mb-2" />
              <div className="h-[46px] bg-gray-100 rounded" />
              <div className="h-3 w-5/6 bg-gray-100 rounded mt-2" />
            </div>

            {/* Row 2 (2 columns) */}
            <div className="w-full lg:w-1/2 xl:w-1/2 !p-[5px]">
              <div className="h-4 w-20 bg-gray-100 rounded mb-2" />
              <div className="h-[46px] bg-gray-100 rounded" />
              <div className="h-3 w-4/5 bg-gray-100 rounded mt-2" />
            </div>
            <div className="w-full lg:w-1/2 xl:w-1/2 !p-[5px]">
              <div className="h-4 w-28 bg-gray-100 rounded mb-2" />
              <div className="h-[46px] bg-gray-100 rounded" />
              <div className="h-3 w-4/5 bg-gray-100 rounded mt-2" />
            </div>
          </div>

          {/* Note box */}
          <div className="mt-5 border border-blue-300 bg-blue-300 rounded-[5px] py-[6px] px-4">
            <div className="animate-pulse">
              <div className="h-3 w-32 bg-white/60 rounded mb-2" />
              <div className="h-3 w-full bg-white/60 rounded" />
            </div>
          </div>

          {/* Button */}
          {button && (
            <div className="flex justify-end w-full">
              <div className="sm:mt-6 mt-3">
                <div className="btn bg-gray-100 border border-gray-100 text-transparent select-none pointer-events-none animate-pulse">
                  Save and Change
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }



  return (
    <div className="border border-primary/10 rounded-md overflow-visible mb-[20px] bg-white">
      <div className="flex items-center justify-between sm:flex-nowrap flex-wrap gap-1.5 w-full border-b border-primary/10 sm:px-5 px-3 py-[6px] bg-white overflow-hidden">
        <p className="text-black">Account Information</p>
      </div>
      <div className="sm:py-6 py-4 sm:px-5 px-2">
        <form onSubmit={saveAccountInformation}>
          <div className="flex flex-wrap">
            {accountInformationFields
              .sort((a, b) => a.position - b.position)
              .map((data, index) => {
                const elements = [];
                // Render standard fields
                if (data.name !== "phone_no") {
                  elements.push(
                    <div key={`account-field-${index}`} className={data.class}>
                      {getFields(data)}
                    </div>
                  );
                }

                // Inject Country field at position 4 (before Mobile Number which is pos 4 in config, so effectively at start of row 2?)
                // Wait, config: First(1), Last(2), Email(3), Phone(4).
                // We want Country before Phone. So if we are processing index 3 (Phone), or maybe just check position.
                // Actually, if we want Country to be on the second row, first item.
                // First 3 items are w-1/3. So they fill row 1.
                // Next item (Country) needs to be inserted.

                if (data.position === 3) { // After Email (pos 3)
                  elements.push(
                    <div
                      key="account-country-field"
                      className="w-full sm:w-full lg:w-1/2 xl:w-1/2 !p-[5px] relative"
                      ref={countryRef}
                    >
                      <label className="p2 !text-black pb-1.5 block">Country *</label>
                      <div className="relative">
                        <div
                          className={`border xl:text-[16px] text-[12px] ${validationErrors.country ? "border-red-500" : "border-gray-100"} text-gray-300 placeholder:text-gray-300 py-[11px] px-2 rounded-[5px] w-full flex justify-between items-center ${isPhoneVerified ? "cursor-not-allowed opacity-80 bg-gray-50 pointer-events-none" : "cursor-pointer"}`}
                          onClick={isPhoneVerified ? undefined : toggleCountryDropdown}
                        >
                          <div className="relative w-full flex gap-2 items-center justify-start cursor-pointer">
                            {filteredflag?.[0] && (
                              <Image
                                src={filteredflag?.[0]?.flag || "/placeholder.svg?width=30"}
                                alt={`${selectedCountry} flag`}
                                width={30}
                                height={30}
                                className="rounded-sm !drop-shadow-2xl 2xl:!h-[20px] 2xl:w-[30px] !h-[18px] w-5"
                              />
                            )}
                            <span className="text-black font-normal xl:text-base text-sm">
                              {selectedCountry || "Select your country"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <svg
                              className={`w-4 h-4 transform transition-transform duration-300 ${isCountryDropdownOpen ? "rotate-180" : "rotate-0"}`}
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

                        {!isPhoneVerified && isCountryDropdownOpen && (
                          <div className="p2 absolute left-0 right-0 mt-1 border border-gray-100 bg-white rounded-b-md shadow-lg z-10 max-h-60 overflow-hidden">
                            <div className="p-2 border-b border-gray-100">
                              <input
                                type="text"
                                placeholder="Search countries..."
                                value={countrySearchTerm}
                                onChange={(e) => setCountrySearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded text-sm outline-none"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <ul className="text-gray-800 max-h-40 overflow-y-auto">
                              {filteredCountries.map((country) => (
                                <li
                                  key={country.code || country.name}
                                  onClick={() => handleCountrySelect(country.name)}
                                  className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer flex items-center gap-2"
                                >
                                  <Image
                                    src={country.flag || "/placeholder.svg?height=14&width=20"}
                                    alt={`${country.name || "Country"} flag`}
                                    width={20}
                                    height={14}
                                    className="rounded-sm"
                                  />
                                  <span>{country.name || "Unknown Country"}</span>
                                </li>
                              ))}
                              {filteredCountries.length === 0 && (
                                <li className="px-4 py-2 text-gray-500">No countries found</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>

                      {validationErrors.country && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.country}
                        </p>
                      )}
                      <p className="xl:text-sm md:text-[13px] text-xs md:leading-5 leading-[17px] text-gray-200 mt-1 flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="flez-shrink-0"
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
                        This helps us provide better support and regional assistance.
                      </p>
                    </div>
                  );
                }

                if (data.name === "phone_no") {
                  elements.push(
                    <div
                      key={`account-field-${index}`}
                      className="w-full lg:w-1/2 xl:w-1/2 !p-[5px]"
                    >
                      <label className="p2 !text-black block pb-1.5">
                        Mobile Number *
                      </label>
                      <div
                        className={`relative flex items-center border rounded-[4px] overflow-visible xl:py-[11px] py-[9px] px-2 bg-white ${validationErrors.phone_no
                          ? "border-red-500"
                          : "border-gray-100"
                          }`}
                      >
                        <Listbox className="border-r border-gray-100 pr-[10px]">
                          <div className="relative">
                            <Listbox.Button className="relative w-full flex items-center justify-center cursor-pointer flex-shrink-0">
                              <Image
                                src={
                                  filteredflag?.[0]?.flag ||
                                  "/placeholder.svg?height=16&width=24"
                                }
                                alt={`${filteredflag?.[0]?.name || "Country"} flag`}
                                width={36}
                                height={20}
                                className="rounded-sm !h-full object-contain flex-shrink-0 w-[30px]"
                              />
                              <span className="text-base text-gray-200 mr-1 mx-2">
                                {filteredflag?.[0]?.dialCode || "+1"}
                              </span>
                            </Listbox.Button>
                          </div>
                        </Listbox>
                        <input
                          type="tel"
                          placeholder="Enter your mobile number"
                          value={stripDialCode(formValues.phone_no) || ""}
                          onChange={(e) => {
                            if (isPhoneVerified) return;
                            const value = e.target.value.replace(/\D/g, "");
                            handleFieldChange("phone_no", value);
                          }}
                          readOnly={isPhoneVerified}
                          disabled={isPhoneVerified}
                          className={`outline-none w-full ml-2 text-gray-200 xl:text-base text-sm ${isPhoneVerified ? "cursor-not-allowed bg-gray-50" : ""}`}
                          maxLength={15}
                        />
                        {isPhoneVerified ? <VerifiedBadge /> : null}
                      </div>
                      {validationErrors.phone_no && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.phone_no}
                        </p>
                      )}

                      <div className="flex items-center gap-[5px] mt-1">
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
                          Used for important account and security notifications.
                        </p>
                      </div>
                    </div>
                  );
                }

                return elements;
              })}
          </div>

          <div className="bg-blue-300 text-[14px] border border-blue-300 rounded-[5px] py-[6px] px-4 mt-5 flex items-start gap-2">
            <span className="font-bold text-black">Note:</span>
            <span className="text-gray-200">We use your contact details only for account security, support, and important notifications.</span>
          </div>

          {button && (
            <div className="flex justify-end w-full">
              <Button
                type="submit"
                disabled={saveLoading}
                className="group btn btn-primary flex items-center justify-center ml-auto mr-0 gap-[10px] sm:mt-6 mt-3"
              >
                Save and Change
                {saveLoading && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
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
                    <circle
                      cx="37.99038105676658"
                      cy="32.5"
                      r="3"
                      fill="currentColor"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0.2;1"
                        dur="1.2s"
                        begin="0.1s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle
                      cx="32.5"
                      cy="37.99038105676658"
                      r="3"
                      fill="currentColor"
                    >
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
                    <circle
                      cx="12.00961894323342"
                      cy="32.5"
                      r="3"
                      fill="currentColor"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0.2;1"
                        dur="1.2s"
                        begin="0.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle
                      cx="10"
                      cy="25.000000000000004"
                      r="3"
                      fill="currentColor"
                    >
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
                    <circle
                      cx="24.999999999999996"
                      cy="10"
                      r="3"
                      fill="currentColor"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0.2;1"
                        dur="1.2s"
                        begin="0.9s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle
                      cx="32.5"
                      cy="12.009618943233422"
                      r="3"
                      fill="currentColor"
                    >
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
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AccountInformationForm;
