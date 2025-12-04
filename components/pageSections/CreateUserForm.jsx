"use client";

import { strapiGet, strapiPost, strapiPut } from "@/lib/api/strapiClient";
import { Input, Button, Image } from "@heroui/react";
import {
  FormInput,
  FormTextArea,
  FormSingleFile,
  FormSelect,
  FormDropzone,
  FormMultiSelect,
} from "@/comman/fields";
import { useEffect, useState, useRef } from "react";
import { themeConfig } from "@/config/theamConfig";
import toast from "react-hot-toast";
import { countries, stripDialCode } from "@/lib/data/countries";
import { Listbox } from "@headlessui/react";

const profileSetting = ({ title, sub_title, form, image, button }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [fromSaveLoading, setFromSaveLoading] = useState(false);
  const [fromSetLoading, setFromSetLoading] = useState(true);
  const [formValues, setFormValues] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [defaultValueData, setDefaultValueData] = useState({});
  const [hasNewImage, setHasNewImage] = useState(false);

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
    setSelectedState(""); // Reset state when country changes
    setIsCountryDropdownOpen(false);
    setCountrySearchTerm("");
    handleFieldChange("country", countryName);
    handleFieldChange("state", ""); // Reset state in form values
    // Clear phone validation error when country changes
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      phone_no: "",
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

  const handleImageUpload = async (e) => {
    setImageLoading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("files", file);

    try {
      const fileData = await strapiPost(`upload`, formData, themeConfig.TOKEN);
      setImageId(fileData[0].id);
      setProfileImage(fileData[0].url);
      setHasNewImage(true);
      setImageLoading(false);
    } catch (error) {
      setImageLoading(false);
      if (error.status === 413) {
        setImageLoading(false);
        toast.error(error.response.data.error.message);
      }
    }
  };

  const save_user_details = async (event) => {
    event.preventDefault();
    setFromSaveLoading(true);

    const isValid = validateFields(formValues); // Use the validateFields function
    if (!isValid) {
      setFromSaveLoading(false);
      return;
    }

    const updatedData = {};
    let hasChanges = false;

    Object.keys(formValues).forEach((key) => {
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

    if (hasNewImage && imageId !== null) {
      updatedData.image = imageId;
      hasChanges = true;
    }
    // ["pincode", "phone_no"].forEach((field) => {
    //   if (updatedData.hasOwnProperty(field)) {
    //     const val = updatedData[field];
    //     updatedData[field] = val === "" ? null : String(val).trim();
    //   }
    // });

    // For pincode and phone_no cleanup
    ["pincode", "phone_no"].forEach((field) => {
      if (updatedData.hasOwnProperty(field)) {
        let val = updatedData[field];

        if (val === "") {
          updatedData[field] = null;
        } else {
          updatedData[field] = String(val).trim();
        }
      }
    });

    // ✅ Ensure phone_no includes country code
    if (updatedData.hasOwnProperty("phone_no")) {
      // clean only digits
      const purePhone = updatedData.phone_no.replace(/\D/g, "");

      const countryDialCode = filteredflag?.[0]?.dialCode || "";

      // final format => +11234567890
      updatedData.phone_no = `${countryDialCode}${purePhone}`;
    }

    if (!hasChanges) {
      toast.success("No changes detected.");
      setFromSaveLoading(false);
      return;
    }

    try {
      const updateUserData = await strapiPut(
        `users/${defaultValueData.id}`,
        updatedData,
        themeConfig.TOKEN
      );
      if (updateUserData) {
        toast.success("User updated successfully!");
        setHasNewImage(false);
        getUserData();
      } else {
        toast.error("User update failed!");
      }
    } catch (error) {
      console.error("Update error:", error);
      // Extract error message from API response
      let errorMessage = "User update failed!";
      
      if (error.response) {
        // Strapi error format: error.response.data.error.message
        if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        } 
        // Alternative format: error.response.data.message
        else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
        // Check for validation errors array
        else if (error.response.data?.error?.details?.errors) {
          const validationErrors = error.response.data.error.details.errors;
          errorMessage = validationErrors.map(err => err.message).join(", ");
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setFromSaveLoading(false);
    }
  };

  const handleFieldChange = async (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const getUserData = async () => {
    setFromSetLoading(true);
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
        setSelectedState(userData.state || "");
        setProfileImage(
          userData?.image?.url ? userData?.image?.url : "/images/no-image.svg"
        );
        setImageId(userData?.image?.id || null);
        setHasNewImage(false);
        setFromSetLoading(false);
      }
    }
  };

  const getTokenData = async () => {
    try {
      const response = await fetch("/api/auth/session");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching token data:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const field = [
    {
      position: 1,
      name: "first_name",
      label: "First Name",
      placeholder: "Enter first name",
      type: "text",
      html: "input",
      description: "Maximum 50 characters; no special symbols",
      validation: { required: "First name is required" },
      rules: [],
      class: "w-full sm:w-full md:w-1/3 xl:w-1/3 !p-[5px]",
    },
    {
      position: 2,
      name: "last_name",
      label: "Last Name",
      placeholder: "Enter last name",
      type: "text",
      html: "input",
      description: "Maximum 50 characters; no special symbols",
      validation: { required: "Last name is required" },
      rules: [],
      class: "w-full sm:w-full md:w-1/3 xl:w-1/3 !p-[5px]",
    },
    {
      position: 3,
      name: "username",
      label: "User Name",
      placeholder: "Enter user name",
      type: "text",
      html: "input",
      readOnly: true,
      description: "Maximum 50 characters; no special symbols",
      validation: { required: "Username is required" },
      rules: ["required"],
      class: "w-full sm:w-full md:w-1/3 xl:w-1/3 !p-[5px]",
    },
    {
      position: 4,
      name: "bio",
      label: "About Bio",
      placeholder: "Write about bio...",
      type: "textarea",
      html: "textarea",
      description: "Maximum 500 characters; no links or special symbols",
      validation: { required: "Bio is required" },
      rules: [],
      class: "w-full !p-[5px]",
    },
    {
      position: 5,
      name: "email",
      label: "Email address",
      placeholder: "Enter email address",
      type: "email",
      html: "input",
      readOnly: false,
      description: "Valid email format required",
      validation: { required: "Email is required" },
      rules: ["required"],
      class: "w-full sm:w-full md:w-1/3 xl:w-1/3 !p-[5px]",
    },
    {
      position: 6,
      name: "company_name",
      label: "Company Name",
      placeholder: "Enter company name",
      type: "text",
      html: "input",
      description: "Maximum 50 characters; no special symbols",
      validation: { required: "Company name is required" },
      rules: [],
      class: "w-full sm:w-full md:w-1/3 xl:w-1/3 !p-[5px]",
    },
    {
      position: 8,
      name: "address",
      label: "Address",
      placeholder: "Write your address...",
      type: "textarea",
      html: "textarea",
      description: "Maximum 300 characters",
      validation: { required: "Address is required" },
      rules: [],
      class: "w-full !p-[5px]",
    },
    {
      position: 9,
      name: "city",
      label: "City",
      placeholder: "Enter city name",
      type: "text",
      html: "input",
      description: "Maximum 100 characters",
      validation: { required: "City is required" },
      rules: [],
      class: "w-full sm:w-full md:w-1/3 xl:w-1/3 !p-[5px]",
    },
    {
      position: 12,
      name: "pincode",
      label: "Zip / Postal Code",
      placeholder: "Enter zip / postal code",
      type: "text",
      html: "input",
      relation: "country",
      description: "Maximum 10 characters",
      validation: {
        required: "Zip code is required",
        pin_code: "Zip code is invalid",
      },
      rules: ["pin_code"],
      class: "w-full sm:w-full md:w-1/3 xl:w-1/3 !p-[5px]",
    },
  ];

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
      case "upload":
        return (
          <FormSingleFile
            data={data}
            onChange={handleFieldChange}
            error={error}
            defaultValueData={value}
            formValues={formValues}
          />
        );
      case "multiselect":
        return (
          <FormMultiSelect
            users={data.options}
            data={data}
            onChange={handleFieldChange}
            error={error}
            defaultValueData={value}
            formValues={formValues}
          />
        );
      case "select":
        return (
          <FormSelect
            data={data}
            onChange={handleFieldChange}
            error={error}
            defaultValueData={value}
            formValues={formValues}
          />
        );
      case "dropzone":
        return (
          <FormDropzone
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

  const validateFields = (formValues) => {
    let isValid = true;
    const errors = {};

    if (!formValues.first_name?.trim()) {
      if (!errors.first_name) errors.first_name = [];
      errors.first_name.push("First name is required");
      isValid = false;
    }

    // Lastname
    if (!formValues.last_name?.trim()) {
      if (!errors.last_name) errors.last_name = [];
      errors.last_name.push("Last name is required");
      isValid = false;
    }

    // Email
    if (!formValues.email?.trim()) {
      if (!errors.email) errors.email = [];
      errors.email.push("Email is required");
      isValid = false;
    }

    // Phone
    if (!formValues.phone_no?.trim()) {
      if (!errors.phone_no) errors.phone_no = [];
      errors.phone_no.push("Phone number is required");
      isValid = false;
    } else if (selectedCountry) {
      const countryObj =
        typeof selectedCountry === "string"
          ? countries.find((c) => c.name === selectedCountry)
          : selectedCountry;

      if (countryObj) {
        // Strip any dial code (from any country) and clean the phone number for validation
        // This handles cases where country is changed but phone still has old dial code
        let cleanPhone = stripDialCode(formValues.phone_no);
        // Remove any remaining non-digit characters (spaces, dashes, etc.)
        cleanPhone = cleanPhone.replace(/\D/g, "");

        if (countryObj.phonePattern) {
          const phoneRegex = new RegExp(countryObj.phonePattern);
          if (!phoneRegex.test(cleanPhone)) {
            if (!errors.phone_no) errors.phone_no = [];
            errors.phone_no.push(
              `Invalid phone number format for ${countryObj.name} Expected format: ${countryObj.phoneLength?.join(" or ") || "10"} digits`
            );
            isValid = false;
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
          }
        }
      }
    }

    // Country required
    if (!selectedCountry) {
      if (!errors.country) errors.country = [];
      errors.country.push("Country is required");
      isValid = false;
    }

    // State required
    if (!selectedState) {
      if (!errors.state) errors.state = [];
      errors.state.push("State is required");
      isValid = false;
    }

    // Postal / Zip validation
    if (formValues.pincode?.trim()) {
      const country = countries.find((c) => c.name === selectedCountry);
      const postalRegex =
        country?.postalCodePattern || /^[A-Za-z0-9\s-]{3,10}$/;

      if (!postalRegex.test(formValues.pincode.trim())) {
        if (!errors.pincode) errors.pincode = [];
        errors.pincode.push(
          `Invalid postal code format for ${selectedCountry}`
        );
        isValid = false;
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  return (
    <div>
      {title && <h1 className="h2 mb-5 mt-[30px]">{title}</h1>}
      <div className="bg-gray-50">
        <div className="mx-auto">
          <div className="border border-primary/10 rounded-md overflow-hidden mb-[20px] bg-white">
            {sub_title && (
              <div className="flex items-center justify-between sm:flex-nowrap flex-wrap gap-1.5 w-full border-b border-primary/10 sm:px-5 px-3 py-[6px] bg-white overflow-hidden">
                <p className="text-black">{sub_title}</p>
              </div>
            )}
            <div className="sm:py-6 py-4 sm:px-5 px-4">
              {form && defaultValueData && (
                <form onSubmit={save_user_details} className="space-y-6">
                  {image && (
                    <div className="flex items-center justify-between sm:flex-row flex-col w-full border-b border-primary/10 pb-[25px] mb-[25px] gap-3">
                      <div className="flex items-center sm:flex-row flex-col sm:gap-[22px] gap-1.5">
                        <div className="1xl:w-[100px] 1xl:h-[100px] md:w-[90px] md:h-[90px] sm:w-[85px] sm:h-[85px] w-20 h-20 flex-shrink-0 rounded-full bg-transparent flex items-center justify-center profile-picture">
                          {profileImage !== null &&
                          profileImage !== undefined &&
                          profileImage !== "" ? (
                            <Image
                              src={profileImage || "/placeholder.svg"}
                              alt="Profile"
                              width={100}
                              height={100}
                              className="1xl:!h-[100px] 1xl:w-[100px] md:w-[90px] md!:h-[90px] sm:w-[85px] sm:!h-[85px] w-20 1h-20 object-cover rounded-full"
                            />
                          ) : (
                            <Image
                              src="/images/no-image.svg"
                              alt="No Profile"
                              width={100}
                              height={100}
                              className="1xl:!h-[100px] 1xl:w-[100px] md:w-[90px] md!:h-[90px] sm:w-[85px] sm:!h-[85px] w-20 !h-20 object-cover rounded-full"
                            />
                          )}
                        </div>
                        <div>
                          {defaultValueData?.first_name &&
                            defaultValueData?.last_name && (
                              <h3 className="h2 md:mb-[6px] mb-1 sm:text-start text-center">
                                {defaultValueData?.first_name +
                                  " " +
                                  defaultValueData?.last_name}
                              </h3>
                            )}
                          <p className="text-sm text-gray-500 sm:text-start text-center">
                            Image upload: 400x400 Min, 2MB Max
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <Input
                          type="file"
                          id="fileInput"
                          accept="image/png,image/jpeg,image/jpg"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleImageUpload}
                        />

                        <Button
                          disabled={imageLoading}
                          onPress={(e) => {
                            document.getElementById("fileInput").click();
                          }}
                          htmlFor="fileInput"
                          className="btn btn-primary flex items-center justify-center gap-[10px]"
                        >
                          {imageLoading ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
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
                          ) : (
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
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                            </svg>
                          )}
                          Upload Image
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap ">
                    {field
                      .sort((a, b) => a.position - b.position)
                      .map((data, index) => {
                        const elements = [];

                        // Add the regular field
                        elements.push(
                          <div key={`field-${index}`} className={data.class}>
                            {getFields(data)}
                          </div>
                        );

                        // Add phone number after company name (position 6)
                        if (data.position === 9) {
                          elements.push(
                            <div
                              key="phone-field"
                              className="w-full sm:w-full md:w-1/3 xl:w-1/3 !p-[5px]"
                            >
                              <label className="p2 !text-black block pb-1">
                                Phone Number *
                              </label>
                              <div
                                className={`flex items-center border rounded-md overflow-visible py-[11px] px-2 bg-white ${
                                  validationErrors.phone_no
                                    ? "border-red-500"
                                    : "border-gray-100"
                                }`}
                              >
                                <Listbox className="border-r border-gray-100 pr-[10px]">
                                  <div className="relative">
                                    <Listbox.Button className="relative w-full flex items-center justify-center cursor-pointer">
                                      <Image
                                        src={
                                          filteredflag?.[0]?.flag ||
                                          "/placeholder.svg?height=16&width=24"
                                        }
                                        alt={`${filteredflag?.[0]?.name || "Country"} flag`}
                                        width={24}
                                        height={16}
                                        className="rounded-sm mr-2"
                                      />

                                      <span className="text-xs text-gray-600 mr-1 m-2">
                                        {filteredflag?.[0]?.dialCode || "+1"}
                                      </span>
                                    </Listbox.Button>
                                  </div>
                                </Listbox>

                                <input
                                  type="tel"
                                  placeholder="Phone Number"
                                  value={
                                    stripDialCode(formValues.phone_no) || ""
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    handleFieldChange("phone_no", value);
                                  }}
                                  className="outline-none w-full ml-2 text-gray-200"
                                  maxLength={15}
                                />
                              </div>
                              {validationErrors.phone_no && (
                                <p className="text-red-500 text-xs mt-1">
                                  {validationErrors.phone_no}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                Expected format:{" "}
                                {filteredflag?.[0]?.phoneLength?.join(" or ") ||
                                  "10-15"}{" "}
                                digits
                              </p>
                            </div>
                          );
                        }

                        // Add country after city (position 9)
                        if (data.position === 6) {
                          elements.push(
                            <div
                              key="country-field"
                              className="w-full sm:w-full md:w-1/3 xl:w-1/3 !p-[5px] relative"
                              ref={countryRef}
                            >
                              <label className="p2 !text-black mb-[6px]">
                                Country *
                              </label>
                              <div className="relative">
                                <div
                                  className={`border p2 ${validationErrors.country ? "border-red-500" : "border-gray-100"} text-gray-300 placeholder:text-gray-300 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full cursor-pointer flex justify-between items-center`}
                                  onClick={toggleCountryDropdown}
                                >
                                  <div className="relative w-full flex gap-2 items-center justify-start cursor-pointer">
                                    {filteredflag?.[0] && (
                                      <Image
                                        src={
                                          filteredflag?.[0]?.flag ||
                                          "/placeholder.svg?width=30"
                                        }
                                        alt={`${selectedCountry} flag`}
                                        width={30}
                                        height={30}
                                        className="rounded-sm !drop-shadow-2xl !h-auto"
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
                                        onChange={(e) =>
                                          setCountrySearchTerm(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-200 rounded text-sm outline-none"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </div>
                                    <ul className="text-gray-800 max-h-40 overflow-y-auto">
                                      {filteredCountries.map((country) => (
                                        <li
                                          key={country.code || country.name}
                                          onClick={() =>
                                            handleCountrySelect(country.name)
                                          }
                                          className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer flex items-center gap-2"
                                        >
                                          <Image
                                            src={
                                              country.flag ||
                                              "/placeholder.svg?height=14&width=20"
                                            }
                                            alt={`${country.name || "Country"} flag`}
                                            width={20}
                                            height={14}
                                            className="rounded-sm"
                                          />
                                          <span>
                                            {country.name || "Unknown Country"}
                                          </span>
                                        </li>
                                      ))}
                                      {filteredCountries.length === 0 && (
                                        <li className="px-4 py-2 text-gray-500">
                                          No countries found
                                        </li>
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
                            </div>
                          );
                        }

                        // Add state after country (position 9, but after country field)
                        if (data.position === 9) {
                          elements.push(
                            <div
                              key="state-field"
                              className="w-full sm:w-full md:w-1/3 xl:w-1/3 !p-[5px] relative"
                              ref={stateRef}
                            >
                              <label className="p2 !text-black pb-1">
                                State/Province *
                              </label>
                              <div className="relative">
                                <div
                                  className={`border p2 ${validationErrors.state ? "border-red-500" : "border-gray-100"} !text-gray-300 placeholder:!text-gray-300 2xl:py-[13px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full ${selectedCountry ? "cursor-pointer" : "cursor-not-allowed opacity-50"} flex justify-between items-center`}
                                  onClick={(e) =>
                                    selectedCountry
                                      ? toggleStateDropdown(e)
                                      : undefined
                                  }
                                >
                                  <span className="text-gray-200">
                                    {selectedState ||
                                      (selectedCountry
                                        ? "Select State/Province"
                                        : "Select Country First")}
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
                                        onChange={(e) =>
                                          setStateSearchTerm(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-200 rounded text-sm outline-none"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </div>
                                    <ul className="text-gray-800 max-h-40 overflow-y-auto">
                                      {filteredStates.map((state, index) => (
                                        <li
                                          key={state}
                                          onClick={(e) =>
                                            handleStateSelect(state, e)
                                          }
                                          onKeyDown={(e) => {
                                            if (
                                              e.key === "Enter" ||
                                              e.key === " "
                                            ) {
                                              e.preventDefault();
                                              handleStateSelect(state, e);
                                            }
                                          }}
                                          tabIndex={0}
                                          className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer focus:bg-primary focus:text-white outline-none"
                                        >
                                          {state}
                                        </li>
                                      ))}
                                      {filteredStates.length === 0 && (
                                        <li className="px-4 py-2 text-gray-500">
                                          {selectedCountry
                                            ? "No states found for this country"
                                            : "Please select a country first"}
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
                      type={button.link}
                      disabled={fromSaveLoading}
                      className="group btn btn-primary flex items-center justify-center gap-[10px] w-[220px] xl:!py-[11px] py-[10px] h-auto sm:mt-5 mt-3"
                    >
                      {fromSaveLoading && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
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
                      {button.label}
                    </Button>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default profileSetting;
