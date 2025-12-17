"use client";

import { strapiGet, strapiPost, strapiPut } from "@/lib/api/strapiClient";
import { Input, Button, Image, Skeleton } from "@heroui/react";
import {
    FormInput,
    FormTextArea,
    FormSingleFile,
    FormSelect,
    FormDropzone,
    FormMultiSelect,
} from "@/comman/fields";
import { useEffect, useState } from "react";
import { themeConfig } from "@/config/theamConfig";
import toast from "react-hot-toast";

const CreateUserProfileForm = ({
    title,
    sub_title,
    form,
    avtar,
    avtar_info,
    avtar_max_length,
    button,
}) => {
    const [profileImage, setProfileImage] = useState(null);
    const [imageId, setImageId] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [fromSaveLoading, setFromSaveLoading] = useState(false);
    const [fromSetLoading, setFromSetLoading] = useState(true);
    const [formValues, setFormValues] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [defaultValueData, setDefaultValueData] = useState({});
    const [hasNewImage, setHasNewImage] = useState(false);
    const [usernameCheck, setUsernameCheck] = useState({
        status: "idle",
        message: "",
    });

    const parsedAvatarMax = Number(avtar_max_length);
    const avatarMaxSizeMb =
        !Number.isNaN(parsedAvatarMax) && parsedAvatarMax > 0 ? parsedAvatarMax : 2;
    const avatarInfoText =
        avtar_info ||
        `We recommend uploading a square JPG image of at least 400 × 400 px (max ${avatarMaxSizeMb} MB).`;
    const showAvatarSection = avtar !== false;
    const defaultButton = { label: "Save changes", link: "submit" };
    const buttonConfig = button === false ? null : { ...defaultButton, ...button };
    const profileDisplayName =
        formValues.profile_name ||
        defaultValueData.profile_name ||
        defaultValueData.username ||
        "";

    const getUsernameStatusClass = () => {
        switch (usernameCheck.status) {
            case "available":
                return "text-green-600";
            case "taken":
            case "error":
                return "text-red-600";
            case "loading":
                return "text-gray-500";
            default:
                return "text-gray-500";
        }
    };

    const handleImageUpload = async (e) => {
        setImageLoading(true);
        const file = e.target.files[0];
        if (file && avatarMaxSizeMb) {
            const maxBytes = avatarMaxSizeMb * 1024 * 1024;
            if (file.size > maxBytes) {
                toast.error(`File size exceeds ${avatarMaxSizeMb}MB limit.`);
                setImageLoading(false);
                return;
            }
        }
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

        if (hasNewImage && imageId !== null) {
            updatedData.image = imageId;
            hasChanges = true;
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

    const validateUsernameFormat = (username) => {
        if (!username) return { isValid: false, message: "" };
        
        // Check length
        if (username.length < 4) {
            return { isValid: false, message: "Username must be at least 4 characters" };
        }
        if (username.length > 15) {
            return { isValid: false, message: "Username must be at most 15 characters" };
        }
        
        // Check pattern: only lowercase a-z and numbers 0-9
        const usernamePattern = /^[a-z0-9]+$/;
        if (!usernamePattern.test(username)) {
            return { isValid: false, message: "Username can only contain lowercase letters (a-z) and numbers (0-9)" };
        }
        
        return { isValid: true, message: "" };
    };

    const handleFieldChange = async (name, value) => {
        // For username, convert to lowercase and filter invalid characters
        if (name === "username") {
            // Convert to lowercase automatically
            value = value.toLowerCase();
            
            // Filter out invalid characters (only allow a-z and 0-9)
            value = value.replace(/[^a-z0-9]/g, '');
            
            // Limit to 15 characters
            if (value.length > 15) {
                value = value.substring(0, 15);
            }
            
            // Clear validation errors - the useEffect will handle validation and API calls
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                [name]: "",
            }));
            
            // Set typing status - useEffect will handle the actual validation
            if (value.length > 0) {
                setUsernameCheck({ status: "typing", message: "" });
            } else {
                setUsernameCheck({ status: "idle", message: "" });
            }
        } else {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                [name]: "",
            }));
        }
        
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
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
            console.log(userData);
            if (userData) {
                const initialFullName =
                    userData.profile_name ||
                    null;
                const mergedUserData = {
                    ...userData,
                    profile_name: initialFullName,
                };
                setDefaultValueData(mergedUserData);
                setFormValues(mergedUserData);
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

    useEffect(() => {
        const username = formValues.username;

        // Reset to idle if no username, same as default, or still loading initial data
        if (
            !username ||
            username === defaultValueData.username ||
            fromSetLoading
        ) {
            setUsernameCheck({ status: "idle", message: "" });
            return;
        }

        // Step 1: Validate format FIRST before making any API call
        const formatValidation = validateUsernameFormat(username);
        
        if (!formatValidation.isValid) {
            // Format is invalid - show validation error and DO NOT call API
            setUsernameCheck({ status: "error", message: formatValidation.message });
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                username: [formatValidation.message],
            }));
            return; // Exit early - no API call
        }

        // Step 2: Format is valid - clear any previous format errors and proceed with API call
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            username: "",
        }));

        // Debounce the API call
        const timer = setTimeout(async () => {
            setUsernameCheck({ status: "loading", message: "Checking availability..." });
            try {
                const res = await fetch("https://studio.webbytemplate.com/api/check-username", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username }),
                });

                if (!res.ok) throw new Error("Request failed");
                const data = await res.json();
                const available =
                    data?.available ?? data?.isAvailable ?? data?.status === "available";

                if (available) {
                    setUsernameCheck({
                        status: "available",
                        message: data?.message || "Username is available.",
                    });
                } else {
                    setUsernameCheck({
                        status: "taken",
                        message: data?.message || "Username is already taken.",
                    });
                }
            } catch (error) {
                setUsernameCheck({
                    status: "error",
                    message: "Could not verify username. Try again.",
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [formValues.username, defaultValueData.username, fromSetLoading]);

    const field = [
        {
            position: 1,
            name: "profile_name",
            label: "Profile Name",
            placeholder: "Enter your profile name",
            type: "text",
            html: "input",
            description: "Your public name shown on the marketplace.",
            validation: { required: "Profile name is required" },
            rules: [],
            class: "w-full sm:w-full md:w-1/2 xl:w-1/2 !p-[5px]",
        },
        {
            position: 2,
            name: "username",
            label: "Username",
            placeholder: "Enter your username",
            type: "text",
            html: "input",
            description:
                "4-15 characters, lowercase letters (a-z) and numbers (0-9) only. Your unique identifier used in your WebbyTemplate profile URL.",
            validation: { required: "Username is required" },
            rules: ["required"],
            class: "w-full sm:w-full md:w-1/2 xl:w-1/2 !p-[5px]",
        },
        {
            position: 3,
            name: "bio",
            label: "Bio",
            placeholder: "Write a brief bio...",
            type: "textarea",
            html: "textarea",
            description:
                "A brief description about you and your work. Optional but recommended.",
            validation: {},
            rules: [],
            class: "w-full !p-[5px]",
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

        if (!formValues.profile_name?.trim()) {
            errors.profile_name = ["Profile name is required"];
            isValid = false;
        }

        if (!formValues.username?.trim()) {
            errors.username = ["Username is required"];
            isValid = false;
        } else {
            // Validate username format
            const formatValidation = validateUsernameFormat(formValues.username);
            if (!formatValidation.isValid) {
                errors.username = [formatValidation.message];
                isValid = false;
            } else if (usernameCheck.status === "taken") {
                errors.username = [usernameCheck.message || "Username is already taken"];
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
                            {fromSetLoading ? (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between sm:flex-row flex-col w-full border-b border-primary/10 pb-[25px] mb-[25px] gap-3">
                                        <div className="flex items-center sm:flex-row flex-col sm:gap-[22px] gap-1.5">
                                            <Skeleton className="1xl:w-[100px] 1xl:h-[100px] md:w-[90px] md:h-[90px] sm:w-[85px] sm:h-[85px] w-20 h-20 rounded-full" />
                                            <div className="space-y-2 sm:text-start text-center">
                                                <Skeleton className="h-5 w-40 rounded" />
                                                <Skeleton className="h-4 w-60 rounded" />
                                            </div>
                                        </div>
                                        <Skeleton className="w-[180px] h-10 rounded" />
                                    </div>

                                    <div className="flex flex-wrap ">
                                        <div className="w-full sm:w-full md:w-1/2 xl:w-1/2 !p-[5px]">
                                            <Skeleton className="h-5 w-24 rounded mb-2" />
                                            <Skeleton className="h-11 w-full rounded" />
                                        </div>
                                        <div className="w-full sm:w-full md:w-1/2 xl:w-1/2 !p-[5px]">
                                            <Skeleton className="h-5 w-24 rounded mb-2" />
                                            <Skeleton className="h-11 w-full rounded" />
                                        </div>
                                        <div className="w-full !p-[5px]">
                                            <Skeleton className="h-5 w-16 rounded mb-2" />
                                            <Skeleton className="h-28 w-full rounded" />
                                        </div>
                                    </div>

                                    <Skeleton className="w-[220px] h-11 rounded" />
                                </div>
                            ) : form && defaultValueData && (
                                <form onSubmit={save_user_details} className="space-y-6">
                                    {showAvatarSection && (
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
                                                    {profileDisplayName && (
                                                        <h3 className="h2 md:mb-[6px] mb-1 sm:text-start text-center">
                                                            {profileDisplayName}
                                                        </h3>
                                                    )}
                                                    <p className="text-sm text-gray-500 sm:text-start text-center">
                                                        {avatarInfoText}
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
                                            .map((data, index) => (
                                                <div key={`field-${index}`} className={data.class}>
                                                    {getFields(data)}
                                                    {data.name === "username" &&
                                                        usernameCheck.status !== "idle" &&
                                                        !validationErrors.username && (
                                                            <p
                                                                className={`text-xs mt-1 ${getUsernameStatusClass()}`}
                                                            >
                                                                {usernameCheck.message}
                                                            </p>
                                                        )}
                                                </div>
                                            ))}
                                    </div>

                                    {buttonConfig && (
                                        <Button
                                            type={buttonConfig.link || "submit"}
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
                                            {buttonConfig.label}
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

export default CreateUserProfileForm;
