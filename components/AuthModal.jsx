"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { themeConfig } from "@/config/theamConfig";
import { useAuth } from "@/contexts/AuthContext";
import { strapiPost } from "@/lib/api/strapiClient";
import { countries as countriesData } from "@/lib/data/countries";
import Cookies from "js-cookie";
import { signIn } from "next-auth/react";

const countries =
  (countriesData || []).map((c) => ({
    name: c.name,
    code: c.dialCode,
    short_name: c.code,
    phonePattern: c.phonePattern,
    phoneLength: c.phoneLength,
  })) || [];

export default function AuthModal() {
  const { isAuthOpen, closeAuth, authMode, switchToOtp, openAuth } = useAuth();
  const hasHandledAuthQueryRef = useRef(false);

  // Auto-open auth modal when a special URL query is present (useful for email deep-links)
  // Supported examples:
  // - "/?auth=login"
  // - "/?auth=register"
  // - "/?login=true"
  // - "/?register=1"
  useEffect(() => {
    if (hasHandledAuthQueryRef.current) return;
    if (typeof window === "undefined") return;

    const truthy = (v) =>
      v === "1" || v === "true" || v === "yes" || v === "y" || v === "on";

    const searchParams = new URLSearchParams(window.location.search);
    const authParam =
      searchParams.get("auth") ||
      searchParams.get("authMode") ||
      searchParams.get("modal") ||
      searchParams.get("openAuth");

    const loginParam = searchParams.get("login");
    const registerParam = searchParams.get("register");

    let mode = null;
    if (authParam) {
      const normalized = String(authParam).toLowerCase().trim();
      if (normalized === "login" || normalized === "register") mode = normalized;
      else if (truthy(normalized)) mode = "login";
    } else if (truthy(String(loginParam || "").toLowerCase().trim())) {
      mode = "login";
    } else if (truthy(String(registerParam || "").toLowerCase().trim())) {
      mode = "register";
    }

    if (!mode) return;

    hasHandledAuthQueryRef.current = true;
    openAuth(mode);

    // Clean the URL so refresh/back doesn't keep re-opening the modal
    const params = new URLSearchParams(searchParams.toString());
    ["auth", "authMode", "modal", "openAuth", "login", "register"].forEach((k) =>
      params.delete(k)
    );

    const nextQuery = params.toString();
    const nextUrl = `${window.location.pathname}${
      nextQuery ? `?${nextQuery}` : ""
    }${window.location.hash || ""}`;
    window.history.replaceState(null, "", nextUrl);
  }, [openAuth]);

  const [inputValue, setInputValue] = useState("");
  const [inputMode, setInputMode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  // Register form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // Individual field errors
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailMobileError, setEmailMobileError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(() => {
    const inCountry = (countries || []).find((c) => c.short_name === "IN");
    return (
      inCountry ||
      (countries || [])[0] || {
        short_name: "IN",
        code: "+91",
        name: "India",
        phonePattern: /^\d{10}$/,
        phoneLength: [10],
      }
    );
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const isModeChangingRef = useRef(false);

  const isValidEmail = useCallback((email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, []);

  const isValidMobile = useCallback(
    (mobile) => {
      // Remove any spaces, dashes, or parentheses
      const cleanMobile = mobile.replace(/[\s\-()]/g, "");

      // Check if it matches the selected country's pattern
      if (selectedCountry.phonePattern) {
        return selectedCountry.phonePattern.test(cleanMobile);
      }

      // Fallback to length validation
      if (selectedCountry.phoneLength) {
        return selectedCountry.phoneLength.includes(cleanMobile.length);
      }

      // Default validation - 7 to 15 digits
      return /^[0-9]{7,15}$/.test(cleanMobile);
    },
    [selectedCountry]
  );

  const getPhoneValidationMessage = () => {
    if (selectedCountry.phoneLength) {
      if (selectedCountry.phoneLength.length === 1) {
        return `Please enter a valid ${selectedCountry.phoneLength[0]}-digit mobile number for ${selectedCountry.name}`;
      } else {
        const lengths = selectedCountry.phoneLength.join(" or ");
        return `Please enter a valid ${lengths}-digit mobile number for ${selectedCountry.name}`;
      }
    }
    return `Please enter a valid mobile number for ${selectedCountry.name}`;
  };

  const handleInputChange = (e) => {
    const rawValue = e.target.value;
    const previousMode = inputMode;
    let newMode = inputMode;
    const wasFocused = e.target === document.activeElement;
    const cursorPosition = e.target.selectionStart || rawValue.length;

    // Clear errors when user starts typing
    if (error) setError("");
    if (emailMobileError) setEmailMobileError("");

    // Determine input mode based on content
    // Priority: Check for email indicators first (letters or @ symbol)
    if (rawValue.includes("@") || /[a-zA-Z]/.test(rawValue)) {
      newMode = "email";
      setInputMode("email");
      setInputValue(rawValue);
    } else if (rawValue === "") {
      newMode = "";
      setInputMode("");
      setInputValue("");
    } else if (/^\d+$/.test(rawValue)) {
      // Only digits - mobile mode
      newMode = "mobile";
      setInputMode("mobile");
      setInputValue(rawValue);
    } else {
      // Mixed characters or other - default to email mode
      newMode = "email";
      setInputMode("email");
      setInputValue(rawValue);
    }

    // If mode changed and input was focused, ensure it stays focused after re-render
    if (previousMode !== newMode && wasFocused) {
      isModeChangingRef.current = true;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            const newCursorPos = Math.min(cursorPosition, rawValue.length);
            inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
          }
          setTimeout(() => {
            isModeChangingRef.current = false;
          }, 100);
        });
      });
    }
  };

  const handleInputBlur = (e) => {
    if (isModeChangingRef.current && inputRef.current) {
      e.preventDefault();
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    if (error && inputMode === "mobile") setError("");
  };

  const validateInput = () => {
    let isValid = true;

    setFirstNameError("");
    setLastNameError("");
    setEmailMobileError("");
    setError("");

    if (authMode === "register") {
      if (!firstName.trim()) {
        setFirstNameError("Please enter your first name.");
        isValid = false;
      }
      if (!lastName.trim()) {
        setLastNameError("Please enter your last name.");
        isValid = false;
      }
    }

    if (!inputValue.trim()) {
      setEmailMobileError("Please enter your email address or mobile number.");
      isValid = false;
    } else if (inputMode === "email" && !isValidEmail(inputValue)) {
      setEmailMobileError("Please enter a valid email address.");
      isValid = false;
    } else if (inputMode === "mobile" && !isValidMobile(inputValue)) {
      setEmailMobileError(getPhoneValidationMessage());
      isValid = false;
    } else if (!inputMode) {
      setEmailMobileError("Please enter a valid email address or mobile number.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;

    const isEmail = inputMode === "email";
    let payload;

    if (isEmail) {
      payload = {
        email: inputValue.trim().toLowerCase(),
        type: "email",
      };
    } else {
      const cleanedMobile = `${selectedCountry.code}${inputValue.replace(/\s+/g, "")}`;
      payload = {
        mobile: cleanedMobile,
        type: "mobile",
      };
    }

    if (authMode === "register") {
      payload.firstName = firstName.trim();
      payload.lastName = lastName.trim();
    }

    setIsSubmitting(true);
    setError("");
    setFirstNameError("");
    setLastNameError("");
    setEmailMobileError("");

    try {
      const endpoint = authMode === "register" ? "register-user" : "login-user";

      const response = await strapiPost(endpoint, payload, themeConfig.TOKEN);

      if (response?.message) {
        setSuccessMessage("Code has been sent.");
        setTimeout(() => {
          switchToOtp(isEmail ? payload.email : payload.mobile);
          setSuccessMessage("");
        }, 1500);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        (error?.response?.data?.data && Array.isArray(error.response.data.data)
          ? error.response.data.data
              .map((err) => err.messages?.[0]?.message || err.message)
              .join(", ")
          : null) ||
        error?.message ||
        "An error occurred. Please try again.";

      setError("");
      setEmailMobileError("");

      if (
        errorMsg.includes("already exists") ||
        errorMsg.includes("does not exist") ||
        errorMsg.includes("Please login") ||
        errorMsg.includes("Please register")
      ) {
        setEmailMobileError(errorMsg);
      } else {
        setError(errorMsg);
      }

      if (error?.response?.data?.data) {
        const errorData = error.response.data.data;
        if (Array.isArray(errorData)) {
          errorData.forEach((err) => {
            if (err.path && err.path.includes("firstName")) {
              setFirstNameError(
                err.messages?.[0]?.message || "Invalid first name"
              );
            }
            if (err.path && err.path.includes("lastName")) {
              setLastNameError(
                err.messages?.[0]?.message || "Invalid last name"
              );
            }
            if (
              err.path &&
              (err.path.includes("email") || err.path.includes("mobile"))
            ) {
              setEmailMobileError(
                err.messages?.[0]?.message || "Invalid email or mobile"
              );
            }
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
    if (
      inputMode === "mobile" &&
      !/[\d@a-zA-Z]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)
    ) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (!isAuthOpen) {
      setError("");
      setFirstNameError("");
      setLastNameError("");
      setEmailMobileError("");
      setSuccessMessage("");
      setInputValue("");
      setFirstName("");
      setLastName("");
      setInputMode("");
    }
  }, [isAuthOpen]);

  useEffect(() => {
    if (isAuthOpen) {
      if (authMode === "login") {
        setFirstName("");
        setLastName("");
        setFirstNameError("");
        setLastNameError("");
      } else if (authMode === "register") {
        setError("");
        setEmailMobileError("");
      }
    }
  }, [authMode, isAuthOpen]);

  useEffect(() => {
    if (isAuthOpen) {
      const timeoutId = setTimeout(() => {
        if (authMode === "register") {
          if (firstNameRef.current) {
            firstNameRef.current.focus();
          }
        } else if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isAuthOpen, authMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".country-dropdown")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  if (authMode === "otp") {
    return (
      <CodeModal
        isOpen={isAuthOpen}
        onClose={closeAuth}
        identifier={
          inputMode === "email"
            ? inputValue.toLowerCase()
            : `${selectedCountry.code}${inputValue}`
        }
        type={inputMode === "email" ? "email" : "mobile"}
      />
    );
  }

  return (
    <Modal
      hideCloseButton={true}
      isOpen={isAuthOpen}
      onOpenChange={(open) => !open && closeAuth()}
      classNames={{ backdrop: "bg-black/50" }}
    >
      <ModalContent className="sm:p-[30px] p-5 xl:max-w-[510px] sm:max-w-[474px] w-full">
        {(onClose) => (
          <>
            <ModalHeader className="p-0 text-2xl font-bold gap-1 flex items-center justify-between w-full mb-[10px]">
              {authMode === "register" ? "Create account" : "Login"}
              <button
                onClick={onClose}
                className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
                tabIndex={-1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </ModalHeader>
            <ModalBody className="p-0 gap-0 relative">
              <p
                className={`text-gray-600 ${
                  authMode === "register" ? "sm:mb-4 mb-3" : "sm:mb-[20px] mb-5"
                }`}
              >
                {authMode === "register"
                  ? "Seamless shopping starts with a simple create account."
                  : "Seamless shopping starts with a simple login."}
              </p>

              {authMode === "register" && (
                <>
                  <div className="mb-3 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <div
                        className={`flex items-center border ${
                          firstNameError ? "border-red-500" : "border-gray-200"
                        } rounded-md py-[11px] px-2`}
                      >
                        <input
                          ref={firstNameRef}
                          type="text"
                          placeholder="Enter your first name"
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value);
                            if (firstNameError) setFirstNameError("");
                          }}
                          className="h-full w-full text-sm text-black placeholder:text-gray-400 px-2 mb-0.5 rounded-[5px] outline-none"
                          aria-label="First name"
                        />
                      </div>
                      {firstNameError && (
                        <div
                          className="mt-1 text-red-500 text-sm flex items-center gap-2"
                          role="alert"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 flex-shrink-0"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{firstNameError}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <div
                        className={`flex items-center border ${
                          lastNameError ? "border-red-500" : "border-gray-200"
                        } rounded-md py-[11px] px-2`}
                      >
                        <input
                          ref={lastNameRef}
                          type="text"
                          placeholder="Enter your last name"
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value);
                            if (lastNameError) setLastNameError("");
                          }}
                          className="h-full w-full text-sm text-black placeholder:text-gray-400 px-2 mb-0.5 rounded-[5px] outline-none"
                          aria-label="Last name"
                        />
                      </div>
                      {lastNameError && (
                        <div
                          className="mt-1 text-red-500 text-sm flex items-center gap-2"
                          role="alert"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 flex-shrink-0"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{lastNameError}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number or Email
                </label>
              </div>

              {inputMode === "mobile" ? (
                <div
                  className={`flex items-center border ${
                    emailMobileError || error ? "border-red-500" : "border-gray-200"
                  } rounded-md py-[11px] px-2 relative country-dropdown`}
                >
                  <div className="z-10">
                    <button
                      type="button"
                      onClick={toggleDropdown}
                      className="flex items-center justify-between min-w-[80px] w-auto pr-3 pl-[10px] border-r border-gray-200 bg-white uppercase hover:bg-gray-50 transition-colors"
                      tabIndex={-1}
                      aria-label="Select country code"
                    >
                      <span className="text-sm whitespace-nowrap">
                        {selectedCountry.short_name} {selectedCountry.code}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="11"
                        viewBox="0 0 9 11"
                        fill="none"
                        className={`ml-2 transition-transform duration-300 flex-shrink-0 ${
                          isDropdownOpen ? "rotate-0" : "rotate-180"
                        }`}
                      >
                        <path
                          d="M4.1612 2.31217C4.35263 2.13578 4.64737 2.13578 4.8388 2.31217L8.8388 5.9977C8.94155 6.09237 9 6.22571 9 6.36541V6.85679C9 7.29285 8.48076 7.51995 8.16057 7.22393L4.83943 4.15343C4.64781 3.97628 4.35219 3.97628 4.16057 4.15343L0.839427 7.22393C0.519237 7.51995 0 7.29285 0 6.85679V6.36541C0 6.22571 0.0584515 6.09237 0.161196 5.9977L4.1612 2.31217Z"
                          fill="#505050"
                        />
                      </svg>
                    </button>
                    {isDropdownOpen && (
                      <ul className="absolute z-20 bg-white border border-[#D9DDE2] rounded-[5px] shadow-lg max-h-36 overflow-y-auto w-[180px] left-0 top-full mt-[1px] scrollbar-custom">
                        {countries.map((country) => (
                          <li
                            key={country.short_name}
                            onClick={() => selectCountry(country)}
                            className={`cursor-pointer px-4 py-2 text-sm font-normal text-[#505050] hover:bg-gray-100 transition-colors ${
                              selectedCountry.code === country.code
                                ? "bg-primary text-white hover:bg-primary"
                                : ""
                            }`}
                          >
                            {country.name} {country.code}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter mobile number"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleInputBlur}
                    onFocus={(e) => e.target.focus()}
                    className="h-full w-full text-sm text-black placeholder:text-gray-400 px-2 mb-0.5 rounded-[5px] outline-none"
                    aria-label="Mobile number"
                  />
                </div>
              ) : (
                <div
                  className={`flex items-center border ${
                    emailMobileError || error ? "border-red-500" : "border-gray-200"
                  } rounded-md py-[11px] px-2`}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter mobile number or email"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleInputBlur}
                    onFocus={(e) => e.target.focus()}
                    className="h-full w-full text-sm text-black placeholder:text-gray-400 px-2 mb-0.5 rounded-[5px] outline-none"
                    aria-label="Email or mobile number"
                  />
                </div>
              )}

              {(emailMobileError || (error && authMode === "login")) && (
                <div className="mt-2 text-red-500 text-sm flex items-center gap-2" role="alert">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{emailMobileError || error}</span>
                </div>
              )}

              {successMessage && (
                <div className="mt-2 text-green-600 text-sm" role="status">
                  {successMessage}
                </div>
              )}

              <div className="mt-3 mb-2">
                <p className="text-sm text-gray-600">
                  {authMode === "register" ? (
                    <>
                      Already have an account?{" "}
                      <button
                        onClick={() => {
                          setFirstName("");
                          setLastName("");
                          setInputValue("");
                          setError("");
                          setFirstNameError("");
                          setLastNameError("");
                          setEmailMobileError("");
                          setSuccessMessage("");
                          openAuth("login");
                        }}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        Login
                      </button>
                    </>
                  ) : (
                    <>
                      Don't have an account?{" "}
                      <button
                        onClick={() => {
                          setInputValue("");
                          setError("");
                          setFirstNameError("");
                          setLastNameError("");
                          setEmailMobileError("");
                          setSuccessMessage("");
                          openAuth("register");
                        }}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        Create account
                      </button>
                    </>
                  )}
                </p>
              </div>

              <p className="text-sm text-gray-600 my-4">
                By continuing, you agree to WebbyTemplate’s{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/terms-and-conditions"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Terms & Conditions,
                </Link>{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/privacy-policy"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/author-terms-and-policy"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Author Policy
                </Link>
                .
              </p>

              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: "/google-auth" })}
                  className="w-full inline-flex items-center justify-center gap-3 py-3 px-4 border rounded-md hover:bg-gray-100 transition-colors"
                >
                  <img src="/assets/images/google-logo.svg" alt="Google" className="w-5 h-5" />
                  <span className="text-sm font-medium">Continue with Google</span>
                </button>
              </div>

              <Button
                className="w-full btn-primary hover:bg-blue-700 text-white hover:text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                color="primary"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Processing..."
                  : authMode === "register"
                    ? "Create account"
                    : "Send Code"}
              </Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function CodeModal({ isOpen, onClose, identifier, type }) {
  const { login } = useAuth();
  const [codeValues, setCodeValues] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const firstInputRef = useRef(null);
  const hasAutoSubmittedRef = useRef(false);
  const lastSubmittedCodeRef = useRef("");

  useEffect(() => {
    if (isOpen) {
      hasAutoSubmittedRef.current = false;
      lastSubmittedCodeRef.current = "";
      if (firstInputRef.current) {
        setTimeout(() => firstInputRef.current?.focus(), 100);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendCooldown === 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    const isComplete = codeValues.every((val) => val && /^\d$/.test(val));
    const allFilled = codeValues.length === 6 && isComplete;
    const currentCode = codeValues.join("");

    if (codeValues.every((val) => !val)) {
      hasAutoSubmittedRef.current = false;
      lastSubmittedCodeRef.current = "";
      return;
    }

    if (
      allFilled &&
      !isSubmitting &&
      !hasAutoSubmittedRef.current &&
      currentCode !== lastSubmittedCodeRef.current
    ) {
      hasAutoSubmittedRef.current = true;
      lastSubmittedCodeRef.current = currentCode;
      setTimeout(() => {
        const codeString = codeValues.join("");
        if (
          codeString.length === 6 &&
          codeValues.every((val) => val && /^\d$/.test(val))
        ) {
          handleSubmit();
        } else {
          hasAutoSubmittedRef.current = false;
          lastSubmittedCodeRef.current = "";
        }
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeValues, isSubmitting]);

  const handleCodeChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newCodeValues = [...codeValues];
    newCodeValues[index] = value;
    setCodeValues(newCodeValues);

    if (codeError) setCodeError("");

    const newCode = newCodeValues.join("");
    if (newCode !== lastSubmittedCodeRef.current) {
      hasAutoSubmittedRef.current = false;
    }

    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name=code-${index + 1}]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !codeValues[index] && index > 0) {
      const prevInput = document.querySelector(`input[name=code-${index - 1}]`);
      if (prevInput) prevInput.focus();
    }

    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const numbersOnly = e.clipboardData
      .getData("text/plain")
      .trim()
      .replace(/\D/g, "");

    const newCodeValues = [...codeValues];
    for (let i = 0; i < Math.min(numbersOnly.length, 6); i++) {
      newCodeValues[i] = numbersOnly[i];
    }
    setCodeValues(newCodeValues);

    const newCode = newCodeValues.join("");
    if (newCode !== lastSubmittedCodeRef.current) {
      hasAutoSubmittedRef.current = false;
    }

    const nextEmptyIndex = newCodeValues.findIndex((val) => !val);
    const targetIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5;
    const target = document.querySelector(`input[name=code-${targetIndex}]`);
    if (target) target.focus();
  };

  const validateCode = () => {
    if (codeValues.some((val) => !val)) {
      setCodeError("Please enter the complete 6-digit code");
      return false;
    }

    if (codeValues.some((val) => !/^\d$/.test(val))) {
      setCodeError("Code must contain only numbers");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setResendMessage("");
    if (!validateCode()) {
      return;
    }

    setIsSubmitting(true);
    const cart_id = Cookies.get("cart_id");
    const wishlist_id = Cookies.get("wishlist_id");

    try {
      const response = await strapiPost(
        "verify-otp",
        {
          [type === "email" ? "email" : "mobile"]: identifier,
          type: type,
          otp: codeValues.join(""),
          cart_id: cart_id,
          wishlist_id: wishlist_id,
        },
        themeConfig.TOKEN
      );

      if (response && response.jwt) {
        const query = {
          token: response.jwt,
          user: JSON.stringify(response.user),
        };

        const queryString = Object.entries(query)
          .filter(([_, value]) => value != null)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join("&");

        const cookieResponse = await fetch(`/api/app-auth/login?${queryString}`);

        if (cookieResponse.ok) {
          onClose();
          login();
          const currentUrl = window.location.href;
          const hasAuthorQuery = currentUrl.includes("author=true");
          const documentId = response.user?.documentId || response.user?.id;

          setTimeout(() => {
            if (hasAuthorQuery && documentId) {
              window.location.href = `/user/${documentId}/become-an-author`;
            } else {
              window.location.reload();
            }
          }, 1000);
        } else {
          throw new Error("Failed to set authentication cookies");
        }
      } else {
        setCodeError("Invalid code. Please try again.");
      }
    } catch (error) {
      setCodeError(
        error?.response?.data?.error?.message ||
          "An error occurred. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setResendMessage("");
    setCodeValues(["", "", "", "", "", ""]);
    hasAutoSubmittedRef.current = false;
    lastSubmittedCodeRef.current = "";

    try {
      const payload =
        type === "email"
          ? { email: identifier, type: "email" }
          : { mobile: identifier, type: "mobile" };

      await strapiPost("login-user", payload, themeConfig.TOKEN);

      setCodeError("");
      setResendCooldown(30);

      setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus();
        }
      }, 100);
    } catch (error) {
      setCodeError("Failed to resend code. Please try again.");
      setResendMessage("");
    }

    setTimeout(() => {
      setResendMessage("");
    }, 3000);
  };

  const maskIdentifier = (identifier) => {
    if (identifier.includes("@")) {
      const [username, domain] = identifier.split("@");
      const maskedUsername =
        username.length > 2
          ? username.slice(0, 2) + "*".repeat(username.length - 2)
          : username;
      return `${maskedUsername}@${domain}`;
    } else {
      const cleanNumber = identifier.replace(/\D/g, "");
      if (cleanNumber.length > 4) {
        return (
          cleanNumber.slice(0, 2) +
          "*".repeat(cleanNumber.length - 4) +
          cleanNumber.slice(-2)
        );
      }
      return identifier;
    }
  };

  return (
    <Modal
      hideCloseButton={true}
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      classNames={{ backdrop: "bg-black/50" }}
    >
      <ModalContent className="sm:p-[30px] p-5 xl:max-w-[510px] sm:max-w-[474px] w-full">
        {(onClose) => (
          <>
            <ModalHeader className="p-0 text-2xl font-bold gap-1 flex items-center justify-between w-full mb-[10px]">
              Welcome to WebbyTemplate
              <button
                onClick={onClose}
                className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </ModalHeader>
            <ModalBody className="p-0 gap-0">
              <p className="text-gray-600 sm:mb-[30px] mb-5">
                {identifier ? (
                  <>
                    Enter the code sent to{" "}
                    <span className="font-bold">
                      {isNaN(identifier)
                        ? maskIdentifier(identifier)
                        : `+${maskIdentifier(identifier)}`}
                    </span>
                  </>
                ) : (
                  "Seamless shopping starts with a simple login."
                )}
              </p>

              <div>
                <div className="flex justify-center md:space-x-[18px] space-x-3 mb-[18px]">
                  {codeValues.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      name={`code-${index}`}
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      ref={index === 0 ? firstInputRef : null}
                      className={`2xl:w-[60px] 2xl:h-[60px] xl:w-[55px] xl:h-[55px] md:w-[50px] md:h-[50px] w-[45px] h-[45px] text-center text-lg font-medium border ${
                        codeError ? "border-red-500" : "border-gray-200"
                      } text-black placeholder:text-gray-400 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all`}
                      aria-label={`Code digit ${index + 1}`}
                    />
                  ))}
                </div>

                {codeError && (
                  <div className="flex justify-center mb-2">
                    <div
                      className="text-red-500 text-sm flex items-center gap-2 w-full max-w-[330px] md:max-w-[384px] xl:max-w-[423px] 2xl:max-w-[468px] justify-start"
                      role="alert"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{codeError}</span>
                    </div>
                  </div>
                )}
              </div>

              {resendMessage && (
                <div className="mt-2 text-green-600 text-sm mb-2" role="status">
                  {resendMessage}
                </div>
              )}

              <div className="text-center mb-5">
                <p className="text-sm text-gray-500">
                  {"Didn't receive the code? "}
                  <button
                    className={`font-medium transition-colors ${
                      resendCooldown > 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:text-blue-800 hover:underline"
                    }`}
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0}
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend code"}
                  </button>
                </p>
              </div>

              {isSubmitting && (
                <div className="w-full text-center py-3">
                  <p className="text-sm text-gray-600">Verifying code...</p>
                </div>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

