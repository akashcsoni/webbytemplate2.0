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
import React, { useEffect, useState } from "react";
import { themeConfig } from "@/config/theamConfig";
import toast from "react-hot-toast";

const profileSetting = ({ title, sub_title, form, image, button }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [fromSaveLoading, setFromSaveLoading] = useState(false);
  const [fromSetLoading, setFromSetLoading] = useState(true);
  const [formValues, setFormValues] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [defaultValueData, setDefaultValueData] = useState({});

  const handleImageUpload = async (e) => {
    setImageLoading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("files", file);

    try {
      const fileData = await strapiPost(`upload`, formData, themeConfig.TOKEN);
      setImageId(fileData[0].id);
      setProfileImage(fileData[0].url);
      setImageLoading(false);
    } catch (error) {
      setImageLoading(false);
      if (error.status === 413) {
        setImageLoading(false);
        toast.error(error.response.data.error.message);
      }
    }
  };

  const selectFlag = [
    {
      title: "India",
      documentId: "India",
      url: "https://flagcdn.com/in.svg",
    },
    {
      title: "Argentina",
      documentId: "Argentina",
      url: "https://flagcdn.com/ar.svg",
    },
    {
      title: "Venezuela",
      documentId: "Venezuela",
      url: "https://flagcdn.com/ve.svg",
    },
    {
      title: "Brazil",
      documentId: "Brazil",
      url: "https://flagcdn.com/br.svg",
    },
    {
      title: "Switzerland",
      documentId: "Switzerland",
      url: "https://flagcdn.com/ch.svg",
    },
    {
      title: "Germany",
      documentId: "Germany",
      url: "https://flagcdn.com/de.svg",
    },
    {
      title: "Spain",
      documentId: "Spain",
      url: "https://flagcdn.com/es.svg",
    },
    {
      title: "France",
      documentId: "France",
      url: "https://flagcdn.com/fr.svg",
    },
    {
      title: "Italy",
      documentId: "Italy",
      url: "https://flagcdn.com/it.svg",
    },
    {
      title: "Mexico",
      documentId: "Mexico",
      url: "https://flagcdn.com/mx.svg",
    },
  ];

  const globalValidator = (field) => {
    // Country-specific phone number regex
    const phoneRegexByCountry = {
      India: /^\+91\d{10}$/,
      Argentina: /^\+54\d{10,11}$/,
      Venezuela: /^\+58\d{10}$/,
      Brazil: /^\+55\d{10,11}$/,
      Switzerland: /^\+41\d{9}$/,
      Germany: /^\+49\d{10,11}$/,
      Spain: /^\+34\d{9}$/,
      France: /^\+33\d{9}$/,
      Italy: /^\+39\d{9,10}$/,
      Mexico: /^\+52\d{10}$/,
    };

    const pinCodeRegexByCountry = {
      India: /^\d{6}$/,
      Argentina: /^[A-Z]?\d{4}[A-Z]{0,3}$/, // e.g., "C1425ABC"
      Venezuela: /^\d{4}$/,
      Brazil: /^\d{5}-\d{3}$/, // e.g., "12345-678"
      Switzerland: /^\d{4}$/,
      Germany: /^\d{5}$/,
      Spain: /^\d{5}$/,
      France: /^\d{5}$/,
      Italy: /^\d{5}$/,
      Mexico: /^\d{5}$/,
    };

    const validators = {
      required: () => ({
        validate: (value) => {
          const isEmpty =
            value === undefined ||
            value === null ||
            value === "" ||
            (typeof value === "object" &&
              value !== null &&
              "length" in value &&
              value.length === 0);
          return !isEmpty;
        },
        message: field.validation.required,
      }),

      url: () => ({
        validate: (value) => {
          if (!value) return true;
          const urlRegex =
            /^(https?:\/\/)?([^\s@]+)\.([^\s@]{2,})(\/[^\s@]*)?$/i;
          return urlRegex.test(value);
        },
        message: field.validation.url,
      }),

      phone_no: () => ({
        validate: (value) => {
          if (!value) return true;
          const country = formValues[field.relation] || "India"; // Should be one of the documentIds
          const regex = phoneRegexByCountry[country];
          if (!regex) return false; // Unknown country
          return regex.test(value);
        },
        message: field.validation.phone_no || "Invalid phone number format.",
      }),

      pin_code: () => ({
        validate: (value) => {
          if (!value) return true;
          const country = formValues[field.relation] || "India"; // Should be one of the documentIds
          const regex = pinCodeRegexByCountry[country];
          if (!regex) return false; // Unknown country
          return regex.test(value);
        },
        message: field.validation.pin_code || "Invalid phone number format.",
      }),
    };

    const fieldValidators = {};

    if (field.rules) {
      field.rules.forEach((rule) => {
        if (validators[rule]) {
          fieldValidators[rule] = validators[rule]();
        }
      });
    }

    return fieldValidators;
  };

  const validateFields = () => {
    let isValid = true;
    const errors = {};
    const rules = {};

    // Dynamically create validation rules
    field.forEach((field_data) => {
      rules[field_data.name] = globalValidator(field_data);
    });

    // Iterate through field groups and validate each field
    field.forEach((field_data) => {
      const fieldValue = formValues[field_data.name];

      if (field_data.name in rules) {
        const validators = rules[field_data.name];

        for (const validatorName in validators) {
          const { validate, message } = validators[validatorName];

          if (!validate(fieldValue)) {
            if (!errors[field_data.name]) {
              errors[field_data.name] = [];
            }
            errors[field_data.name].push(message);
            isValid = false;
          }
        }
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const save_user_details = async (event) => {
    event.preventDefault();

    const isValid = validateFields();
    if (!isValid) return;

    const updatedData = {};

    // Track if anything has changed
    let hasChanges = false;

    // Compare and include only changed form values
    Object.keys(formValues).forEach((key) => {
      const newValue = formValues[key];
      const oldValue = defaultValueData[key];

      if (newValue !== oldValue) {
        updatedData[key] = newValue;
        hasChanges = true;
      }
    });

    // Set full_name if first or last name changed
    if (
      formValues.first_name !== defaultValueData.first_name ||
      formValues.last_name !== defaultValueData.last_name
    ) {
      updatedData.full_name =
        `${formValues.first_name} ${formValues.last_name}`.trim();
      hasChanges = true;
    }

    // Check if image changed
    const defaultImageId = defaultValueData.image?.id || null;
    const newImageId = imageId || null;
    if (newImageId !== defaultImageId) {
      updatedData.image = newImageId;
      hasChanges = true;
    }

    // Sanitize numeric fields (convert "" to null, and ensure numbers)
    ["pincode", "phone_no"].forEach((field) => {
      if (updatedData.hasOwnProperty(field)) {
        const val = updatedData[field];
        if (val === "") {
          updatedData[field] = null;
        } else if (!isNaN(val)) {
          updatedData[field] = Number(val);
        }
      }
    });

    if (!hasChanges) {
      toast.info("No changes detected.");
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
        getUserData();
      } else {
        toast.error("User update failed!");
      }
    } catch (error) {
      toast.error("User update failed!");
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
        setProfileImage(
          userData?.image?.url ? userData?.image?.url : "/images/no-image.svg"
        );
        setFromSetLoading(false);
      }
    }
  };

  const getTokenData = async () => {
    try {
      const response = await fetch("/api/auth/session"); // replace with actual API URL
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data; // Do something with the data
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
      readOnly: true,
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
      position: 7,
      name: "country",
      label: "Country",
      placeholder: "Select Country",
      type: "select",
      html: "select",
      options: selectFlag,
      description: "Choose your country",
      validation: { required: "Country is required" },
      rules: [],
      startContent: true,
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
      position: 10,
      name: "state",
      label: "State / Province / Region",
      placeholder: "Enter state / province / region",
      type: "text",
      html: "input",
      description: "Maximum 100 characters",
      validation: { required: "State is required" },
      rules: [],
      class: "w-full sm:w-full md:w-1/3 xl:w-1/3 !p-[5px]",
    },
    {
      position: 11,
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
    {
      position: 12,
      name: "phone_no",
      label: "Phone number",
      placeholder: "Phone number",
      type: "tel",
      html: "input",
      description: "Valid phone number format",
      validation: {
        required: "Phone number is required",
        phone_no: "Phone number is invalid",
      },
      rules: ["phone_no"],
      startContent: true,
      options: selectFlag,
      relation: "country",
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
                              src={profileImage}
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
                              className="1xl:!h-[100px] 1xl:w-[100px] md:w-[90px] md:!h-[90px] sm:w-[85px] sm:!h-[85px] w-20 !h-20 object-cover rounded-full"
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

                  <div className="flex flex-wrap">
                    {field?.map((data, index) => {
                      return (
                        <div className={data?.class} key={index}>
                          {getFields(data)}
                        </div>
                      );
                    })}
                  </div>

                  {/* Submit Button */}
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
