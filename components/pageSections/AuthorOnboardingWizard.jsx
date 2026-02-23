"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { strapiGet, strapiPost, strapiPut } from "@/lib/api/strapiClient";
import { Button, Image, Input, Textarea, Tooltip, Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import {
    FormInput,
    FormTextArea,
} from "@/comman/fields";
import { themeConfig } from "@/config/theamConfig";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import { countries, stripDialCode } from "@/lib/data/countries";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageLoader from "@/app/(pages)/(author)/user/loading";

const AuthorOnboardingWizard = () => {
    const { authUser, authToken, login } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [requestedStepFromUrl, setRequestedStepFromUrl] = useState(null); // number | null
    const [onboardingProgress, setOnboardingProgress] = useState({
        step1Done: false,
        step2Done: false,
        payoutDone: false,
        payoutSkipped: false,
        maxAllowedStep: 1,
    });
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [selectedCountry, setSelectedCountry] = useState("");
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [countrySearchTerm, setCountrySearchTerm] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [imageId, setImageId] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [hasNewImage, setHasNewImage] = useState(false);
    const [fromSetLoading, setFromSetLoading] = useState(true);
    const [initialUsername, setInitialUsername] = useState("");

    // Step 1 (agreement)
    const [agreedToPolicies, setAgreedToPolicies] = useState(false);

    // Step 2 (email/mobile verification - user must verify the contact they did NOT register with)
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [otpSentType, setOtpSentType] = useState(null); // "email" | "phone" | null
    const [otpCode, setOtpCode] = useState("");
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    // OTP modal (same as login/register)
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [otpModalType, setOtpModalType] = useState(null); // "email" | "mobile" | null
    const [otpModalCodeValues, setOtpModalCodeValues] = useState(["", "", "", "", "", ""]);
    const [otpModalResendCooldown, setOtpModalResendCooldown] = useState(0);
    const [otpModalError, setOtpModalError] = useState("");
    const [otpModalSubmitting, setOtpModalSubmitting] = useState(false);
    const otpModalFirstInputRef = useRef(null);
    const hasAutoSubmittedOtpRef = useRef(false);
    const lastSubmittedOtpCodeRef = useRef("");

    // Step 3 (payout)
    const [payoutMethod, setPayoutMethod] = useState(""); // "paypal" | "bank" | ""
    const [openPayoutPanel, setOpenPayoutPanel] = useState(""); // "paypal" | "bank" | ""

    const [usernameCheck, setUsernameCheck] = useState({
        status: "idle",
        message: "",
    });

    const filteredflag = countries.filter(
        (country) => country.name === selectedCountry
    );

    const filteredCountries = countries.filter((country) =>
        country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())
    );

    // Step 2: Email-registered/Google users must verify mobile. Mobile-registered users must verify email.
    const needsPhoneVerification = Boolean(formData?.email_verified || formData?.confirmed || formData?.auth_provider === "google") && !formData?.phone_no_verified;
    const needsEmailVerification = Boolean(formData?.phone_no_verified) && !(formData?.email_verified || formData?.confirmed);

    const TOTAL_STEPS = 3;

    const steps = [
        {
            id: 1,
            title: "Set up your author profile",
            mandatory: true,
        },
        {
            id: 2,
            title: "Confirm your account details",
            mandatory: true,
        },
        {
            id: 3,
            title: "Set up your payout details",
            mandatory: false,
        },
    ];

    // Profile fields for Step 1
    const profileFields = [
        {
            position: 1,
            name: "profile_name",
            label: "Profile Name",
            placeholder: "Enter your public display name",
            type: "text",
            html: "input",
            description: "Your public name shown on the marketplace.",
            validation: { required: "Profile name is required" },
            rules: ["required"],
            class: "w-full lg:w-1/2 lg:px-3",
        },
        {
            position: 2,
            name: "username",
            label: "Username",
            placeholder: "yourname",
            type: "text",
            html: "input",
            description: "4-15 characters, lowercase letters (a-z) and numbers (0-9) only.",
            validation: { required: "Username is required" },
            rules: ["required"],
            class: "w-full lg:w-1/2 lg:px-3",
        },
        {
            position: 3,
            name: "bio",
            label: "Bio",
            placeholder: "Write a brief bio about yourself and your work…",
            type: "textarea",
            html: "textarea",
            description: "A short description about you and your expertise. Optional, but highly recommended.",
            validation: {},
            rules: [],
            class: "w-full",
        },
    ];

    // Account fields for Step 2
    const accountFields = [
        {
            position: 1,
            name: "first_name",
            label: "First Name",
            placeholder: "Enter your first name",
            type: "text",
            html: "input",
            description: "Maximum 50 characters; no special symbols",
            validation: { required: "First name is required" },
            rules: [],
            class: "w-full sm:w-full md:w-1/2 xl:w-1/2 !p-[5px]",
        },
        {
            position: 2,
            name: "last_name",
            label: "Last Name",
            placeholder: "Enter your last name",
            type: "text",
            html: "input",
            description: "Maximum 50 characters; no special symbols",
            validation: { required: "Last name is required" },
            rules: [],
            class: "w-full sm:w-full md:w-1/2 xl:w-1/2 !p-[5px]",
        },
    ];

    // Payout (Step 3) fields - stored directly on the user for now (backend must support these fields)
    const payoutFields = {
        paypal_email: {
            name: "paypal_email",
            label: "PayPal Email Address",
            placeholder: "paypal@example.com",
        },
        bank_name: {
            name: "bank_name",
            label: "Bank Name",
            placeholder: "Enter bank name",
        },
        bank_account_holder_name: {
            name: "bank_account_holder_name",
            label: "Account Holder Name",
            placeholder: "Enter account holder name",
        },
        bank_account_number: {
            name: "bank_account_number",
            label: "Account Number",
            placeholder: "Enter account number",
        },
        bank_ifsc_code: {
            name: "bank_ifsc_code",
            label: "IFSC / SWIFT Code",
            placeholder: "Enter IFSC / SWIFT code",
        },
        bank_country: {
            name: "bank_country",
            label: "Bank Country",
            placeholder: "Select country",
        },
    };

    const clampStep = (step) => {
        const n = Number(step);
        if (!Number.isFinite(n)) return null;
        const asInt = Math.floor(n);
        if (asInt < 1) return 1;
        if (asInt > TOTAL_STEPS + 1) return TOTAL_STEPS + 1;
        return asInt;
    };

    const getStepFromUrl = () => {
        if (typeof window === "undefined") return null;
        const params = new URLSearchParams(window.location.search);
        return clampStep(params.get("step"));
    };

    const syncStepToUrl = (step) => {
        if (typeof window === "undefined") return;
        const url = new URL(window.location.href);
        url.searchParams.set("step", String(step));
        window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    };

    const computeOnboardingProgressFromUser = (userData) => {
        // If you add these fields in Strapi, they become the source of truth:
        // - author_onboarding_step: 1..4
        // - author_onboarding_completed_at: datetime | null
        const onboardingStepRaw = userData?.author_onboarding_step;
        const onboardingStep = Number.isFinite(Number(onboardingStepRaw))
            ? Math.floor(Number(onboardingStepRaw))
            : null;
        const hasCompletedAt = Boolean(userData?.author_onboarding_completed_at);

        const isStep4DoneByBackend = hasCompletedAt || (onboardingStep != null && onboardingStep >= 4);

        // Step 1 is considered "done" when profile + username are present (agreed_to_author_policies is frontend-only).
        const step1Done =
            Boolean(userData?.profile_name?.trim?.()) &&
            Boolean(userData?.username?.trim?.()) &&
            Boolean(userData?.image);

        // If backend already marked the user as author, they've completed Step 2 previously.
        const step2Done = Boolean(userData?.author);

        // If payout data exists, consider wizard completed (Step 4).
        const payoutDone =
            Boolean(userData?.payout_details_completed) ||
            Boolean(userData?.paypal_email) ||
            Boolean(userData?.bank_name) ||
            Boolean(userData?.bank_account_holder_name) ||
            Boolean(userData?.bank_account_number) ||
            Boolean(userData?.bank_ifsc_code) ||
            Boolean(userData?.bank_country);

        // If backend says onboarding is complete (step 4) but payout fields are empty,
        // that means payout was intentionally skipped.
        const payoutSkipped = Boolean(isStep4DoneByBackend && !payoutDone);

        // maxAllowedStep is the furthest step the user can visit/resume at.
        // - If step1 not done -> 1
        // - If step1 done but not author -> 2
        // - If author but payout not done -> 3
        // - If payout done -> 4
        let maxAllowedStep = 1;
        // Prefer backend onboarding step if present
        if (onboardingStep != null) {
            maxAllowedStep = clampStep(onboardingStep) ?? 1;
        } else {
            if (step1Done) maxAllowedStep = 2;
            if (step1Done && step2Done) maxAllowedStep = payoutDone ? 4 : 3;
        }

        // If backend completion is set, always allow Step 4 (even if payout isn't filled).
        if (isStep4DoneByBackend) maxAllowedStep = 4;

        // If backend step exists, treat step completion as "at least reached" even if a field is empty
        // (helps avoid false negatives due to partial data).
        const effectiveStep1Done = step1Done || (onboardingStep != null && onboardingStep >= 2) || isStep4DoneByBackend;
        const effectiveStep2Done = step2Done || (onboardingStep != null && onboardingStep >= 3) || isStep4DoneByBackend;

        return {
            step1Done: effectiveStep1Done,
            step2Done: effectiveStep2Done,
            payoutDone,
            payoutSkipped,
            maxAllowedStep,
        };
    };

    const setStepAndSync = (nextStep) => {
        const clamped = clampStep(nextStep);
        if (!clamped) return;
        setCurrentStep(clamped);
        syncStepToUrl(clamped);
    };

    useEffect(() => {
        // Initialize from URL (supports back/forward too)
        const initial = getStepFromUrl();
        if (initial != null) {
            setRequestedStepFromUrl(initial);
            setCurrentStep(initial);
        }

        const onPopState = () => {
            const step = getStepFromUrl();
            if (step != null) setCurrentStep(step);
        };
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getUserData();
    }, []);

    useEffect(() => {
        const username = formData.username;
        if (!username || username === authUser?.username || !username.trim()) {
            setUsernameCheck({ status: "idle", message: "" });
            return;
        }

        const formatValidation = validateUsernameFormat(username);
        if (!formatValidation.isValid) {
            setUsernameCheck({ status: "error", message: formatValidation.message });
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                username: [formatValidation.message],
            }));
            return;
        }

        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            username: "",
        }));

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
                const available = data?.available ?? data?.isAvailable ?? data?.status === "available";

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
    }, [formData.username, authUser?.username]);

    const getUserData = async () => {
        try {
            const response = await fetch("/api/app-auth/session");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            if (data.authToken) {
                const userData = await strapiGet(`users/me`, {
                    params: { populate: "*" },
                    token: data.authToken,
                });
                if (userData) {
                    let mergedData = {
                        ...userData,
                        profile_name: userData.profile_name || "",
                        username: userData.username || "",
                        bio: userData.bio || "",
                        first_name: userData.first_name || "",
                        last_name: userData.last_name || "",
                        email: userData.email || "",
                        phone_no: userData.phone_no || "",
                        country: userData.country || "",
                        payout_method: userData.payout_method || "",
                        paypal_email: userData.paypal_email || "",
                        bank_name: userData.bank_name || "",
                        bank_account_holder_name: userData.bank_account_holder_name || "",
                        bank_account_number: userData.bank_account_number || "",
                        bank_ifsc_code: userData.bank_ifsc_code || userData.bank_ifsc_code || "",
                        bank_country: userData.bank_country || "",
                    };
                    let restoredCountry = "";
                    try {
                        const saved = sessionStorage.getItem("author_onboarding_preserve_form");
                        if (saved) {
                            const parsed = JSON.parse(saved);
                            sessionStorage.removeItem("author_onboarding_preserve_form");
                            restoredCountry = (parsed.country != null && parsed.country !== "") ? String(parsed.country) : "";
                            mergedData = {
                                ...mergedData,
                                first_name: (parsed.first_name != null && parsed.first_name !== "") ? parsed.first_name : mergedData.first_name,
                                last_name: (parsed.last_name != null && parsed.last_name !== "") ? parsed.last_name : mergedData.last_name,
                                email: (parsed.email != null && parsed.email !== "") ? parsed.email : mergedData.email,
                                phone_no: (parsed.phone_no != null && parsed.phone_no !== "") ? parsed.phone_no : mergedData.phone_no,
                                country: restoredCountry || mergedData.country || "",
                            };
                        }
                    } catch (_) { /* ignore */ }
                    setFormData(mergedData);
                    setInitialUsername(userData.username || "");
                    setSelectedCountry(restoredCountry || mergedData.country || userData.country || "");
                    setProfileImage(userData?.image?.url ? userData.image.url : "/images/no-image.svg");
                    setImageId(userData?.image?.id || null);
                    setAgreedToPolicies(Boolean(userData?.agreed_to_author_policies));
                    setIsEditingEmail(false);
                    setPayoutMethod(userData.payout_method || "");
                    setOpenPayoutPanel(userData.payout_method || "");
                    setEmailVerified(Boolean(userData?.email_verified || userData?.confirmed));
                    setPhoneVerified(Boolean(userData?.phone_no_verified));

                    // Auto-resume step based on saved data (but also respect URL if present, without allowing skipping ahead).
                    const progress = computeOnboardingProgressFromUser(userData);
                    setOnboardingProgress(progress);
                    const desired =
                        requestedStepFromUrl != null
                            ? Math.min(requestedStepFromUrl, progress.maxAllowedStep)
                            : progress.maxAllowedStep;
                    setStepAndSync(desired);
                    setFromSetLoading(false);
                } else {
                    tryRestorePreservedForm();
                    setFromSetLoading(false);
                }
            } else {
                tryRestorePreservedForm();
                setFromSetLoading(false);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            tryRestorePreservedForm();
            setFromSetLoading(false);
        }
    };

    const tryRestorePreservedForm = () => {
        try {
            const saved = sessionStorage.getItem("author_onboarding_preserve_form");
            if (saved) {
                const parsed = JSON.parse(saved);
                sessionStorage.removeItem("author_onboarding_preserve_form");
                const restored = {
                    first_name: parsed.first_name ?? "",
                    last_name: parsed.last_name ?? "",
                    email: parsed.email ?? "",
                    phone_no: parsed.phone_no ?? "",
                    country: parsed.country ?? "",
                };
                setFormData((prev) => ({ ...prev, ...restored }));
                if (parsed.country != null && parsed.country !== "") {
                    setSelectedCountry(String(parsed.country));
                }
            }
        } catch (_) { /* ignore */ }
    };

    const validateUsernameFormat = (username) => {
        if (!username) return { isValid: false, message: "" };

        if (username.length < 4) {
            return { isValid: false, message: "Username must be at least 4 characters" };
        }
        if (username.length > 15) {
            return { isValid: false, message: "Username must be at most 15 characters" };
        }

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

        if (name === "first_name" || name === "last_name" || name === "profile_name") {
            value = value.substring(0, 50);
        }
        if (name === "bio") {
            value = value.substring(0, 300);
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSendOtpAddContact = async (type) => {
        const token = authToken || themeConfig.TOKEN;
        if (type === "email") {
            const email = formData.email?.trim();
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setValidationErrors((p) => ({ ...p, email: ["Please enter a valid email address"] }));
                return;
            }
            setOtpLoading(true);
            try {
                await strapiPost("auth/add-contact-send-otp", { email, type: "email" }, token);
                setOtpSentType("email");
                setOtpCode("");
                setValidationErrors((p) => ({ ...p, email_otp: "" }));
                setResendCooldown(30);
                toast.success("OTP sent to your email.");
                setOtpModalCodeValues(["", "", "", "", "", ""]);
                setOtpModalType("email");
                setOtpModalResendCooldown(60);
                setOtpModalOpen(true);
            } catch (e) {
                const msg = e?.response?.data?.error?.message || e?.message || "Failed to send OTP";
                toast.error(msg);
            } finally {
                setOtpLoading(false);
            }
        } else {
            const purePhone = stripDialCode(formData.phone_no || "").replace(/\D/g, "");
            const dialCode = filteredflag?.[0]?.dialCode || "";
            const fullPhone = dialCode ? `${dialCode}${purePhone}` : formData.phone_no || "";
            if (!fullPhone || fullPhone.length < 10) {
                setValidationErrors((p) => ({ ...p, phone_no: ["Please enter a valid mobile number"] }));
                return;
            }
            setOtpLoading(true);
            try {
                await strapiPost("auth/add-contact-send-otp", { mobile: fullPhone, type: "mobile" }, token);
                setOtpSentType("phone");
                setOtpCode("");
                setValidationErrors((p) => ({ ...p, phone_otp: "" }));
                setResendCooldown(30);
                toast.success("OTP sent to your mobile.");
                setOtpModalCodeValues(["", "", "", "", "", ""]);
                setOtpModalType("mobile");
                setOtpModalResendCooldown(60);
                setOtpModalOpen(true);
            } catch (e) {
                const msg = e?.response?.data?.error?.message || e?.message || "Failed to send OTP";
                toast.error(msg);
            } finally {
                setOtpLoading(false);
            }
        }
    };

    const handleVerifyAddContact = async (type) => {
        const code = otpCode?.trim();
        if (!code || code.length !== 6) {
            const key = type === "email" ? "email_otp" : "phone_otp";
            setValidationErrors((p) => ({ ...p, [key]: ["Please enter the 6-digit OTP"] }));
            return;
        }
        setOtpLoading(true);
        try {
            const identifier = type === "email" ? formData.email?.trim() : (() => {
                const purePhone = stripDialCode(formData.phone_no || "").replace(/\D/g, "");
                const dialCode = filteredflag?.[0]?.dialCode || "";
                return dialCode ? `${dialCode}${purePhone}` : formData.phone_no || "";
            })();
            const payload = type === "email" ? { email: identifier, type: "email", otp: code } : { mobile: identifier, type: "mobile", otp: code };
            const res = await strapiPost("auth/verify-add-contact", payload);
            if (type === "email") {
                setEmailVerified(true);
                setOtpSentType(null);
                setOtpCode("");
                setValidationErrors((p) => ({ ...p, email_otp: "" }));
            } else {
                setPhoneVerified(true);
                setOtpSentType(null);
                setOtpCode("");
                setValidationErrors((p) => ({ ...p, phone_otp: "" }));
            }
            if (res?.jwt) {
                await fetch("/api/app-auth/login?token=" + encodeURIComponent(res.jwt) + "&user=" + encodeURIComponent(JSON.stringify(res.user)));
                login();
            }
            toast.success("Contact verified successfully.");
        } catch (e) {
            const key = type === "email" ? "email_otp" : "phone_otp";
            const msg = e?.response?.data?.error?.message || e?.message || "Invalid code. Please try again.";
            setValidationErrors((p) => ({ ...p, [key]: [msg] }));
        } finally {
            setOtpLoading(false);
        }
    };

    // OTP modal: verify using 6-digit code from modal
    const getOtpModalIdentifier = () => {
        if (otpModalType === "email") return formData.email?.trim() || "";
        const purePhone = stripDialCode(formData.phone_no || "").replace(/\D/g, "");
        const dialCode = filteredflag?.[0]?.dialCode || "";
        return dialCode ? `${dialCode}${purePhone}` : formData.phone_no || "";
    };

    const handleVerifyOtpModal = async () => {
        const code = otpModalCodeValues.join("").trim();
        if (!code || code.length !== 6) {
            setOtpModalError("Please enter the complete 6-digit code");
            return;
        }
        setOtpModalError("");
        setOtpModalSubmitting(true);
        try {
            const identifier = getOtpModalIdentifier();
            const payload = otpModalType === "email"
                ? { email: identifier, type: "email", otp: code }
                : { mobile: identifier, type: "mobile", otp: code };
            const res = await strapiPost("auth/verify-add-contact", payload);
            if (otpModalType === "email") {
                setEmailVerified(true);
                setOtpSentType(null);
                setOtpCode("");
                setValidationErrors((p) => ({ ...p, email_otp: "" }));
            } else {
                setPhoneVerified(true);
                setOtpSentType(null);
                setOtpCode("");
                setValidationErrors((p) => ({ ...p, phone_otp: "" }));
            }
            if (res?.jwt) {
                try {
                    const savedForm = { ...formData, country: formData.country || selectedCountry };
                    sessionStorage.setItem("author_onboarding_preserve_form", JSON.stringify(savedForm));
                } catch (_) { /* ignore */ }
                await fetch("/api/app-auth/login?token=" + encodeURIComponent(res.jwt) + "&user=" + encodeURIComponent(JSON.stringify(res.user)));
                login();
                setFormData((prev) => {
                    const fromServer = res?.user || {};
                    const merged = {
                        ...prev,
                        ...fromServer,
                        profile_name: fromServer.profile_name ?? prev.profile_name ?? "",
                        username: fromServer.username ?? prev.username ?? "",
                        bio: fromServer.bio ?? prev.bio ?? "",
                        first_name: (fromServer.first_name != null && fromServer.first_name !== "") ? fromServer.first_name : (prev.first_name ?? ""),
                        last_name: (fromServer.last_name != null && fromServer.last_name !== "") ? fromServer.last_name : (prev.last_name ?? ""),
                        email: fromServer.email ?? prev.email ?? "",
                        phone_no: fromServer.phone_no ?? prev.phone_no ?? "",
                        country: (fromServer.country != null && fromServer.country !== "") ? fromServer.country : (prev.country ?? ""),
                        email_verified: fromServer.email_verified ?? prev.email_verified,
                        confirmed: fromServer.confirmed ?? prev.confirmed,
                        phone_no_verified: fromServer.phone_no_verified ?? prev.phone_no_verified,
                        payout_method: fromServer.payout_method ?? prev.payout_method ?? "",
                        paypal_email: fromServer.paypal_email ?? prev.paypal_email ?? "",
                        bank_name: fromServer.bank_name ?? prev.bank_name ?? "",
                        bank_account_holder_name: fromServer.bank_account_holder_name ?? prev.bank_account_holder_name ?? "",
                        bank_account_number: fromServer.bank_account_number ?? prev.bank_account_number ?? "",
                        bank_ifsc_code: fromServer.bank_ifsc_code ?? prev.bank_ifsc_code ?? "",
                        bank_country: fromServer.bank_country ?? prev.bank_country ?? "",
                    };
                    return merged;
                });
                const fromServer = res?.user || {};
                const keepCountry = (fromServer.country != null && fromServer.country !== "") ? fromServer.country : formData.country || selectedCountry;
                if (keepCountry) setSelectedCountry(keepCountry);
            }
            toast.success("Contact verified successfully.");
            setOtpModalOpen(false);
            setOtpModalType(null);
            setOtpModalCodeValues(["", "", "", "", "", ""]);
        } catch (e) {
            setOtpModalError(e?.response?.data?.error?.message || e?.message || "Invalid code. Please try again.");
            hasAutoSubmittedOtpRef.current = false;
            lastSubmittedOtpCodeRef.current = code;
        } finally {
            setOtpModalSubmitting(false);
        }
    };

    const handleOtpModalResend = async () => {
        if (otpModalResendCooldown > 0) return;
        const token = authToken || themeConfig.TOKEN;
        const type = otpModalType;
        if (type === "email") {
            const email = formData.email?.trim();
            if (!email) return;
            try {
                await strapiPost("auth/add-contact-send-otp", { email, type: "email" }, token);
                setOtpModalCodeValues(["", "", "", "", "", ""]);
                setOtpModalError("");
                setOtpModalResendCooldown(60);
                hasAutoSubmittedOtpRef.current = false;
                lastSubmittedOtpCodeRef.current = "";
                toast.success("OTP sent to your email.");
                setTimeout(() => otpModalFirstInputRef.current?.focus(), 100);
            } catch (e) {
                setOtpModalError(e?.response?.data?.error?.message || e?.message || "Failed to resend.");
            }
        } else {
            const purePhone = stripDialCode(formData.phone_no || "").replace(/\D/g, "");
            const dialCode = filteredflag?.[0]?.dialCode || "";
            const fullPhone = dialCode ? `${dialCode}${purePhone}` : formData.phone_no || "";
            if (!fullPhone) return;
            try {
                await strapiPost("auth/add-contact-send-otp", { mobile: fullPhone, type: "mobile" }, token);
                setOtpModalCodeValues(["", "", "", "", "", ""]);
                setOtpModalError("");
                setOtpModalResendCooldown(60);
                hasAutoSubmittedOtpRef.current = false;
                lastSubmittedOtpCodeRef.current = "";
                toast.success("OTP sent to your mobile.");
                setTimeout(() => otpModalFirstInputRef.current?.focus(), 100);
            } catch (e) {
                setOtpModalError(e?.response?.data?.error?.message || e?.message || "Failed to resend.");
            }
        }
    };

    useEffect(() => {
        if (otpModalOpen && otpModalFirstInputRef.current) {
            setTimeout(() => otpModalFirstInputRef.current?.focus(), 100);
        }
        if (otpModalOpen) {
            hasAutoSubmittedOtpRef.current = false;
            lastSubmittedOtpCodeRef.current = "";
        }
    }, [otpModalOpen]);

    // Auto-submit OTP when all 6 digits filled (same as login/register CodeModal)
    useEffect(() => {
        const isComplete = otpModalCodeValues.every((val) => val && /^\d$/.test(val));
        const allFilled = otpModalCodeValues.length === 6 && isComplete;
        const currentCode = otpModalCodeValues.join("");

        if (otpModalCodeValues.every((val) => !val)) {
            hasAutoSubmittedOtpRef.current = false;
            lastSubmittedOtpCodeRef.current = "";
            return;
        }

        if (
            allFilled &&
            !otpModalSubmitting &&
            !hasAutoSubmittedOtpRef.current &&
            currentCode !== lastSubmittedOtpCodeRef.current
        ) {
            hasAutoSubmittedOtpRef.current = true;
            lastSubmittedOtpCodeRef.current = currentCode;
            setTimeout(() => {
                const codeString = otpModalCodeValues.join("");
                if (codeString.length === 6 && otpModalCodeValues.every((val) => val && /^\d$/.test(val))) {
                    handleVerifyOtpModal();
                } else {
                    hasAutoSubmittedOtpRef.current = false;
                    lastSubmittedOtpCodeRef.current = "";
                }
            }, 100);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otpModalCodeValues, otpModalSubmitting]);

    useEffect(() => {
        if (otpModalResendCooldown <= 0) return;
        const t = setInterval(() => setOtpModalResendCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000);
        return () => clearInterval(t);
    }, [otpModalResendCooldown]);

    const maskOtpIdentifier = (identifier) => {
        if (!identifier) return "";
        if (identifier.includes("@")) {
            const [user, domain] = identifier.split("@");
            const mask = user.length > 2 ? user.slice(0, 2) + "*".repeat(user.length - 2) : user;
            return `${mask}@${domain}`;
        }
        const clean = identifier.replace(/\D/g, "");
        if (clean.length > 4) return clean.slice(0, 2) + "*".repeat(clean.length - 4) + clean.slice(-2);
        return identifier;
    };

    const handleOtpModalCodeChange = (index, value) => {
        if (value && !/^\d$/.test(value)) return;
        const next = [...otpModalCodeValues];
        next[index] = value;
        setOtpModalCodeValues(next);
        if (otpModalError) setOtpModalError("");
        const newCode = next.join("");
        if (newCode !== lastSubmittedOtpCodeRef.current) {
            hasAutoSubmittedOtpRef.current = false;
        }
        if (value && index < 5) {
            const el = document.querySelector(`input[name=onboarding-otp-${index + 1}]`);
            if (el) el.focus();
        }
    };

    const handleOtpModalKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otpModalCodeValues[index] && index > 0) {
            const el = document.querySelector(`input[name=onboarding-otp-${index - 1}]`);
            if (el) el.focus();
        }
        if (e.key === "Enter") handleVerifyOtpModal();
    };

    const handleOtpModalPaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain").trim().replace(/\D/g, "").slice(0, 6);
        const next = [...otpModalCodeValues];
        for (let i = 0; i < 6; i++) next[i] = text[i] || "";
        setOtpModalCodeValues(next);
        hasAutoSubmittedOtpRef.current = false;
        lastSubmittedOtpCodeRef.current = "";
        const idx = text.length >= 6 ? 5 : text.length;
        const el = document.querySelector(`input[name=onboarding-otp-${idx}]`);
        if (el) el.focus();
    };

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [resendCooldown]);

    // Debounced username check
    const debouncedUsernameCheck = useCallback(
        debounce(async (username) => {
            if (!username || username.length < 4) {
                setUsernameCheck({ status: "idle", message: "" });
                return;
            }

            setUsernameCheck({ status: "checking", message: "Checking availability..." });

            try {
                // Use the authenticated user's ID for the check
                const res = await strapiPost(`users/${authUser?.id}/check-username`, { username }, themeConfig.TOKEN);
                if (res.available) {
                    setUsernameCheck({ status: "available", message: "Username is available" });
                } else {
                    setUsernameCheck({ status: "taken", message: "Username is already taken" });
                }
            } catch (error) {
                setUsernameCheck({ status: "error", message: "Unable to check username availability" });
            }
        }, 500),
        [authUser?.id]
    );

    // Handle username validation and API calls
    useEffect(() => {
        const username = formData.username;

        // Reset to idle if no username, still loading initial data, or username hasn't changed from initial value
        if (!username || fromSetLoading || username === initialUsername) {
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

        // Step 2: Format is valid, clear any previous format errors and make API call
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            username: "",
        }));

        // Trigger the debounced API call
        debouncedUsernameCheck(username);
    }, [formData.username, fromSetLoading, debouncedUsernameCheck]);

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
        const avatarMaxSizeMb = 2; // Same as CreateUserProfileForm default
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
            } else {
                toast.error("Image upload failed. Please try again.");
            }
        }
    };

    const validateStep = (step) => {
        let isValid = true;
        const errors = {};

        if (step === 1) {
            // Validate profile fields
            if (!formData.profile_name?.trim()) {
                errors.profile_name = ["Profile name is required"];
                isValid = false;
            } else {
                if (formData.profile_name.trim().length > 50) {
                    errors.profile_name = ["Profile name must be at most 50 characters"];
                    isValid = false;
                } else if (!/^[A-Za-z0-9\s]+$/.test(formData.profile_name.trim())) {
                    errors.profile_name = ["Profile name can only contain letters, numbers and spaces"];
                    isValid = false;
                }
            }

            if (!formData.username?.trim()) {
                errors.username = ["Username is required"];
                isValid = false;
            } else {
                const formatValidation = validateUsernameFormat(formData.username);
                if (!formatValidation.isValid) {
                    errors.username = [formatValidation.message];
                    isValid = false;
                } else if (usernameCheck.status === "taken") {
                    errors.username = [usernameCheck.message || "Username is already taken"];
                    isValid = false;
                }
            }

            // Profile image is now required
            if (!profileImage || profileImage === "/images/no-image.svg") {
                errors.profile_image = ["Profile image is required"];
                isValid = false;
            }

            if (formData.bio?.trim() && formData.bio.trim().length > 300) {
                errors.bio = ["Bio must be at most 300 characters"];
                isValid = false;
            }

            if (!agreedToPolicies) {
                errors.agreed_to_author_policies = ["You must agree to the Terms & Conditions, Privacy Policy, and Author Policy"];
                isValid = false;
            }
        } else if (step === 2) {
            // Validate account fields
            if (!formData.first_name?.trim()) {
                errors.first_name = ["First name is required"];
                isValid = false;
            } else {
                if (formData.first_name.trim().length > 50) {
                    errors.first_name = ["First name must be at most 50 characters"];
                    isValid = false;
                } else if (!/^[A-Za-z\s]+$/.test(formData.first_name.trim())) {
                    errors.first_name = ["First name cannot contain special symbols"];
                    isValid = false;
                }
            }

            if (!formData.last_name?.trim()) {
                errors.last_name = ["Last name is required"];
                isValid = false;
            } else {
                if (formData.last_name.trim().length > 50) {
                    errors.last_name = ["Last name must be at most 50 characters"];
                    isValid = false;
                } else if (!/^[A-Za-z\s]+$/.test(formData.last_name.trim())) {
                    errors.last_name = ["Last name cannot contain special symbols"];
                    isValid = false;
                }
            }

            if (!formData.email?.trim()) {
                errors.email = ["Email is required"];
                isValid = false;
            } else {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(formData.email)) {
                    errors.email = ["Please enter a valid email address"];
                    isValid = false;
                }
            }

            if (!selectedCountry) {
                errors.country = ["Country is required"];
                isValid = false;
            }

            if (!formData.phone_no?.trim()) {
                errors.phone_no = ["Mobile number is required"];
                isValid = false;
            } else {
                const countryObj = countries.find((c) => c.name === selectedCountry);
                if (countryObj) {
                    let cleanPhone = stripDialCode(formData.phone_no);
                    cleanPhone = cleanPhone.replace(/\D/g, "");

                    if (countryObj.phonePattern) {
                        const phoneRegex = new RegExp(countryObj.phonePattern);
                        if (!phoneRegex.test(cleanPhone)) {
                            errors.phone_no = [`Invalid phone number format for ${countryObj.name}`];
                            isValid = false;
                        }
                    } else if (countryObj.phoneLength) {
                        const validLengths = Array.isArray(countryObj.phoneLength)
                            ? countryObj.phoneLength
                            : [countryObj.phoneLength];
                        if (!validLengths.includes(cleanPhone.length)) {
                            errors.phone_no = [`Invalid phone number format for ${countryObj.name}`];
                            isValid = false;
                        }
                    }
                }
            }

            if (needsPhoneVerification && !phoneVerified) {
                errors.phone_otp = ["Mobile number must be verified with OTP before continuing"];
                isValid = false;
            }
            if (needsEmailVerification && !emailVerified) {
                errors.email_otp = ["Email must be verified with OTP before continuing"];
                isValid = false;
            }
        } else if (step === 3) {
            // Validate payout (optional step: validate only if user tries to save payout details)
            if (payoutMethod === "paypal") {
                if (!formData.paypal_email?.trim()) {
                    errors.paypal_email = ["PayPal email address is required"];
                    isValid = false;
                } else {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(formData.paypal_email.trim())) {
                        errors.paypal_email = ["Please enter a valid PayPal email address"];
                        isValid = false;
                    }
                }
            }

            if (payoutMethod === "bank") {
                if (!formData.bank_name?.trim()) {
                    errors.bank_name = ["Bank name is required"];
                    isValid = false;
                }
                if (!formData.bank_account_holder_name?.trim()) {
                    errors.bank_account_holder_name = ["Account holder name is required"];
                    isValid = false;
                }
                if (!formData.bank_account_number?.trim()) {
                    errors.bank_account_number = ["Account number is required"];
                    isValid = false;
                }
                if (!formData.bank_ifsc_code?.trim()) {
                    errors.bank_ifsc_code = ["IFSC / SWIFT code is required"];
                    isValid = false;
                }
                if (!formData.bank_country?.trim()) {
                    errors.bank_country = ["Bank country is required"];
                    isValid = false;
                }
            }
        }

        setValidationErrors(errors);
        return isValid;
    };

    const saveStepData = async (step, { markAuthor = false } = {}) => {
        setLoading(true);
        const token = authToken || themeConfig.TOKEN;
        try {
            if (step === 1) {
                const payload = {
                    profile_name: formData.profile_name?.trim() || "",
                    username: formData.username?.trim() || "",
                    bio: formData.bio?.trim() || "",
                    image: hasNewImage && imageId !== null ? imageId : undefined,
                };
                await strapiPost("author/onboarding/profile", payload, token);
                setHasNewImage(false);
            }

            if (step === 2) {
                const purePhone = stripDialCode(formData.phone_no || "").replace(/\D/g, "");
                const countryDialCode = filteredflag?.[0]?.dialCode || "";
                const payload = {
                    first_name: formData.first_name?.trim() || "",
                    last_name: formData.last_name?.trim() || "",
                    email: formData.email?.trim() || "",
                    country: selectedCountry || "",
                    phone_no: countryDialCode ? `${countryDialCode}${purePhone}` : formData.phone_no || "",
                };
                await strapiPost("author/onboarding/account", payload, token);
            }

            if (step === 3) {
                if (payoutMethod === "paypal") {
                    const payload = {
                        paypal_email: formData.paypal_email?.trim() || "",
                        bank_account_number: "",
                        bank_account_holder_name: "",
                        bank_ifsc_code: "",
                        bank_name: "",
                    };
                    await strapiPost("author/onboarding/payout", payload, token);
                } else if (payoutMethod === "bank") {
                    const payload = {
                        paypal_email: "",
                        bank_account_number: formData.bank_account_number?.trim() || "",
                        bank_account_holder_name: formData.bank_account_holder_name?.trim() || "",
                        bank_ifsc_code: formData.bank_ifsc_code?.trim() || "",
                        bank_name: formData.bank_name?.trim() || "",
                    };
                    await strapiPost("author/onboarding/payout", payload, token);
                } else {
                    await strapiPost("author/onboarding/skip-payout", {}, token);
                }
            }

            return true;
        } catch (error) {
            console.error("Onboarding save error:", error);
            const errMsg = error?.response?.data?.error?.message || error?.message || "An error occurred. Please try again.";
            toast.error(errMsg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAndContinue = async () => {
        if (!validateStep(currentStep)) return;

        // Step 1 -> Step 2
        if (currentStep === 1) {
            const ok = await saveStepData(1);
            if (ok) setStepAndSync(2);
            return;
        }

        // Step 2 -> Step 3 (author becomes active after step 2)
        if (currentStep === 2) {
            const ok = await saveStepData(2, { markAuthor: true });
            if (ok) setStepAndSync(3);
            return;
        }

        // Step 3 -> Welcome
        if (currentStep === 3) {
            const ok = await saveStepData(3);
            if (ok) {
                toast.success("Payout details saved!");
                await completeOnboarding();
            }
        }
    };

    const completeOnboarding = async () => {
        const token = authToken || themeConfig.TOKEN;
        try {
            await strapiPost("author/onboarding/complete", {}, token);
            await getUserData();
            setStepAndSync(4);
        } catch (error) {
            const errMsg = error?.response?.data?.error?.message || error?.message || "Failed to complete onboarding.";
            toast.error(errMsg);
            return false;
        }
        return true;
    };

    const handleSkipPayout = async () => {
        setLoading(true);
        const token = authToken || themeConfig.TOKEN;
        try {
            await strapiPost("author/onboarding/skip-payout", {}, token);
            await completeOnboarding();
        } catch (error) {
            const errMsg = error?.response?.data?.error?.message || error?.message || "Failed to skip payout.";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        {/* Profile Image Section */}
                        <div className="flex md:items-center sm:items-start items-center justify-between md:flex-row flex-col w-full border-b border-primary/10 sm:pb-[25px] sm:mb-[25px] pb-4 mb-4 sm:gap-5 gap-3">
                            <div className="flex items-center sm:flex-row flex-col lg:gap-[18px] sm:gap-4 gap-[10px]">
                                <div className="w-[66px] h-[66px] flex-shrink-0 rounded-full overflow-hidden relative">
                                    {profileImage && profileImage !== "/images/no-image.svg" ? (
                                        <Image
                                            src={profileImage}
                                            alt="Profile"
                                            width={66}
                                            height={66}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <Image
                                            src="/images/no-image.svg"
                                            alt="No Profile"
                                            width={66}
                                            height={66}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    )}
                                    {imageLoading && (
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 50 50"
                                                fill="none"
                                                className="animate-spin text-white"
                                            >
                                                <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3" fill="none" />
                                                <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" strokeDasharray="80 120" strokeLinecap="round" fill="none" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="lg:mb-1 mt-0 sm:text-start text-center">
                                        Profile Image*
                                    </h4>
                                    <p className="p2 mt-0 sm:text-start text-center">
                                        We recommend uploading a square JPG image of at least 400×400 px (max 2 MB).
                                    </p>
                                    {validationErrors.profile_image && (
                                        <p className="text-red-500 text-xs mt-1">{validationErrors.profile_image[0]}</p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                className="btn btn-primary gap-[10px] relative disabled:opacity-70 disabled:cursor-not-allowed"
                                disabled={imageLoading}
                            >
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    className="absolute inset-0 opacity-0 cursor-pointer disabled:pointer-events-none"
                                    onChange={handleImageUpload}
                                    disabled={imageLoading}
                                />
                                {imageLoading ? (
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            className="animate-spin flex-shrink-0 inline-block origin-center"
                                            aria-hidden
                                        >
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                            <g clipPath="url(#clip0_9014_5884)">
                                                <path d="M1.38281 10.9412V12.4706C1.38281 12.8762 1.54395 13.2652 1.83077 13.552C2.11759 13.8389 2.5066 14 2.91222 14H12.0887C12.4943 14 12.8833 13.8389 13.1702 13.552C13.457 13.2652 13.6181 12.8762 13.6181 12.4706V10.9412M3.67693 4.82353L7.50046 1M7.50046 1L11.324 4.82353M7.50046 1V10.1765" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </g>
                                        </svg>
                                        Upload Image
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Profile Fields */}
                        <div className="flex flex-wrap lg:gap-y-5 gap-y-4 mb-[22px]">
                            {profileFields
                                .sort((a, b) => a.position - b.position)
                                .map((data, index) => (
                                    <div key={`profile-field-${index}`} className={data.class}>
                                        {data.name === "username" ? (
                                            <>
                                                <label className="block text-sm pb-1.5 p2 !text-black">Username *</label>
                                                <div className="flex gap-3 border border-gray-100 rounded-[5px] overflow-hidden">
                                                    <div className="bg-blue-300 border-r border-primary/10 px-3 h-auto flex items-center justify-center p2 sm:w-[72%] w-[65%] overflow-hidden">https://www.webbytemplate.com/author/</div>
                                                    <Input
                                                        type="text"
                                                        placeholder="Your name"
                                                        className="sm:w-[28%] w-[35%] outline-none"
                                                        classNames={{
                                                            inputWrapper: "!bg-transparent shadow-none xl:py-[23px] sm:py-[21px] py-[20px] px-0",
                                                            innerwrapper: "shadow-none",
                                                            input: "xl:!text-base sm:!text-sm tet-start",
                                                        }}
                                                        value={formData.username || ""}
                                                        onChange={(e) => {
                                                            handleFieldChange("username", e.target.value);
                                                            // Trigger username check
                                                            debouncedUsernameCheck(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex items-start gap-[5px] mt-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                                        <path d="M10.6667 12.6667L14 9.33335L10.6667 6.00002" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                                                        </path>
                                                        <path d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"></path>
                                                    </svg>
                                                    <p className="xl:text-sm md:text-[13px] text-xs md:leading-5 leading-[17px] text-gray-200">
                                                        4–15 characters, lowercase letters (a–z) and numbers (0–9) only. This will be used in your public profile URL.
                                                    </p>
                                                </div>
                                                {usernameCheck.status !== "idle" && !validationErrors.username && (
                                                    <p className={`text-xs mt-1 ${getUsernameStatusClass()}`}>
                                                        {usernameCheck.message}
                                                    </p>
                                                )}
                                                {validationErrors.username && (
                                                    <p className="text-red-500 text-xs mt-1">{validationErrors.username[0]}</p>
                                                )}
                                            </>
                                        ) : data.html === "input" ? (
                                            <FormInput
                                                data={data}
                                                onChange={handleFieldChange}
                                                error={validationErrors[data.name]}
                                                defaultValueData={formData[data.name]}
                                                formValues={formData}
                                            />
                                        ) : data.html === "textarea" ? (
                                            <FormTextArea
                                                data={data}
                                                onChange={handleFieldChange}
                                                error={validationErrors[data.name]}
                                                defaultValueData={formData[data.name]}
                                                formValues={formData}
                                            />
                                        ) : null}
                                    </div>
                                ))}
                        </div>

                        {/* Terms & Conditions */}
                        <div className="flex items-center gap-2 mt-2">
                            <input
                                id="agree-policies"
                                type="checkbox"
                                className="lg:w-[18px] lg:h-[18px] w-4 h-4 accent-primary cursor-pointer"
                                checked={agreedToPolicies}
                                onChange={(e) => {
                                    setAgreedToPolicies(e.target.checked);
                                    setValidationErrors((prev) => ({ ...prev, agreed_to_author_policies: "" }));
                                }}
                            />
                            <label htmlFor="agree-policies" className="p2 cursor-pointer flex-1">
                                By continuing, I agree to WebbyTemplate's{" "}
                                <Link className="text-primary" href="/terms-and-conditions/">Terms & Conditions</Link>,{" "}
                                <Link className="text-primary" href="/privacy-policy/">Privacy Policy</Link>, and{" "}
                                <Link className="text-primary" href="/author-terms-and-policy/">Author Policy</Link>.
                            </label>
                        </div>
                        {validationErrors.agreed_to_author_policies && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.agreed_to_author_policies[0]}</p>
                        )}

                        {/* Note Box */}
                        <div className="bg-blue-300/50 border border-blue-300 rounded-[5px] overflow-hidden 1xl:mt-5 mt-4">
                            <p className="text-sm font-normal py-2 sm:px-3 px-2">
                                <span className="font-medium text-black">Note:</span> Your profile must be completed before you can submit products for review.
                            </p>
                        </div>
                    </>
                );

            case 2:
                return (
                    <>
                        {/* Profile Fields - DownloadList design */}
                        <div className="flex flex-wrap lg:gap-y-5 gap-y-4 mb-[22px]">
                            {/* First Name */}
                            <div className="w-full lg:w-1/2 lg:px-2">
                                <label className="block text-sm pb-1.5 p2 !text-black">First Name *</label>
                                <Input
                                    type="text"
                                    placeholder="Enter your first name"
                                    className="w-full border border-gray-100 rounded-md outline-none"
                                    classNames={{
                                        inputWrapper: "!bg-transparent shadow-none xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px]",
                                        innerwrapper: "shadow-none",
                                        input: "xl:!text-base sm:!text-sm",
                                    }}
                                    value={formData.first_name || ""}
                                    onChange={(e) => handleFieldChange("first_name", e.target.value)}
                                />
                                <div className="flex items-start gap-[5px] mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                        <path d="M10.6667 12.6667L14 9.33335L10.6667 6.00002" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className="xl:text-sm md:text-[13px] text-xs md:leading-5 leading-[17px] text-gray-200">
                                        Maximum 50 characters. No special symbols.
                                    </p>
                                </div>
                                {validationErrors.first_name && (
                                    <p className="text-red-500 text-xs mt-1">{validationErrors.first_name?.[0]}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div className="w-full lg:w-1/2 lg:px-2">
                                <label className="block text-sm pb-1.5 p2 !text-black">Last Name *</label>
                                <Input
                                    type="text"
                                    placeholder="Enter your last name"
                                    className="w-full border border-gray-100 rounded-md outline-none"
                                    classNames={{
                                        inputWrapper: "!bg-transparent shadow-none xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px]",
                                        innerwrapper: "shadow-none",
                                        input: "xl:!text-base sm:!text-sm",
                                    }}
                                    value={formData.last_name || ""}
                                    onChange={(e) => handleFieldChange("last_name", e.target.value)}
                                />
                                <div className="flex items-start gap-[5px] mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                        <path d="M10.6667 12.6667L14 9.33335L10.6667 6.00002" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className="xl:text-sm md:text-[13px] text-xs md:leading-5 leading-[17px] text-gray-200">
                                        Maximum 50 characters. No special symbols.
                                    </p>
                                </div>
                                {validationErrors.last_name && (
                                    <p className="text-red-500 text-xs mt-1">{validationErrors.last_name?.[0]}</p>
                                )}
                            </div>

                            {/* Email - DownloadList design with Verified badge or Send OTP (when needsEmailVerification) */}
                            <div className="w-full">
                                <label className="block text-sm pb-1.5 p2 !text-black">Email *</label>
                                <div className="flex justify-between border border-gray-100 rounded-[5px] overflow-hidden">
                                    <Input
                                        type="email"
                                        placeholder="@"
                                        className="outline-none"
                                        classNames={{
                                            base: "sm:w-[95%] w-[80%] overflow-hidden",
                                            inputWrapper: "!bg-transparent shadow-none xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px]",
                                            innerwrapper: "shadow-none",
                                            input: "xl:!text-base sm:!text-sm tet-start",
                                        }}
                                        value={formData.email || ""}
                                        readOnly={!needsEmailVerification && (formData?.confirmed || formData?.email_verified) && !isEditingEmail}
                                        onChange={(e) => handleFieldChange("email", e.target.value)}
                                    />
                                    <div className="flex items-center gap-1 text-primary text-xs font-medium flex-shrink-0">
                                        {emailVerified || (formData?.confirmed || formData?.email_verified) && !needsEmailVerification ? (
                                            <Tooltip
                                                content="Verified"
                                                placement="top"
                                                showArrow
                                                classNames={{
                                                    base: "max-w-fit",
                                                    content: "text-[14px] leading-4 bg-white border-blue-300 py-[7px] px-3 text-primary rounded-[5px] border shadow-[0px_2px_25px_0px_#277AC626]",
                                                }}
                                            >
                                                <div className="bg-[#0041A3] p-1 sm:w-[56px] w-9 flex items-center justify-center h-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="sm:w-6 sm:h-6 w-5 h-5">
                                                        <path d="M14.9994 10L10.9994 14L8.99937 12M13.2454 3.45901L14.4664 4.49901C14.7744 4.76101 15.1564 4.91901 15.5584 4.95201L17.1584 5.08001C17.6131 5.11632 18.0401 5.31339 18.3628 5.63589C18.6855 5.95839 18.8828 6.38526 18.9194 6.84001L19.0464 8.44001C19.0794 8.84301 19.2384 9.22601 19.5004 9.53301L20.5404 10.753C20.8368 11.1005 20.9996 11.5423 20.9996 11.999C20.9996 12.4557 20.8368 12.8975 20.5404 13.245L19.5004 14.466C19.2384 14.774 19.0794 15.156 19.0474 15.559L18.9194 17.159C18.8831 17.6138 18.686 18.0408 18.3635 18.3634C18.041 18.6861 17.6141 18.8834 17.1594 18.92L15.5594 19.048C15.1565 19.0799 14.7741 19.2381 14.4664 19.5L13.2454 20.54C12.8979 20.8364 12.4561 20.9992 11.9994 20.9992C11.5426 20.9992 11.1009 20.8364 10.7534 20.54L9.53337 19.5C9.2254 19.2379 8.84253 19.0797 8.43937 19.048L6.83937 18.92C6.38446 18.8834 5.95746 18.686 5.63494 18.3631C5.31241 18.0402 5.11545 17.613 5.07937 17.158L4.95137 15.559C4.91898 15.1564 4.76046 14.7743 4.49837 14.467L3.45837 13.245C3.1625 12.8977 3 12.4563 3 12C3 11.5437 3.1625 11.1024 3.45837 10.755L4.49837 9.53301C4.76137 9.22501 4.91837 8.84301 4.95037 8.44001L5.07837 6.84101C5.11477 6.38577 5.31226 5.95841 5.63538 5.63566C5.9585 5.31291 6.38608 5.1159 6.84137 5.08001L8.43937 4.95301C8.8423 4.92083 9.2248 4.7623 9.53237 4.50001L10.7534 3.46001C11.1009 3.16361 11.5426 3.00079 11.9994 3.00079C12.4561 3.00079 12.8979 3.16261 13.2454 3.45901Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </Tooltip>
                                        ) : needsEmailVerification ? (
                                            !emailVerified ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleSendOtpAddContact("email")}
                                                    className="text-xs text-primary underline py-2 px-2 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                                                    disabled={!formData.email?.trim() || otpLoading || resendCooldown > 0}
                                                >
                                                    {otpLoading ? (
                                                        <>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 50 50" fill="none" className="animate-spin flex-shrink-0">
                                                                <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" fill="none" />
                                                                <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" strokeDasharray="80 120" strokeLinecap="round" fill="none" />
                                                            </svg>
                                                            Sending...
                                                        </>
                                                    ) : resendCooldown > 0 ? (
                                                        `Resend in ${resendCooldown}s`
                                                    ) : (
                                                        "Send OTP"
                                                    )}
                                                </button>
                                            ) : (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded whitespace-nowrap">Verified</span>
                                            )
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingEmail((v) => !v)}
                                                className="text-xs text-primary underline py-2 px-2"
                                                disabled={loading}
                                            >
                                                {isEditingEmail ? "Lock" : "Edit"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-start gap-[5px] mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                        <path d="M10.6667 12.6667L14 9.33335L10.6667 6.00002" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className="xl:text-sm md:text-[13px] text-xs md:leading-5 leading-[17px] text-gray-200">
                                        This email is used for account notifications, support communication.
                                    </p>
                                </div>
                                {validationErrors.email && (
                                    <p className="text-red-500 text-xs mt-1">{validationErrors.email?.[0]}</p>
                                )}
                            </div>

                            {/* Country dropdown */}
                            <div className="w-full lg:w-1/2 lg:px-2 relative">
                                <label className="block text-sm pb-1.5 p2 !text-black">Country *</label>
                                <div className="relative">
                                    <div
                                        className={`border p2 ${validationErrors.country ? "border-red-500" : "border-gray-100"} text-gray-300 placeholder:text-gray-300 xl:py-[11px] py-[9px] px-2 rounded-[5px] w-full cursor-pointer flex justify-between items-center bg-transparent`}
                                        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
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
                                            <span className="text-gray-700">
                                                {selectedCountry || "Select your country"}
                                            </span>
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
                                                        onClick={() => {
                                                            setSelectedCountry(country.name);
                                                            setFormData((prev) => ({ ...prev, country: country.name }));
                                                            setIsCountryDropdownOpen(false);
                                                            setCountrySearchTerm("");
                                                            setOtpSentType(null);
                                                            setOtpCode("");
                                                            setPhoneVerified(false);
                                                            setValidationErrors((prev) => ({ ...prev, country: "", phone_no: "", phone_otp: "" }));
                                                        }}
                                                        className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer flex items-center gap-2"
                                                    >
                                                        <Image
                                                            src={country.flag || "/placeholder.svg?height=14&width=20"}
                                                            alt={`${country.name} flag`}
                                                            width={20}
                                                            height={14}
                                                            className="rounded-sm"
                                                        />
                                                        <span>{country.name}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                {validationErrors.country && (
                                    <p className="text-red-500 text-xs mt-1">{validationErrors.country?.[0]}</p>
                                )}
                                <div className="flex items-start gap-[5px] mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                        <path d="M10.6667 12.6667L14 9.33335L10.6667 6.00002" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className="xl:text-sm md:text-[13px] text-xs md:leading-5 leading-[17px] text-gray-200">
                                        Dropdown list (searchable).
                                    </p>
                                </div>
                            </div>

                            {/* Mobile number - same design as email with Verified badge */}
                            <div className="w-full lg:w-1/2 lg:px-2">
                                <label className="block text-sm pb-1.5 p2 !text-black">
                                    Mobile Number *
                                </label>
                                <div className="flex justify-between border border-gray-100 rounded-[5px] overflow-hidden">
                                    <div className="flex items-center flex-1 min-w-0 border-r border-primary/10 px-2 xl:py-3 py-[9px]">
                                        <div className="flex items-center border-r border-gray-200 pr-2">
                                            <Image
                                                src={filteredflag?.[0]?.flag || "/placeholder.svg?height=16&width=24"}
                                                alt={`${selectedCountry} flag`}
                                                width={24}
                                                height={16}
                                                className="rounded-sm mr-2"
                                            />
                                            <span className="text-base text-black mr-1 mx-2">
                                                {filteredflag?.[0]?.dialCode || "+1"}
                                            </span>
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="Enter your mobile number"
                                            value={stripDialCode(formData.phone_no) || ""}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "");
                                                setPhoneVerified(false);
                                                handleFieldChange("phone_no", value);
                                            }}
                                            className={`outline-none flex-1 ml-2 min-w-0 text-black placeholder:text-gray-400 ${validationErrors.phone_no ? "border-red-500" : ""}`}
                                            maxLength={15}
                                        />
                                    </div>
                                    <div className="flex items-center gap-1 text-primary text-xs font-medium flex-shrink-0">
                                        {phoneVerified ? (
                                            <Tooltip
                                                content="Verified"
                                                placement="top"
                                                showArrow
                                                classNames={{
                                                    base: "max-w-fit",
                                                    content: "text-[14px] leading-4 bg-white border-blue-300 py-[7px] px-3 text-primary rounded-[5px] border shadow-[0px_2px_25px_0px_#277AC626]",
                                                }}
                                            >
                                                <div className="bg-[#0041A3] p-1 sm:w-[56px] w-9 flex items-center justify-center h-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="sm:w-6 sm:h-6 w-5 h-5">
                                                        <path d="M14.9994 10L10.9994 14L8.99937 12M13.2454 3.45901L14.4664 4.49901C14.7744 4.76101 15.1564 4.91901 15.5584 4.95201L17.1584 5.08001C17.6131 5.11632 18.0401 5.31339 18.3628 5.63589C18.6855 5.95839 18.8828 6.38526 18.9194 6.84001L19.0464 8.44001C19.0794 8.84301 19.2384 9.22601 19.5004 9.53301L20.5404 10.753C20.8368 11.1005 20.9996 11.5423 20.9996 11.999C20.9996 12.4557 20.8368 12.8975 20.5404 13.245L19.5004 14.466C19.2384 14.774 19.0794 15.156 19.0474 15.559L18.9194 17.159C18.8831 17.6138 18.686 18.0408 18.3635 18.3634C18.041 18.6861 17.6141 18.8834 17.1594 18.92L15.5594 19.048C15.1565 19.0799 14.7741 19.2381 14.4664 19.5L13.2454 20.54C12.8979 20.8364 12.4561 20.9992 11.9994 20.9992C11.5426 20.9992 11.1009 20.8364 10.7534 20.54L9.53337 19.5C9.2254 19.2379 8.84253 19.0797 8.43937 19.048L6.83937 18.92C6.38446 18.8834 5.95746 18.686 5.63494 18.3631C5.31241 18.0402 5.11545 17.613 5.07937 17.158L4.95137 15.559C4.91898 15.1564 4.76046 14.7743 4.49837 14.467L3.45837 13.245C3.1625 12.8977 3 12.4563 3 12C3 11.5437 3.1625 11.1024 3.45837 10.755L4.49837 9.53301C4.76137 9.22501 4.91837 8.84301 4.95037 8.44001L5.07837 6.84101C5.11477 6.38577 5.31226 5.95841 5.63538 5.63566C5.9585 5.31291 6.38608 5.1159 6.84137 5.08001L8.43937 4.95301C8.8423 4.92083 9.2248 4.7623 9.53237 4.50001L10.7534 3.46001C11.1009 3.16361 11.5426 3.00079 11.9994 3.00079C12.4561 3.00079 12.8979 3.16261 13.2454 3.45901Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </Tooltip>
                                        ) : needsPhoneVerification ? (
                                            <button
                                                type="button"
                                                onClick={() => handleSendOtpAddContact("mobile")}
                                                className="text-xs text-primary underline py-2 px-2 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                                                disabled={!stripDialCode(formData.phone_no || "").trim() || otpLoading || resendCooldown > 0}
                                            >
                                                {otpLoading ? (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 50 50" fill="none" className="animate-spin flex-shrink-0">
                                                            <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" fill="none" />
                                                            <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" strokeDasharray="80 120" strokeLinecap="round" fill="none" />
                                                        </svg>
                                                        Sending...
                                                    </>
                                                ) : resendCooldown > 0 ? (
                                                    `Resend in ${resendCooldown}s`
                                                ) : (
                                                    "Send OTP"
                                                )}
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-500 py-2 px-2">Add & verify</span>
                                        )}
                                    </div>
                                </div>
                                {validationErrors.phone_no && (
                                    <p className="text-red-500 text-xs mt-1">{validationErrors.phone_no?.[0]}</p>
                                )}
                                <div className="flex items-start gap-[5px] mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                        <path d="M10.6667 12.6667L14 9.33335L10.6667 6.00002" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className="xl:text-sm md:text-[13px] text-xs md:leading-5 leading-[17px] text-gray-200">
                                        Country code selected (default based on user country). OTP verification required.
                                    </p>
                                </div>
                                {validationErrors.phone_otp && (
                                    <p className="text-red-500 text-xs mt-1">{validationErrors.phone_otp?.[0]}</p>
                                )}
                            </div>
                        </div>

                        {/* Note Box - DownloadList design */}
                        <div className="bg-blue-300/50 border border-blue-300 rounded-[5px] overflow-hidden 1xl:mt-5 mt-4">
                            <p className="text-sm font-normal py-2 sm:px-3 px-2">
                                <span className="font-medium text-black">Note:</span> We use your contact details only for account security, support, and important notifications.
                            </p>
                        </div>
                    </>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        {/* DownloadList-style info box */}
                        <div className="bg-white border border-primary/10 rounded-md md:p-4 p-3">
                            <div className="sm:border-l-2 border-blue-300 xl:pl-[18px] lg:pl-4 sm:pl-3">
                                <div className="flex items-center gap-2">
                                    <p className="text-black">💡 Payout policy</p>
                                </div>
                                <ul className="mt-3 space-y-1 text-[#616161]">
                                    <li className="flex items-start gap-2 p2 text-gray-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" className="flex-shrink-0 sm:w-[17px] sm:h-[17px] w-4 h-4">
                                            <g clipPath="url(#clip0_otp_1)">
                                                <path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z" fill="#0043A2" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z" fill="#0043A2" />
                                            </g>
                                        </svg>
                                        Minimum withdrawal amount is <strong>$100</strong>.
                                    </li>
                                    <li className="flex items-start gap-2 p2 text-gray-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" className="flex-shrink-0 sm:w-[17px] sm:h-[17px] w-4 h-4">
                                            <g clipPath="url(#clip0_otp_2)">
                                                <path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z" fill="#0043A2" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z" fill="#0043A2" />
                                            </g>
                                        </svg>
                                        Payouts are processed only after you request a withdrawal.
                                    </li>
                                    <li className="flex items-start gap-2 p2 text-gray-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" className="flex-shrink-0 sm:w-[17px] sm:h-[17px] w-4 h-4">
                                            <g clipPath="url(#clip0_otp_3)">
                                                <path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z" fill="#0043A2" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z" fill="#0043A2" />
                                            </g>
                                        </svg>
                                        You can manage and update payout details anytime from the <strong>Earnings</strong> page.
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="w-full bg-white border 2xl:px-5 2xl:py-6 lg:px-4 lg:py-5 px-3 sm:py-4 py-3 border-primary/10 rounded-[5px]">
                            <p className="text-sm font-medium text-black mb-4">Payout Method Selection</p>

                            {/* PayPal */}
                            <div className="border border-primary/10 rounded-[5px] overflow-hidden mb-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const next = openPayoutPanel === "paypal" ? "" : "paypal";
                                        setOpenPayoutPanel(next);
                                        setPayoutMethod(next || payoutMethod);
                                    }}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-white"
                                >
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            checked={payoutMethod === "paypal"}
                                            onChange={() => {
                                                setPayoutMethod("paypal");
                                                setOpenPayoutPanel("paypal");
                                            }}
                                            className="hidden"
                                        />
                                        <img src="/images/paypal.svg" alt="Paypal" className="w-full h-6" />
                                    </div>
                                    <span className="p-[1px] rounded-full border border-primary text-primary flex items-center justify-center relative size-[18px] flex-shrink-0">{openPayoutPanel === "paypal" ? "−" : "+"}</span>
                                </button>
                                {openPayoutPanel === "paypal" && (
                                    <div className="p-4 bg-white border-t border-primary/10">
                                        <label className="2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1.5 !font-normal">
                                            {payoutFields.paypal_email.label} *
                                        </label>
                                        <input
                                            type="email"
                                            placeholder={payoutFields.paypal_email.placeholder}
                                            value={formData.paypal_email || ""}
                                            onChange={(e) => handleFieldChange("paypal_email", e.target.value)}
                                            className={`w-full border rounded-md py-2.5 px-3 outline-none active:border-black focus:border-black ${validationErrors.paypal_email ? "border-red-500" : "border-gray-100"}`}
                                        />
                                        {validationErrors.paypal_email && (
                                            <p className="text-red-500 text-xs mt-1">{validationErrors.paypal_email?.[0]}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Bank Transfer */}
                            <div className="border border-primary/10 rounded-[5px] overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const next = openPayoutPanel === "bank" ? "" : "bank";
                                        setOpenPayoutPanel(next);
                                        setPayoutMethod(next || payoutMethod);
                                    }}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-white"
                                >
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            checked={payoutMethod === "bank"}
                                            onChange={() => {
                                                setPayoutMethod("bank");
                                                setOpenPayoutPanel("bank");
                                            }}
                                            className="hidden"
                                        />
                                        <img src="/images/bank-transfer.svg" alt="Bank Transfer" className="w-full h-6" />
                                    </div>
                                    <span className="rounded-full border border-primary text-primary flex items-center justify-center relative size-[18px] flex-shrink-0">{openPayoutPanel === "bank" ? "−" : "+"}</span>
                                </button>
                                {openPayoutPanel === "bank" && (
                                    <div className="p-4 bg-white border-t border-primary/10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[22px]">
                                            <div>
                                                <label className="2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1.5 !font-normal">
                                                    {payoutFields.bank_name.label} *
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder={payoutFields.bank_name.placeholder}
                                                    value={formData.bank_name || ""}
                                                    onChange={(e) => handleFieldChange("bank_name", e.target.value)}
                                                    className={`w-full border rounded-md py-2.5 px-3 outline-none active:border-black focus:border-black ${validationErrors.bank_name ? "border-red-500" : "border-gray-100"}`}
                                                />
                                                {validationErrors.bank_name && (
                                                    <p className="text-red-500 text-xs mt-1">{validationErrors.bank_name?.[0]}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1.5 !font-normal">
                                                    {payoutFields.bank_account_holder_name.label} *
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder={payoutFields.bank_account_holder_name.placeholder}
                                                    value={formData.bank_account_holder_name || ""}
                                                    onChange={(e) => handleFieldChange("bank_account_holder_name", e.target.value)}
                                                    className={`w-full border rounded-md py-2.5 px-3 outline-none active:border-black focus:border-black ${validationErrors.bank_account_holder_name ? "border-red-500" : "border-gray-100"}`}
                                                />
                                                {validationErrors.bank_account_holder_name && (
                                                    <p className="text-red-500 text-xs mt-1">{validationErrors.bank_account_holder_name?.[0]}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1.5 !font-normal">
                                                    {payoutFields.bank_account_number.label} *
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder={payoutFields.bank_account_number.placeholder}
                                                    value={formData.bank_account_number || ""}
                                                    onChange={(e) => handleFieldChange("bank_account_number", e.target.value.replace(/[^\d]/g, ""))}
                                                    className={`w-full border rounded-md py-2.5 px-3 outline-none active:border-black focus:border-black ${validationErrors.bank_account_number ? "border-red-500" : "border-gray-100"}`}
                                                />
                                                {validationErrors.bank_account_number && (
                                                    <p className="text-red-500 text-xs mt-1">{validationErrors.bank_account_number?.[0]}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1.5 !font-normal">
                                                    {payoutFields.bank_ifsc_code.label} *
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder={payoutFields.bank_ifsc_code.placeholder}
                                                    value={formData.bank_ifsc_code || ""}
                                                    onChange={(e) => handleFieldChange("bank_ifsc_code", e.target.value.toUpperCase())}
                                                    className={`w-full border rounded-md py-2.5 px-3 outline-none active:border-black focus:border-black ${validationErrors.bank_ifsc_code ? "border-red-500" : "border-gray-100"}`}
                                                />
                                                {validationErrors.bank_ifsc_code && (
                                                    <p className="text-red-500 text-xs mt-1">{validationErrors.bank_ifsc_code?.[0]}</p>
                                                )}
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1.5 !font-normal">
                                                    {payoutFields.bank_country.label} *
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter bank country"
                                                    value={formData.bank_country || ""}
                                                    onChange={(e) => handleFieldChange("bank_country", e.target.value)}
                                                    className={`w-full border rounded-md py-2.5 px-3 outline-none active:border-black focus:border-black ${validationErrors.bank_country ? "border-red-500" : "border-gray-100"}`}
                                                />
                                                {validationErrors.bank_country && (
                                                    <p className="text-red-500 text-xs mt-1">{validationErrors.bank_country?.[0]}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        {/* DownloadList-style welcome box */}
                        <div className="bg-white">
                            <div className="">
                                <h2 className="text-black font-medium mb-4">Welcome to WebbyTemplate</h2>
                                <p className="p2 text-[#383737]">
                                    Your author account is now active. You can start creating and submitting products for review.
                                </p>
                            </div>
                        </div>

                        {/* DownloadList-style summary box */}
                        <div className="w-full bg-white">
                            <h5 className="text-black mb-4">Onboarding Summary</h5>
                            <ul className="space-y-[18px] text-[#505050]">
                                <li className="flex items-start gap-2 p2 text-gray-200">
                                    {onboardingProgress.step1Done ? (
                                        <div className="flex items-center justify-center p-1 bg-primary text-white rounded-full w-8 h-8">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                                <path d="M8.75401 13.8875L16.5228 6.11875C16.7061 5.93542 16.92 5.84375 17.1644 5.84375C17.4089 5.84375 17.6228 5.93542 17.8061 6.11875C17.9894 6.30208 18.0811 6.51994 18.0811 6.77233C18.0811 7.02472 17.9894 7.24228 17.8061 7.425L9.39567 15.8583C9.21234 16.0417 8.99845 16.1333 8.75401 16.1333C8.50956 16.1333 8.29567 16.0417 8.11234 15.8583L4.17067 11.9167C3.98734 11.7333 3.89934 11.5158 3.90667 11.264C3.91401 11.0122 4.00965 10.7944 4.19359 10.6104C4.37753 10.4265 4.5954 10.3348 4.84717 10.3354C5.09895 10.336 5.31651 10.4277 5.49984 10.6104L8.75401 13.8875Z" fill="white" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#D9DDE2] p-2 flex-shrink-0" aria-hidden="true">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                                                <path d="M0.666667 18C0.489856 18 0.320287 17.9323 0.195262 17.8117C0.070238 17.6912 0 17.5276 0 17.3571C0 17.1866 0.070238 17.0231 0.195262 16.9026C0.320287 16.782 0.489856 16.7143 0.666667 16.7143H2V15.4286C1.99973 14.337 2.31971 13.2675 2.923 12.3439C3.52629 11.4202 4.38825 10.6799 5.40933 10.2086C5.796 10.0299 6 9.72386 6 9.45V8.55C6 8.27614 5.79467 7.97014 5.40933 7.79143C4.38825 7.32009 3.52629 6.57983 2.923 5.65614C2.31971 4.73246 1.99973 3.66304 2 2.57143V1.28571H0.666667C0.489856 1.28571 0.320287 1.21798 0.195262 1.09743C0.070238 0.976867 0 0.813353 0 0.642857C0 0.472361 0.070238 0.308848 0.195262 0.188288C0.320287 0.0677294 0.489856 0 0.666667 0H15.3333C15.5101 0 15.6797 0.0677294 15.8047 0.188288C15.9298 0.308848 16 0.472361 16 0.642857C16 0.813353 15.9298 0.976867 15.8047 1.09743C15.6797 1.21798 15.5101 1.28571 15.3333 1.28571H14V2.57143C14.0003 3.66304 13.6803 4.73246 13.077 5.65614C12.4737 6.57983 11.6117 7.32009 10.5907 7.79143C10.204 7.97014 10 8.27614 10 8.55V9.45C10 9.72386 10.2053 10.0299 10.5907 10.2086C11.6117 10.6799 12.4737 11.4202 13.077 12.3439C13.6803 13.2675 14.0003 14.337 14 15.4286V16.7143H15.3333C15.5101 16.7143 15.6797 16.782 15.8047 16.9026C15.9298 17.0231 16 17.1866 16 17.3571C16 17.5276 15.9298 17.6912 15.8047 17.8117C15.6797 17.9323 15.5101 18 15.3333 18H0.666667ZM3.33333 1.28571V2.57143C3.33333 3.26186 3.49333 3.915 3.78267 4.5H12.2173C12.5053 3.915 12.6667 3.26186 12.6667 2.57143V1.28571H3.33333ZM7.33333 9.45C7.33333 10.3513 6.696 11.0391 5.98533 11.3683C5.19106 11.7349 4.52055 12.3106 4.05127 13.0291C3.58199 13.7476 3.33309 14.5795 3.33333 15.4286C3.33333 15.4286 4.488 13.7584 7.33333 13.5257V9.45ZM8.66667 9.45V13.5257C11.512 13.7584 12.6667 15.4286 12.6667 15.4286C12.6669 14.5795 12.418 13.7476 11.9487 13.0291C11.4795 12.3106 10.8089 11.7349 10.0147 11.3683C9.304 11.0391 8.66667 10.3513 8.66667 9.45Z" fill="#0043A2" />
                                            </svg>
                                        </span>
                                    )}
                                    <span>Author Profile set up</span>
                                </li>
                                <li className="flex items-start gap-2 p2 text-gray-200">
                                    {onboardingProgress.step2Done ? (
                                        <div className="flex items-center justify-center p-1 bg-primary text-white rounded-full w-8 h-8">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                                <path d="M8.75401 13.8875L16.5228 6.11875C16.7061 5.93542 16.92 5.84375 17.1644 5.84375C17.4089 5.84375 17.6228 5.93542 17.8061 6.11875C17.9894 6.30208 18.0811 6.51994 18.0811 6.77233C18.0811 7.02472 17.9894 7.24228 17.8061 7.425L9.39567 15.8583C9.21234 16.0417 8.99845 16.1333 8.75401 16.1333C8.50956 16.1333 8.29567 16.0417 8.11234 15.8583L4.17067 11.9167C3.98734 11.7333 3.89934 11.5158 3.90667 11.264C3.91401 11.0122 4.00965 10.7944 4.19359 10.6104C4.37753 10.4265 4.5954 10.3348 4.84717 10.3354C5.09895 10.336 5.31651 10.4277 5.49984 10.6104L8.75401 13.8875Z" fill="white" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#D9DDE2] p-2 flex-shrink-0" aria-hidden="true">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                                                <path d="M0.666667 18C0.489856 18 0.320287 17.9323 0.195262 17.8117C0.070238 17.6912 0 17.5276 0 17.3571C0 17.1866 0.070238 17.0231 0.195262 16.9026C0.320287 16.782 0.489856 16.7143 0.666667 16.7143H2V15.4286C1.99973 14.337 2.31971 13.2675 2.923 12.3439C3.52629 11.4202 4.38825 10.6799 5.40933 10.2086C5.796 10.0299 6 9.72386 6 9.45V8.55C6 8.27614 5.79467 7.97014 5.40933 7.79143C4.38825 7.32009 3.52629 6.57983 2.923 5.65614C2.31971 4.73246 1.99973 3.66304 2 2.57143V1.28571H0.666667C0.489856 1.28571 0.320287 1.21798 0.195262 1.09743C0.070238 0.976867 0 0.813353 0 0.642857C0 0.472361 0.070238 0.308848 0.195262 0.188288C0.320287 0.0677294 0.489856 0 0.666667 0H15.3333C15.5101 0 15.6797 0.0677294 15.8047 0.188288C15.9298 0.308848 16 0.472361 16 0.642857C16 0.813353 15.9298 0.976867 15.8047 1.09743C15.6797 1.21798 15.5101 1.28571 15.3333 1.28571H14V2.57143C14.0003 3.66304 13.6803 4.73246 13.077 5.65614C12.4737 6.57983 11.6117 7.32009 10.5907 7.79143C10.204 7.97014 10 8.27614 10 8.55V9.45C10 9.72386 10.2053 10.0299 10.5907 10.2086C11.6117 10.6799 12.4737 11.4202 13.077 12.3439C13.6803 13.2675 14.0003 14.337 14 15.4286V16.7143H15.3333C15.5101 16.7143 15.6797 16.782 15.8047 16.9026C15.9298 17.0231 16 17.1866 16 17.3571C16 17.5276 15.9298 17.6912 15.8047 17.8117C15.6797 17.9323 15.5101 18 15.3333 18H0.666667ZM3.33333 1.28571V2.57143C3.33333 3.26186 3.49333 3.915 3.78267 4.5H12.2173C12.5053 3.915 12.6667 3.26186 12.6667 2.57143V1.28571H3.33333ZM7.33333 9.45C7.33333 10.3513 6.696 11.0391 5.98533 11.3683C5.19106 11.7349 4.52055 12.3106 4.05127 13.0291C3.58199 13.7476 3.33309 14.5795 3.33333 15.4286C3.33333 15.4286 4.488 13.7584 7.33333 13.5257V9.45ZM8.66667 9.45V13.5257C11.512 13.7584 12.6667 15.4286 12.6667 15.4286C12.6669 14.5795 12.418 13.7476 11.9487 13.0291C11.4795 12.3106 10.8089 11.7349 10.0147 11.3683C9.304 11.0391 8.66667 10.3513 8.66667 9.45Z" fill="#0043A2" />
                                            </svg>
                                        </span>
                                    )}
                                    Account information confirmed
                                </li>
                                <li className="flex items-start gap-2 p2 text-gray-200">
                                    {onboardingProgress.payoutDone ? (
                                        <div className="flex items-center justify-center p-1 bg-primary text-white rounded-full w-8 h-8">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M8.75401 13.8875L16.5228 6.11875C16.7061 5.93542 16.92 5.84375 17.1644 5.84375C17.4089 5.84375 17.6228 5.93542 17.8061 6.11875C17.9894 6.30208 18.0811 6.51994 18.0811 6.77233C18.0811 7.02472 17.9894 7.24228 17.8061 7.425L9.39567 15.8583C9.21234 16.0417 8.99845 16.1333 8.75401 16.1333C8.50956 16.1333 8.29567 16.0417 8.11234 15.8583L4.17067 11.9167C3.98734 11.7333 3.89934 11.5158 3.90667 11.264C3.91401 11.0122 4.00965 10.7944 4.19359 10.6104C4.37753 10.4265 4.5954 10.3348 4.84717 10.3354C5.09895 10.336 5.31651 10.4277 5.49984 10.6104L8.75401 13.8875Z" fill="white"></path></svg>
                                        </div>
                                    ) : (
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#D9DDE2] p-2 flex-shrink-0 ${onboardingProgress.payoutSkipped ? "bg-white text-gray-700" : ""}`} aria-hidden="true">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                                                <path d="M0.666667 18C0.489856 18 0.320287 17.9323 0.195262 17.8117C0.070238 17.6912 0 17.5276 0 17.3571C0 17.1866 0.070238 17.0231 0.195262 16.9026C0.320287 16.782 0.489856 16.7143 0.666667 16.7143H2V15.4286C1.99973 14.337 2.31971 13.2675 2.923 12.3439C3.52629 11.4202 4.38825 10.6799 5.40933 10.2086C5.796 10.0299 6 9.72386 6 9.45V8.55C6 8.27614 5.79467 7.97014 5.40933 7.79143C4.38825 7.32009 3.52629 6.57983 2.923 5.65614C2.31971 4.73246 1.99973 3.66304 2 2.57143V1.28571H0.666667C0.489856 1.28571 0.320287 1.21798 0.195262 1.09743C0.070238 0.976867 0 0.813353 0 0.642857C0 0.472361 0.070238 0.308848 0.195262 0.188288C0.320287 0.0677294 0.489856 0 0.666667 0H15.3333C15.5101 0 15.6797 0.0677294 15.8047 0.188288C15.9298 0.308848 16 0.472361 16 0.642857C16 0.813353 15.9298 0.976867 15.8047 1.09743C15.6797 1.21798 15.5101 1.28571 15.3333 1.28571H14V2.57143C14.0003 3.66304 13.6803 4.73246 13.077 5.65614C12.4737 6.57983 11.6117 7.32009 10.5907 7.79143C10.204 7.97014 10 8.27614 10 8.55V9.45C10 9.72386 10.2053 10.0299 10.5907 10.2086C11.6117 10.6799 12.4737 11.4202 13.077 12.3439C13.6803 13.2675 14.0003 14.337 14 15.4286V16.7143H15.3333C15.5101 16.7143 15.6797 16.782 15.8047 16.9026C15.9298 17.0231 16 17.1866 16 17.3571C16 17.5276 15.9298 17.6912 15.8047 17.8117C15.6797 17.9323 15.5101 18 15.3333 18H0.666667ZM3.33333 1.28571V2.57143C3.33333 3.26186 3.49333 3.915 3.78267 4.5H12.2173C12.5053 3.915 12.6667 3.26186 12.6667 2.57143V1.28571H3.33333ZM7.33333 9.45C7.33333 10.3513 6.696 11.0391 5.98533 11.3683C5.19106 11.7349 4.52055 12.3106 4.05127 13.0291C3.58199 13.7476 3.33309 14.5795 3.33333 15.4286C3.33333 15.4286 4.488 13.7584 7.33333 13.5257V9.45ZM8.66667 9.45V13.5257C11.512 13.7584 12.6667 15.4286 12.6667 15.4286C12.6669 14.5795 12.418 13.7476 11.9487 13.0291C11.4795 12.3106 10.8089 11.7349 10.0147 11.3683C9.304 11.0391 8.66667 10.3513 8.66667 9.45Z" fill="#0043A2" />
                                            </svg>
                                        </span>
                                    )}
                                    Payout setup (optional — can be completed later from Earnings)
                                </li>
                            </ul>
                        </div>

                        {/* DownloadList-style "What happens next" box */}
                        <div className="bg-white">
                            <div className="">
                                <p className="text-black font-medium mb-3">What happens next</p>
                                <ul className="space-y-[18px] text-[#616161]">
                                    <li className="flex items-start flex-col gap-1.5 p2 text-gray-200">
                                        <div className="flex items-center gap-2 p2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" className="flex-shrink-0 sm:w-[17px] sm:h-[17px] w-4 h-4">
                                                <g clipPath="url(#clip0_step4_4)"><path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z" fill="#0043A2" /><path fillRule="evenodd" clipRule="evenodd" d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z" fill="#0043A2" /></g>
                                            </svg>
                                            <span className="text-black font-medium">Create your first product</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 pl-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M10.6667 12.6666L14 9.33329L10.6667 5.99996" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M14 9.33325L8.66667 9.33325C4.98467 9.33325 2 6.34859 2 2.66659L2 1.99992" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Add product details and submit it for review.
                                        </div>
                                    </li>
                                    <li className="flex items-start flex-col gap-1.5 p2 text-gray-200">
                                        <div className="flex items-center gap-2 p2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" className="flex-shrink-0 sm:w-[17px] sm:h-[17px] w-4 h-4">
                                                <g clipPath="url(#clip0_step4_4)"><path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z" fill="#0043A2" /><path fillRule="evenodd" clipRule="evenodd" d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z" fill="#0043A2" /></g>
                                            </svg>
                                            <span className="text-black font-medium">Product review by WebbyTemplate</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 pl-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M10.6667 12.6666L14 9.33329L10.6667 5.99996" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M14 9.33325L8.66667 9.33325C4.98467 9.33325 2 6.34859 2 2.66659L2 1.99992" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Our team will review your submission before publishing.
                                        </div>
                                    </li>
                                    <li className="flex items-start flex-col gap-1.5 p2 text-gray-200">
                                        <div className="flex items-center gap-2 p2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" className="flex-shrink-0 sm:w-[17px] sm:h-[17px] w-4 h-4">
                                                <g clipPath="url(#clip0_step4_4)"><path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z" fill="#0043A2" /><path fillRule="evenodd" clipRule="evenodd" d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z" fill="#0043A2" /></g>
                                            </svg>
                                            <span className="text-black font-medium">Start earning</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 pl-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M10.6667 12.6666L14 9.33329L10.6667 5.99996" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M14 9.33325L8.66667 9.33325C4.98467 9.33325 2 6.34859 2 2.66659L2 1.99992" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Once your product is live, you can track sales from the Earnings page.
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 justify-end pt-2">
                            <Button
                                className="btn btn-outline"
                                onPress={() => {
                                    const path = `/user/${authUser?.documentId || authUser?.id}/products/create`;
                                    window.location.href = path;
                                }}
                            >
                                Create your first product
                            </Button>
                            <Button
                                className="btn btn-primary"
                                onPress={() => {
                                    const path = `/user/${authUser?.documentId || authUser?.id}/dashboard`;
                                    window.location.href = path;
                                }}
                            >
                                Go to Author Dashboard
                            </Button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (fromSetLoading) {
        return <PageLoader />;
    }

    return (
        <div className="container max-w-5xl mx-auto py-8">
            {/* Step Content */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                {currentStep <= TOTAL_STEPS ? (
                    <div className="flex items-start justify-between gap-4 mb-8">
                        <div>
                            <h2 className="mb-4">{steps[currentStep - 1].title}</h2>
                            <p className="text-gray-600 text-sm mt-1">
                                {currentStep === 1
                                    ? "This information will be visible on the marketplace and helps customers recognize and trust your work."
                                    : currentStep === 2
                                        ? "This information is used for account security, communication, and support. It will not be shown publicly on the marketplace."
                                        : "Add your payout details to receive earnings. You can skip this step and complete it later from the Earnings page."}
                            </p>
                        </div>
                        <p className="text-sm text-gray-500 whitespace-nowrap">
                            Step {currentStep} of {TOTAL_STEPS}
                        </p>
                    </div>
                ) : null}
                {renderStepContent()}

                {/* Navigation Buttons */}
                {currentStep <= TOTAL_STEPS && (
                    <div className="flex justify-end items-center mt-6">
                        <div className="flex gap-3">
                            {currentStep === 3 && !steps[2].mandatory && (
                                <Button
                                    onPress={handleSkipPayout}
                                    disabled={loading}
                                    className="btn btn-outline"
                                >
                                    Skip for Now
                                </Button>
                            )}

                            <Button
                                onPress={handleSaveAndContinue}
                                isLoading={loading}
                                disabled={loading}
                                className="btn btn-primary"
                            >
                                {loading
                                    ? "Processing..."
                                    : currentStep === 3
                                        ? "Save Payout Details"
                                        : "Save & Continue"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Verify OTP Modal - same style as login/register CodeModal */}
            <Modal
                hideCloseButton
                isOpen={otpModalOpen}
                onOpenChange={(open) => { if (!open) { setOtpModalOpen(false); setOtpModalType(null); setOtpModalError(""); setOtpModalCodeValues(["", "", "", "", "", ""]); } }}
                classNames={{ backdrop: "bg-black/50" }}
            >
                <ModalContent className="sm:p-[30px] p-5 xl:max-w-[510px] sm:max-w-[474px] w-full">
                    {(onClose) => (
                        <>
                            <ModalHeader className="p-0 text-2xl font-bold gap-1 flex items-center justify-between w-full mb-[10px]">
                                Verify code
                                <button
                                    type="button"
                                    onClick={() => { setOtpModalOpen(false); setOtpModalType(null); setOtpModalError(""); setOtpModalCodeValues(["", "", "", "", "", ""]); onClose(); }}
                                    className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    aria-label="Close modal"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </ModalHeader>
                            <ModalBody className="p-0 gap-0">
                                <p className="text-gray-600 sm:mb-[30px] mb-5">
                                    Enter the code sent to{" "}
                                    <span className="font-bold">
                                        {otpModalType === "email" ? maskOtpIdentifier(getOtpModalIdentifier()) : `+${maskOtpIdentifier(getOtpModalIdentifier())}`}
                                    </span>
                                </p>
                                <div className="flex justify-center md:space-x-[18px] space-x-3 mb-[18px]">
                                    {otpModalCodeValues.map((value, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            inputMode="numeric"
                                            name={`onboarding-otp-${index}`}
                                            maxLength={1}
                                            value={value}
                                            onChange={(e) => handleOtpModalCodeChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpModalKeyDown(index, e)}
                                            onPaste={index === 0 ? handleOtpModalPaste : undefined}
                                            ref={index === 0 ? otpModalFirstInputRef : null}
                                            className={`2xl:w-[60px] 2xl:h-[60px] xl:w-[55px] xl:h-[55px] md:w-[50px] md:h-[50px] w-[45px] h-[45px] text-center text-lg font-medium border ${otpModalError ? "border-red-500" : "border-gray-200"} text-black placeholder:text-gray-400 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all`}
                                            aria-label={`Code digit ${index + 1}`}
                                        />
                                    ))}
                                </div>
                                {otpModalError && (
                                    <div className="flex justify-center mb-2">
                                        <div className="text-red-500 text-sm flex items-center gap-2" role="alert">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <span>{otpModalError}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="text-center mb-5">
                                    <p className="text-sm text-gray-500">
                                        Didn&apos;t receive the code?{" "}
                                        <button
                                            type="button"
                                            className={`font-medium transition-colors ${otpModalResendCooldown > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-800 hover:underline"}`}
                                            onClick={handleOtpModalResend}
                                            disabled={otpModalResendCooldown > 0}
                                        >
                                            {otpModalResendCooldown > 0 ? `Resend in ${otpModalResendCooldown}s` : "Resend code"}
                                        </button>
                                    </p>
                                </div>
                                {otpModalSubmitting && (
                                    <div className="w-full text-center py-3">
                                        <p className="text-sm text-gray-600">Verifying code...</p>
                                    </div>
                                )}
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default AuthorOnboardingWizard;
