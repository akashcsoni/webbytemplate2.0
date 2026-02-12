"use client";

import { strapiGet, strapiPut } from "@/lib/api/strapiClient";
import { Button, Image } from "@heroui/react";
import {
  FormInput,
  FormTextArea,
} from "@/comman/fields";
import { useEffect, useState, useRef } from "react";
import { themeConfig } from "@/config/theamConfig";
import toast from "react-hot-toast";
import { countries, stripDialCode } from "@/lib/data/countries";

const BillingInformationForm = ({ button, userData }) => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [defaultValueData, setDefaultValueData] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [stateSearchTerm, setStateSearchTerm] = useState("");
  const countryRef = useRef(null);
  const stateRef = useRef(null);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  const filteredflag = countries.filter(
    (country) => country.name === selectedCountry
  );

  const filteredStates = selectedCountry
    ? countries
      .find((country) => country.name === selectedCountry)
      ?.states?.filter((state) =>
        state.toLowerCase().includes(stateSearchTerm.toLowerCase())
      ) || []
    : [];

  const toggleCountryDropdown = () => {
    setIsCountryDropdownOpen(!isCountryDropdownOpen);
  };

  const toggleStateDropdown = (e) => {
    e.stopPropagation();
    if (selectedCountry) {
      setIsStateDropdownOpen(!isStateDropdownOpen);
    }
  };

  const handleCountrySelect = (countryName) => {
    setSelectedCountry(countryName);
    setSelectedState("");
    setIsCountryDropdownOpen(false);
    setCountrySearchTerm("");
    // Store billing country/state separately from account country/state
    handleFieldChange("billing_country", countryName);
    handleFieldChange("state", "");
    if (countryName !== "India") {
      handleFieldChange("gstin", "");
    }
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      gstin: "",
    }));
  };

  const handleStateSelect = (stateName, e) => {
    e.stopPropagation();
    setSelectedState(stateName);
    setIsStateDropdownOpen(false);
    setStateSearchTerm("");
    handleFieldChange("state", stateName);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
      if (stateRef.current && !stateRef.current.contains(event.target)) {
        setIsStateDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const billingInformationFields = [
    {
      position: 1,
      name: "billing_email",
      label: "Billing Email Address",
      placeholder: "Enter your billing email address",
      type: "email",
      html: "input",
      description: "Email address for billing and invoices",
      validation: { required: "Billing email is required" },
      rules: ["required"],
      classNames: {
        inputWrapper: "!overflow-hidden",
        input: "!outline-none",
      },
      class: "w-full sm:w-full lg:w-1/2 xl:w-1/2 !p-[5px]",
    },
    {
      position: 2,
      name: "company_name",
      label: "Company Name",
      placeholder: "Enter company name",
      type: "text",
      html: "input",
      description: "Maximum 50 characters; no special symbols",
      validation: { required: "Company name is required" },
      rules: ["required"],
      classNames: {
        inputWrapper: "!overflow-hidden",
        input: "!outline-none",
      },
      // Full-width to avoid awkward empty space on the right.
      class: "w-full !p-[5px]",
    },
    {
      position: 3,
      name: "address",
      label: "Address",
      placeholder: "Write your address...",
      type: "textarea",
      html: "textarea",
      description: "Maximum 300 characters",
      validation: { required: "Address is required" },
      rules: ["required"],
      classNames: {
        inputWrapper: "!overflow-hidden",
        input: "!outline-none",
      },
      class: "w-full !p-[5px]",
    },
    {
      position: 4,
      name: "city",
      label: "City",
      placeholder: "Enter city name",
      type: "text",
      html: "input",
      description: "Maximum 100 characters",
      validation: { required: "City is required" },
      rules: ["required"],
      classNames: {
        inputWrapper: "!overflow-hidden",
        input: "!outline-none",
      },
      class: "w-full sm:w-full lg:w-1/2 xl:w-1/2 !p-[5px]",
    },
    {
      position: 5,
      name: "pincode",
      label: "Zip / Postal Code",
      placeholder: "Enter zip / postal code",
      type: "text",
      html: "input",
      relation: "country",
      classNames: {
        inputWrapper: "!overflow-hidden",
        input: "!outline-none",
      },
      description: "Maximum 10 characters",
      validation: {
        required: "Zip code is required",
        pin_code: "Zip code is invalid",
      },
      rules: ["required", "pin_code"],
      class: "w-full sm:w-full lg:w-1/2 xl:w-1/2 !p-[5px]",
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
        const formData = { ...userData };
        if (userData.gst_number) {
          formData.gstin = userData.gst_number;
        }
        setFormValues(formData);
        setSelectedCountry(userData.billing_country || "");
        setSelectedState(userData.state || "");
      }
    }
  };

  useEffect(() => {
    if (userData) {
      setDefaultValueData(userData);
      const formData = { ...userData };
      if (userData.gst_number) {
        formData.gstin = userData.gst_number;
      }
      setFormValues(formData);
      setSelectedCountry(userData.billing_country || "");
      setSelectedState(userData.state || "");
    } else {
      getUserData();
    }
  }, [userData]);

  const validateBillingFields = (formValues) => {
    let isValid = true;
    const errors = { ...validationErrors };

    if (!formValues.billing_email?.trim()) {
      if (!errors.billing_email) errors.billing_email = [];
      errors.billing_email.push("Billing email is required");
      isValid = false;
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formValues.billing_email)) {
        if (!errors.billing_email) errors.billing_email = [];
        errors.billing_email.push("Please enter a valid billing email address");
        isValid = false;
      } else {
        delete errors.billing_email;
      }
    }

    if (!formValues.company_name?.trim()) {
      if (!errors.company_name) errors.company_name = [];
      errors.company_name.push("Company name is required");
      isValid = false;
    } else {
      delete errors.company_name;
    }

    if (!formValues.address?.trim()) {
      if (!errors.address) errors.address = [];
      errors.address.push("Address is required");
      isValid = false;
    } else {
      delete errors.address;
    }

    if (!formValues.city?.trim()) {
      if (!errors.city) errors.city = [];
      errors.city.push("City is required");
      isValid = false;
    } else {
      delete errors.city;
    }

    if (!formValues.billing_phone_no?.trim()) {
      if (!errors.billing_phone_no) errors.billing_phone_no = [];
      errors.billing_phone_no.push("Billing mobile number is required");
      isValid = false;
    } else if (selectedCountry) {
      const countryObj = countries.find((c) => c.name === selectedCountry);
      if (countryObj) {
        let cleanPhone = stripDialCode(formValues.billing_phone_no);
        cleanPhone = cleanPhone.replace(/\D/g, "");

        if (countryObj.phonePattern) {
          const phoneRegex = new RegExp(countryObj.phonePattern);
          if (!phoneRegex.test(cleanPhone)) {
            if (!errors.billing_phone_no) errors.billing_phone_no = [];
            errors.billing_phone_no.push(
              `Invalid phone number format for ${countryObj.name} Expected format: ${countryObj.phoneLength?.join(" or ") || "10"
              } digits`
            );
            isValid = false;
          } else {
            delete errors.billing_phone_no;
          }
        } else if (countryObj.phoneLength) {
          const validLengths = Array.isArray(countryObj.phoneLength)
            ? countryObj.phoneLength
            : [countryObj.phoneLength];
          if (!validLengths.includes(cleanPhone.length)) {
            if (!errors.billing_phone_no) errors.billing_phone_no = [];
            errors.billing_phone_no.push(
              `Invalid phone number format for ${countryObj.name} Expected format: ${validLengths.join(
                " or "
              )} digits`
            );
            isValid = false;
          } else {
            delete errors.billing_phone_no;
          }
        } else {
          delete errors.billing_phone_no;
        }
      }
    }

    if (!selectedCountry) {
      if (!errors.billing_country) errors.billing_country = [];
      errors.billing_country.push("Country is required");
      isValid = false;
    } else {
      delete errors.billing_country;
    }

    if (!selectedState) {
      if (!errors.state) errors.state = [];
      errors.state.push("State is required");
      isValid = false;
    } else {
      delete errors.state;
    }

    if (!formValues.pincode?.trim()) {
      if (!errors.pincode) errors.pincode = [];
      errors.pincode.push("Zip code is required");
      isValid = false;
    } else {
      const country = countries.find((c) => c.name === selectedCountry);
      const postalRegex =
        country?.postalCodePattern || /^[A-Za-z0-9\s-]{3,10}$/;

      if (!postalRegex.test(formValues.pincode.trim())) {
        if (!errors.pincode) errors.pincode = [];
        errors.pincode.push(`Invalid postal code format for ${selectedCountry}`);
        isValid = false;
      } else {
        delete errors.pincode;
      }
    }

    if (selectedCountry === "India") {
      const raw = String(formValues.gstin || "").trim().toUpperCase();
      if (!raw) {
        if (!errors.gstin) errors.gstin = [];
        errors.gstin.push("GSTIN is required for India");
        isValid = false;
      } else {
        const gstinRegex =
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstinRegex.test(raw)) {
          if (!errors.gstin) errors.gstin = [];
          errors.gstin.push(
            "Invalid GSTIN format. Format: 15 characters (e.g., 27AAAAA0000A1Z5)"
          );
          isValid = false;
        } else {
          delete errors.gstin;
        }
      }
    } else {
      // If not India, GSTIN isn't required; clear any stale errors.
      delete errors.gstin;
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

  const saveBillingInformation = async (event) => {
    event.preventDefault();
    setSaveLoading(true);

    const isValid = validateBillingFields(formValues);
    if (!isValid) {
      setSaveLoading(false);
      return;
    }

    const updatedData = {};
    let hasChanges = false;

    const billingFields = [
      "billing_email",
      "billing_phone_no",
      "company_name",
      "address",
      "city",
      "pincode",
      "gstin",
    ];
    billingFields.forEach((key) => {
      const newValue = formValues[key];
      const compareKey = key === "gstin" ? "gst_number" : key;
      const oldValue = defaultValueData[compareKey];
      if (newValue !== oldValue) {
        updatedData[key] = newValue;
        hasChanges = true;
      }
    });

    if (selectedCountry !== defaultValueData.billing_country) {
      updatedData.billing_country = selectedCountry;
      hasChanges = true;
    }
    if (selectedState !== defaultValueData.state) {
      updatedData.state = selectedState;
      hasChanges = true;
    }

    if (!hasChanges) {
      toast.success("No changes detected in Billing Information.");
      setSaveLoading(false);
      return;
    }

    // Clean + prefix billing phone number with selected country dial code (same as AccountInformationForm)
    if (updatedData.hasOwnProperty("billing_phone_no")) {
      const purePhone = stripDialCode(updatedData.billing_phone_no).replace(/\D/g, "");
      const dial =
        filteredflag?.[0]?.dialCode ||
        countries.find((c) => c.name === selectedCountry)?.dialCode ||
        "";
      updatedData.billing_phone_no = `${dial}${purePhone}`;
    }

    if (updatedData.hasOwnProperty("pincode")) {
      let val = updatedData.pincode;
      if (val === "") {
        updatedData.pincode = null;
      } else {
        updatedData.pincode = String(val).trim();
      }
    }

    if (updatedData.hasOwnProperty("gstin")) {
      updatedData.gst_number = updatedData.gstin;
      delete updatedData.gstin;
    }

    try {
      const updateUserData = await strapiPut(
        `users/${defaultValueData.id}`,
        updatedData,
        themeConfig.TOKEN
      );
      if (updateUserData) {
        toast.success("Billing Information updated successfully!");
        getUserData();
      } else {
        toast.error("Billing Information update failed!");
      }
    } catch (error) {
      console.error("Update error:", error);
      let errorMessage = "Billing Information update failed!";

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
      case "textarea":
        return (
          <FormTextArea
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
      <div className="border border-primary/10 rounded-md overflow-hidden mb-[20px] bg-white">
        <div className="flex items-center justify-between sm:flex-nowrap flex-wrap gap-1.5 w-full border-b border-primary/10 sm:px-5 px-3 py-[6px] bg-white overflow-hidden">
          <p className="text-black">Billing Information</p>
        </div>
        <div className="sm:py-6 py-4 sm:px-5 px-2">
          <div className="flex flex-wrap animate-pulse">
            {/* Row 1 */}
            <div className="w-full lg:w-1/2 xl:w-1/2 !p-[5px]">
              <div className="h-4 w-40 bg-gray-100 rounded mb-2" />
              <div className="h-[46px] bg-gray-100 rounded" />
              <div className="h-3 w-4/5 bg-gray-100 rounded mt-2" />
            </div>
            <div className="w-full lg:w-1/2 xl:w-1/2 !p-[5px]">
              <div className="h-4 w-44 bg-gray-100 rounded mb-2" />
              <div className="h-[46px] bg-gray-100 rounded" />
              <div className="h-3 w-4/5 bg-gray-100 rounded mt-2" />
            </div>

            {/* Company */}
            <div className="w-full !p-[5px]">
              <div className="h-4 w-28 bg-gray-100 rounded mb-2" />
              <div className="h-[46px] bg-gray-100 rounded" />
              <div className="h-3 w-3/5 bg-gray-100 rounded mt-2" />
            </div>

            {/* Address textarea */}
            <div className="w-full !p-[5px]">
              <div className="h-4 w-20 bg-gray-100 rounded mb-2" />
              <div className="h-[96px] bg-gray-100 rounded" />
              <div className="h-3 w-2/3 bg-gray-100 rounded mt-2" />
            </div>

            {/* City + Zip */}
            <div className="w-full lg:w-1/3 xl:w-1/3 !p-[5px]">
              <div className="h-4 w-16 bg-gray-100 rounded mb-2" />
              <div className="h-[46px] bg-gray-100 rounded" />
              <div className="h-3 w-4/5 bg-gray-100 rounded mt-2" />
            </div>
            <div className="w-full lg:w-1/2 xl:w-1/2 !p-[5px]">
              <div className="h-4 w-32 bg-gray-100 rounded mb-2" />
              <div className="h-[46px] bg-gray-100 rounded" />
              <div className="h-3 w-4/5 bg-gray-100 rounded mt-2" />
            </div>

            {/* Country + GSTIN + State */}
            <div className="w-full lg:w-1/3 xl:w-1/3 !p-[5px]">
              <div className="h-4 w-20 bg-gray-100 rounded mb-2" />
              <div className="h-[46px] bg-gray-100 rounded" />
            </div>
            <div className="w-full lg:w-1/3 xl:w-1/3 !p-[5px]">
              <div className="h-4 w-20 bg-gray-100 rounded mb-2" />
              <div className="h-[46px] bg-gray-100 rounded" />
            </div>
            <div className="w-full lg:w-1/2 xl:w-1/2 !p-[5px]">
              <div className="h-4 w-28 bg-gray-100 rounded mb-2" />
              <div className="h-[46px] bg-gray-100 rounded" />
            </div>
          </div>

          {button && (
            <div className="mt-5">
              <div className="btn w-[220px] xl:!py-[11px] py-[10px] h-auto bg-gray-100 border border-gray-100 text-transparent select-none pointer-events-none animate-pulse">
                Save Billing Information
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }



  return (
    <div className="border border-primary/10 rounded-md overflow-hidden mb-[20px] bg-white">
      <div className="flex items-center justify-between sm:flex-nowrap flex-wrap gap-1.5 w-full border-b border-primary/10 sm:px-5 px-3 py-[6px] bg-white overflow-hidden">
        <p className="text-black">Billing Information</p>
      </div>
      <div className="sm:py-6 py-4 sm:px-5 px-2">
        <form onSubmit={saveBillingInformation} className="mb-8">
          <div className="flex flex-wrap">
            {billingInformationFields
              .sort((a, b) => a.position - b.position)
              .map((data, index) => {
                const elements = [];

                elements.push(
                  <div key={`billing-field-${index}`} className={data.class}>
                    {getFields(data)}
                  </div>
                );

                // Billing Mobile Number (same UX + validation approach as AccountInformationForm)
                if (data.position === 1) {
                  elements.push(
                    <div
                      key="billing-phone-field"
                      className="w-full lg:w-1/2 xl:w-1/2 !p-[5px]"
                    >
                      <label className="p2 !text-black block pb-1.5">
                        Billing Mobile Number *
                      </label>
                      <div
                        className={`flex items-center border rounded-[4px] overflow-visible xl:py-[11px] py-[9px] px-2 bg-white ${validationErrors.billing_phone_no
                          ? "border-red-500"
                          : "border-gray-100"
                          }`}
                      >
                        <div className="border-r border-gray-100 pr-[10px] flex items-center justify-center flex-shrink-0">
                          <Image
                            src={
                              filteredflag?.[0]?.flag ||
                              "/placeholder.svg?height=16&width=24"
                            }
                            alt={`${filteredflag?.[0]?.name || "Country"
                              } flag`}
                            width={36}
                            height={20}
                            className="rounded-sm !h-full object-contain flex-shrink-0 w-[30px]"
                          />
                          <span className="text-base text-gray-200 mr-1 mx-2">
                            {filteredflag?.[0]?.dialCode || "+1"}
                          </span>
                        </div>
                        <input
                          type="tel"
                          placeholder="Enter your billing mobile number"
                          value={stripDialCode(formValues.billing_phone_no) || ""}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            handleFieldChange("billing_phone_no", value);
                          }}
                          className="outline-none w-full ml-2 text-gray-200 xl:text-base text-sm"
                          maxLength={15}
                        />
                      </div>
                      {validationErrors.billing_phone_no && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.billing_phone_no}
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
                          Used for billing and invoice-related communication
                        </p>
                      </div>
                    </div>
                  );
                }

                if (data.position === 3) {
                  elements.push(
                    <div
                      key="billing-country-field"
                      className="w-full sm:w-full lg:w-1/2 xl:w-1/2 !p-[5px] relative"
                      ref={countryRef}
                    >
                      <label className="p2 !text-black pb-1.5 block">Country *</label>
                      <div className="relative">
                        <div
                          className={`border p2 ${validationErrors.billing_country ? "border-red-500" : "border-gray-100"} text-gray-300 placeholder:text-gray-300 2xl:py-[11px] xl:py-[13px] md:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full cursor-pointer flex justify-between items-center`}
                          onClick={toggleCountryDropdown}
                        >
                          <div className="relative w-full flex gap-2 items-center justify-start cursor-pointer">
                            {filteredflag?.[0] && (
                              <Image
                                src={filteredflag?.[0]?.flag || "/placeholder.svg?width=30"}
                                alt={`${selectedCountry} flag`}
                                width={30}
                                height={30}
                                className="rounded-sm !drop-shadow-2xl !h-auto sm:w-[30px] w-[20px]"
                              />
                            )}
                            <span className="text-gray-200">
                              {selectedCountry || "Select Country"}
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

                        {isCountryDropdownOpen && (
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

                      {validationErrors.billing_country && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.billing_country}
                        </p>
                      )}
                    </div>
                  );

                  if (selectedCountry === "India") {
                    elements.push(
                      <div
                        key="billing-gstin-field"
                        className="w-full sm:w-full lg:w-1/3 xl:w-1/3 !p-[5px]"
                      >
                        <label className="p2 !text-black block 2xl:mb-0 mb-[4px]">
                          GSTIN *
                        </label>
                        <input
                          type="text"
                          placeholder="Enter GSTIN (e.g., 27AAAAA0000A1Z5)"
                          value={formValues.gstin || ""}
                          onChange={(e) => {
                            const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15);
                            handleFieldChange("gstin", value);
                          }}
                          className={`w-full border p2 ${validationErrors.gstin ? "border-red-500" : "border-gray-100"
                            } text-gray-300 placeholder:text-gray-300 2xl:py-[11px] xl:py-[13px] md:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 outline-none`}
                          maxLength={15}
                        />
                        {validationErrors.gstin && (
                          <p className="text-red-500 text-xs mt-1">
                            {Array.isArray(validationErrors.gstin)
                              ? validationErrors.gstin[0]
                              : validationErrors.gstin}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Format: 15 characters (e.g., 27AAAAA0000A1Z5)
                        </p>
                      </div>
                    );
                  }
                }

                if (data.position === 4) {
                  elements.push(
                    <div
                      key="billing-state-field"
                      className="w-full sm:w-full lg:w-1/2 xl:w-1/2 !p-[5px] relative"
                      ref={stateRef}
                    >
                      <label className="p2 !text-black pb-1.5 block">State/Province *</label>
                      <div className="relative">
                        <div
                          className={`border p2 ${validationErrors.state ? "border-red-500" : "border-gray-100"} !text-gray-300 placeholder:!text-gray-300 2xl:py-[11px] xl:py-[13px] md:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full ${selectedCountry ? "cursor-pointer" : "cursor-not-allowed opacity-50"} flex justify-between items-center`}
                          onClick={(e) => selectedCountry ? toggleStateDropdown(e) : undefined}
                        >
                          <span className="text-gray-200">
                            {selectedState || (selectedCountry ? "Select State/Province" : "Select Country First")}
                          </span>
                          <div className="flex items-center">
                            <svg
                              className={`w-4 h-4 transform transition-transform duration-300 ${isStateDropdownOpen ? "rotate-180" : "rotate-0"}`}
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

                        {isStateDropdownOpen && (
                          <div className="p2 absolute left-0 right-0 mt-1 border border-gray-100 bg-white rounded-b-md shadow-lg z-10 max-h-60 overflow-hidden">
                            <div className="p-2 border-b border-gray-100">
                              <input
                                type="text"
                                placeholder="Search states..."
                                value={stateSearchTerm}
                                onChange={(e) => setStateSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded text-sm outline-none"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <ul className="text-gray-800 max-h-40 overflow-y-auto">
                              {filteredStates.map((state) => (
                                <li
                                  key={state}
                                  onClick={(e) => handleStateSelect(state, e)}
                                  className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                                >
                                  {state}
                                </li>
                              ))}
                              {filteredStates.length === 0 && (
                                <li className="px-4 py-2 text-gray-500">
                                  {selectedCountry ? "No states found for this country" : "Please select a country first"}
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>

                      {validationErrors.state && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.state}
                        </p>
                      )}
                    </div>
                  );
                }

                return elements;
              })}
          </div>
          {button && (
            <Button
              type="submit"
              disabled={saveLoading}
              className="group btn btn-primary flex items-center justify-center gap-[10px] h-auto sm:mt-5 mt-3 ml-auto mr-0"
            >
              Save Billing Information
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
          )}
        </form>
      </div>
    </div>
  );
};

export default BillingInformationForm;
