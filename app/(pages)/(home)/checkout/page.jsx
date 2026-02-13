"use client";

import { useState, useRef, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { countries } from "@/lib/data/countries";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@heroui/react";
import { strapiGet, strapiPost } from "@/lib/api/strapiClient";
import Cookies from "js-cookie";
import { themeConfig } from "@/config/theamConfig";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { isLoading, cartItems = [], totalPrice = 0 } = useCart() || {};
  const { openAuth, authLoading, isAuthenticated } = useAuth();

  const [selectedCountryCode, setSelectedCountryCode] = useState(countries[14]); // Default to India
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("United States");

  const [filteredStates, setFilteredStates] = useState([]);
  const [stateSearchTerm, setStateSearchTerm] = useState("");
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [payNowLoading, setpayNowLoading] = useState(false);
  const [redirectLoading, setRedirectLoading] = useState(false);

  const countryRef = useRef(null);
  const stateRef = useRef(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    company_name: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    country: "",
    phone_no: "",
    agreed: false,
  });

  const [errors, setErrors] = useState({});

  // Filter states based on selected country for billing
  useEffect(() => {
    if (selectedCountry) {
      const selectedCountryData = countries.find(
        (country) => country.name === selectedCountry
      );
      if (selectedCountryData && selectedCountryData.states) {
        const countryStates = selectedCountryData.states;
        if (stateSearchTerm) {
          setFilteredStates(
            countryStates.filter((state) =>
              state.toLowerCase().includes(stateSearchTerm.toLowerCase())
            )
          );
        } else {
          setFilteredStates(countryStates);
        }

        // Only reset selected state if it's not valid for the current country
        // and if we don't have user data state
        if (
          selectedState &&
          !countryStates.includes(selectedState) &&
          !form.state
        ) {
          setSelectedState("");
          setForm((prev) => ({ ...prev, state: "" }));
        }
      } else {
        setFilteredStates([]);
        // Only reset if we don't have user data
        if (!form.state) {
          setSelectedState("");
          setForm((prev) => ({ ...prev, state: "" }));
        }
      }
    } else {
      setFilteredStates([]);
    }
  }, [selectedCountry, stateSearchTerm]); // Remove selectedState from dependencies to avoid infinite loops

  useEffect(() => {
    const fetchLoginUserData = async () => {
      const authToken = Cookies.get("authToken");
      if (!authToken) {
        setUserDataLoading(false);
        return;
      }

      try {
        const userData = await strapiGet("users/me", {
          params: { populate: "*" },
          token: authToken,
        });

        if (userData) {
          // Use billing fields for checkout form; fallback to profile fields
          const billingPhone = userData.billing_phone_no || userData.phone_no || "";
          let phoneNumber = billingPhone;
          let detectedCountry = null;

          // Try to detect country from phone number
          if (
            phoneNumber &&
            typeof phoneNumber === "string" &&
            phoneNumber.startsWith("+")
          ) {
            // Find country by dial code
            for (const country of countries) {
              if (
                country.dialCode &&
                phoneNumber.startsWith(country.dialCode)
              ) {
                detectedCountry = country;
                // Remove country code from phone number
                phoneNumber = phoneNumber.replace(country.dialCode, "").trim();
                break;
              }
            }
          }

          // Validate phone number format
          if (phoneNumber) {
            // Remove any non-digit characters
            phoneNumber = phoneNumber.replace(/\D/g, "");
          }

          // Set country: from phone dial code, then billing_country, then default India
          if (detectedCountry) {
            setSelectedCountry(detectedCountry.name);
            setSelectedCountryCode(detectedCountry);
          } else if (userData.billing_country) {
            const billingCountryObj = countries.find(
              (c) => c.name === userData.billing_country
            );
            if (billingCountryObj) {
              setSelectedCountry(billingCountryObj.name);
              setSelectedCountryCode(billingCountryObj);
              detectedCountry = billingCountryObj;
            } else {
              const indiaCountry = countries.find((c) => c.name === "India");
              if (indiaCountry) {
                setSelectedCountry("India");
                setSelectedCountryCode(indiaCountry);
              } else if (countries[0]) {
                setSelectedCountry(countries[0].name);
                setSelectedCountryCode(countries[0]);
              }
            }
          } else {
            // Default to India
            const indiaCountry = countries.find((c) => c.name === "India");
            if (indiaCountry) {
              setSelectedCountry("India");
              setSelectedCountryCode(indiaCountry);
            } else {
              console.error("India country data not found in countries list");
              const firstCountry = countries[0];
              if (firstCountry) {
                setSelectedCountry(firstCountry.name);
                setSelectedCountryCode(firstCountry);
              }
            }
          }

          const formCountry =
            detectedCountry?.name ||
            userData.billing_country ||
            "India";

          // Set form data with proper validation (billing_email, billing_phone_no, billing_country)
          setForm({
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            company_name: userData.company_name || "",
            email: userData.billing_email || userData.email || "",
            address: userData.address || "",
            city: userData.city || "",
            pincode: userData.pincode || "",
            state: userData.state || "",
            country: formCountry,
            phone_no: phoneNumber || "",
            gst_number: userData.gst_number || "",
            agreed: false,
          });

          // Set state if available and country is set
          if (userData.state && (detectedCountry?.name || "India")) {
            const currentCountry =
              detectedCountry || countries.find((c) => c.name === "India");
            if (currentCountry?.states?.includes(userData.state)) {
              setTimeout(() => {
                setSelectedState(userData.state);
              }, 100);
            } else {
              console.warn(
                `State ${userData.state} not found in country ${currentCountry?.name}`
              );
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Set default values in case of error
        const indiaCountry = countries.find((c) => c.name === "India");
        if (indiaCountry) {
          setSelectedCountry("India");
          setSelectedCountryCode(indiaCountry);
        }
        setForm((prev) => ({
          ...prev,
          country: "India",
          phone_no: "",
        }));
      } finally {
        setUserDataLoading(false);
      }
    };

    const authToken = Cookies.get("authToken");
    if (authToken) {
      fetchLoginUserData();
    } else {
      setUserDataLoading(false);
    }
  }, []);

  const toggleCountryDropdown = () =>
    setIsCountryDropdownOpen(!isCountryDropdownOpen);
  const toggleStateDropdown = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsStateDropdownOpen(!isStateDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
        setCountrySearchTerm("");
      }
      if (stateRef.current && !stateRef.current.contains(event.target)) {
        setIsStateDropdownOpen(false);
        setStateSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone, countryCode) => {
    if (!phone || !countryCode) return false;

    const country = countries.find((c) => c.code === countryCode.code);
    if (!country) return false;

    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, "");

    // Check if phone length matches expected length for the country
    const isValidLength = country.phoneLength.includes(cleanPhone.length);
    const isValidPattern = country.phonePattern.test(cleanPhone);

    return isValidLength && isValidPattern;
  };

  const validateZipCode = (zip, countryName) => {
    if (!zip) return false;

    const zipPatterns = {
      "United States": /^\d{5}(-\d{4})?$/,
      Canada: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/,
      "United Kingdom": /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
      India: /^\d{6}$/,
      Germany: /^\d{5}$/,
      France: /^\d{5}$/,
      Australia: /^\d{4}$/,
      Japan: /^\d{3}-\d{4}$/,
      Brazil: /^\d{5}-?\d{3}$/,
      China: /^\d{6}$/,
    };

    const pattern = zipPatterns[countryName];
    if (pattern) {
      return pattern.test(zip);
    }

    // Default validation for other countries (3-10 alphanumeric characters)
    return /^[A-Za-z0-9\s-]{3,10}$/.test(zip);
  };

  const validateForm = () => {
    const newErrors = {};

    // Helper function to safely get string value
    const getStringValue = (value) => {
      return value != null ? String(value) : "";
    };

    // Name validations
    const firstName = getStringValue(form.first_name).trim();
    if (!firstName) {
      newErrors.first_name = "First name is required.";
    } else if (firstName.length < 2) {
      newErrors.first_name = "First name must be at least 2 characters.";
    } else if (!/^[a-zA-Z\s]+$/.test(firstName)) {
      newErrors.first_name = "First name can only contain letters and spaces.";
    }

    const lastName = getStringValue(form.last_name).trim();
    if (!lastName) {
      newErrors.last_name = "Last name is required.";
    } else if (lastName.length < 2) {
      newErrors.last_name = "Last name must be at least 2 characters.";
    } else if (!/^[a-zA-Z\s]+$/.test(lastName)) {
      newErrors.last_name = "Last name can only contain letters and spaces.";
    }

    // Company validation (optional but if provided, should be valid)
    const companyName = getStringValue(form.company_name).trim();
    if (companyName && companyName.length < 2) {
      newErrors.company_name = "Company name must be at least 2 characters.";
    }

    // Email validation
    const email = getStringValue(form.email).trim();
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Address validation
    const address = getStringValue(form.address).trim();
    if (!address) {
      newErrors.address = "Street address is required.";
    } else if (address.length < 5) {
      newErrors.address = "Please enter a complete address.";
    }

    // City validation
    const city = getStringValue(form.city).trim();
    if (!city) {
      newErrors.city = "City is required.";
    } else if (city.length < 2) {
      newErrors.city = "City name must be at least 2 characters.";
    } else if (!/^[a-zA-Z\s.-]+$/.test(city)) {
      newErrors.city =
        "City name can only contain letters, spaces, dots, and hyphens.";
    }

    // ZIP code validation
    const pincode = getStringValue(form.pincode).trim();
    if (!pincode) {
      newErrors.pincode = "ZIP/Postal code is required.";
    } else if (!validateZipCode(pincode, selectedCountry)) {
      newErrors.pincode = `Please enter a valid ZIP/Postal code for ${selectedCountry || "the selected country"}.`;
    }

    // State validation
    const state = getStringValue(form.state).trim();
    if (!state) {
      newErrors.state = "State/Province is required.";
    }

    // Country validation
    const country = getStringValue(form.country).trim();
    if (!country) {
      newErrors.country = "Country is required.";
    }

    // Phone validation with better error handling
    const phoneNo = getStringValue(form.phone_no).trim();
    if (!phoneNo) {
      newErrors.phone_no = "Phone number is required.";
    } else {
      const selectedCountryData = countries.find(
        (c) => c.name === selectedCountry
      );
      if (selectedCountryData) {
        const cleanPhone = phoneNo.replace(/\D/g, "");
        const isValidLength = selectedCountryData.phoneLength.includes(
          cleanPhone.length
        );
        const isValidPattern =
          selectedCountryData.phonePattern.test(cleanPhone);

        if (!isValidLength || !isValidPattern) {
          const expectedLength = selectedCountryData.phoneLength.join(" or ");
          newErrors.phone_no = `Please enter a valid phone number (${expectedLength} digits) for ${selectedCountryData.name}.`;
        }
      } else {
        newErrors.phone_no = "Please select a valid country first.";
      }
    }

    // if (selectedCountry === "India") {
    //   const gstNumber = getStringValue(form.gst_number).trim();
    //   if (
    //     gstNumber &&
    //     !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
    //       gstNumber
    //     )
    //   ) {
    //     newErrors.gst_number = "Please enter a valid GST number.";
    //   }
    // }

    // Terms agreement validation
    if (!form.agreed) {
      newErrors.agreed =
        "You must agree to the Terms of Service and Privacy Policy.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // razorpay form append with optimized loading
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {};
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
    };
    document.head.appendChild(script); // Append to head instead of body

    // Cleanup function
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // handle pay button with sripe and razorpay integration

  const handlePayNow = async () => {
    setpayNowLoading(true);
    setRedirectLoading(false); // Reset redirect loading

    if (!isAuthenticated) {
      openAuth("login");
      setpayNowLoading(false);
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      router.push("/");
      setpayNowLoading(false);
      return;
    }

    const isBillingValid = validateForm();
    if (!isBillingValid) {
      console.warn("Billing form is invalid.");
      setpayNowLoading(false);
      return;
    }

    const getStringValue = (value) =>
      typeof value === "string"
        ? value.trim()
        : value
          ? String(value).trim()
          : "";

    const cart_id = Cookies.get("cart_id");
    const authUserStr = Cookies.get("authUser");

    if (!cart_id || !authUserStr) {
      console.error("Missing cart_id or user info.");
      setpayNowLoading(false);
      return;
    }

    let authUser;
    try {
      authUser = JSON.parse(authUserStr);
      if (!authUser?.id) throw new Error("Invalid user ID.");
    } catch (err) {
      console.error("Failed to parse user data:", err.message);
      setpayNowLoading(false);
      return;
    }

    // Fire order_place tracking with real user_id
    try {
      const { trackOrderPlaced } = await import("@/lib/utils/trackUser");
      trackOrderPlaced({ user_id: authUser.id });
    } catch (e) {
      // silently ignore tracking errors
    }

    const phoneCode = filteredflag?.[0]?.dialCode || "";
    const phoneNumber = getStringValue(form.phone_no);
    const fullPhone = phoneCode + phoneNumber;

    const shippingAddress = {
      first_name: getStringValue(form.first_name),
      last_name: getStringValue(form.last_name),
      company_name: getStringValue(form.company_name),
      email: getStringValue(form.email),
      address: getStringValue(form.address),
      city: getStringValue(form.city),
      pincode: getStringValue(form.pincode),
      state: getStringValue(form.state),
      country: getStringValue(form.country),
      phone_no: fullPhone,
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingAddress.email)) {
      console.warn("Invalid email format.");
      return;
    }

    const checkoutData = {
      user: authUser.id,
      cart_id,
      shipping_address: shippingAddress,
    };

    try {
      // 1. Create order in Strapi (your Orders collection)
      const response = await strapiPost(
        "orders",
        checkoutData,
        themeConfig.TOKEN
      );

      if (response?.result && response?.data) {
        const orderData = response.data;

        // Set redirect loading when payment process starts
        setRedirectLoading(true);
        setpayNowLoading(false);

        // 2. Create Razorpay order in backend
        if (selectedCountry === "India") {
          // ✅ Razorpay Flow
          const razorpayOrderRes = await strapiPost("razorpay/create-order", {
            amount: orderData.total_price + orderData.tax_amount || 500, // ₹500 = 50000 paise
            strapi_order_id: orderData.id,
            user_id: orderData?.user?.id,
          });
          const razorpayOrder = razorpayOrderRes.order;
          const razorpayKey = razorpayOrderRes.key_id;
          // 3. Setup Razorpay options
          const options = {
            key: razorpayKey, // From backend
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: "WebbyTemplate",
            description: "Order Payment",
            order_id: razorpayOrder.id,
            handler: async function (razorpayResponse) {
              // Keep redirect loading active during verification
              try {
                // 4. Verify payment
                await strapiPost("razorpay/verify", {
                  ...razorpayResponse,
                  strapi_order_id: orderData.id,
                  user_id: orderData?.user?.id,
                });
                // Give the overlay a frame to render before navigation
                setTimeout(() => {
                  router.push(`/thank-you/${orderData?.documentId}`);
                }, 100);
              } catch (e) {
                console.error("Verification failed:", e);
                setRedirectLoading(false);
                setpayNowLoading(false);
              }
            },
            modal: {
              ondismiss: function () {
                // 🚫 User closed popup without doing anything
                setRedirectLoading(false);
                setpayNowLoading(false);
                router.push("/");
              },
            },
            prefill: {
              name: "Webby Template",
              email: "webby@example.com",
              contact: "9876543210",
            },
            theme: {
              color: "#3399cc",
            },
          };
          // 5. Open Razorpay Checkout
          const rzp = new Razorpay(options);

          rzp.on("payment.failed", async function (response) {
            const orderId = response.error.metadata?.order_id;

            if (orderId) {
              await strapiPost("razorpay/fail", {
                razorpay_order_id: orderId,
                reason: response.error.description || "Payment failed",
                strapi_order_id: orderData.id,
              });
            }

            setRedirectLoading(false);
            setpayNowLoading(false);
          });

          rzp.open();
        } else {
          // ✅ Stripe Flow
          const stripeRes = await strapiPost("stripe/create-checkout-session", {
            amount: orderData.total_price,
            strapi_order_id: orderData.id, // ✅ Required for metadata
            user_id: orderData.user?.id,
            redirect_id: orderData?.documentId,
          });

          if (stripeRes?.url) {
            // Keep redirect loading active for Stripe redirect
            window.location.href = stripeRes.url;
          } else {
            throw new Error("Stripe session creation failed");
          }
        }
      } else {
        setpayNowLoading(false);
        setRedirectLoading(false);
      }
    } catch (error) {
      console.error("❌ Payment Error:", error);
      setpayNowLoading(false);
      setRedirectLoading(false);
    }
  };

  const handleStateSelect = (state, e) => {
    // Prevent event propagation to avoid dropdown toggle conflicts
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Update state in a single batch to prevent race conditions
    setSelectedState(state);
    setForm((prev) => ({ ...prev, state: state }));
    setStateSearchTerm("");
    setErrors((prev) => ({ ...prev, state: "" }));

    // Close dropdown after a small delay to ensure state is set
    setTimeout(() => {
      setIsStateDropdownOpen(false);
    }, 50);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setForm((prev) => ({ ...prev, country: country }));
    setIsCountryDropdownOpen(false);
    setCountrySearchTerm("");
    setErrors((prev) => ({ ...prev, country: "" }));
  };

  const inputClass = (name) =>
    `p2 border ${errors[name] ? "border-red-500" : "border-gray-100"} text-gray-300 placeholder:text-gray-300 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full outline-none`;

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  const filteredflag = countries.filter((country) =>
    country.name.toLowerCase().includes(selectedCountry.toLowerCase())
  );

  // Show loading state while checking cart
  if (userDataLoading || isLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render the component if cart is empty (will redirect)
  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  return (
    <div className="container px-4 py-8">
      {redirectLoading && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] backdrop-blur-sm">
          <div className="text-white p-8 bg-gray-900/95 rounded-xl shadow-2xl text-center min-w-[300px] max-w-[400px] mx-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold mb-2">
              Processing Payment...
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Please wait while we confirm your payment and redirect you to the
              confirmation page.
            </p>
            <div className="flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Login prompt for returning customers */}
      {!authLoading && !isAuthenticated && (
        // <div className="m-3">
          <div className="text-lg w-full rounded-1xl border border-green-100 font-bold leading-tight bg-[#d8efff] p-4 pr-8 relative">
            Returning customer?{" "}
            <button
              onClick={() => openAuth("login")}
              className="underline underline-offset-1"
            >
              Click here to login
            </button>
          </div>
        // </div>
      )}

      {/* Show user status if authenticated */}

      {/* {!authLoading && isAuthenticated && (
        <div className="m-3">
          <div className="text-lg w-full rounded-1xl border border-green-100 font-bold leading-tight bg-[#e8f5e8] p-4 pr-8 relative">
            ✓ You are logged in and ready to checkout
          </div>
        </div>
      )} */}

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
              <label className="p2 !text-black pb-1.5 block">First name *</label>
              <input
                type="text"
                placeholder="First Name"
                value={form.first_name || ""}
                onChange={(e) => handleChange("first_name", e.target.value)}
                className={inputClass("first_name")}
                maxLength={50}
              />
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
              )}
            </div>

            {/* gst number field */}
            {/* {selectedCountry === "India" && (
              <div>
                <label className="p2 !text-black pb-1.5 block">GST Number</label>
                <input
                  type="text"
                  placeholder="GST Number"
                  value={form.gst_number || ""}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  className={inputClass("first_name")}
                  maxLength={50}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.first_name}
                  </p>
                )}
              </div>
            )} */}

            {/* gst number field */}

            {/* Last Name */}
            <div>
              <label className="p2 !text-black pb-1.5 block">Last name *</label>
              <input
                type="text"
                placeholder="Last Name"
                value={form.last_name || ""}
                onChange={(e) => handleChange("last_name", e.target.value)}
                className={inputClass("last_name")}
                maxLength={50}
              />
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
              )}
            </div>

            {/* email for other country */}
            {selectedCountry !== "India" && (
              <div>
                <label className="p2 !text-black pb-1.5 block">Email *</label>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={inputClass("email")}
                  maxLength={100}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            )}

            {/* Company Name */}
            <div>
              <label className="p2 !text-black pb-1.5 block">
                Company name (optional)
              </label>
              <input
                type="text"
                placeholder="Company Name"
                value={form.company_name || ""}
                onChange={(e) => handleChange("company_name", e.target.value)}
                className={inputClass("company_name")}
                maxLength={100}
              />
              {errors.company_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.company_name}
                </p>
              )}
            </div>

            {selectedCountry === "India" && (
              <div>
                <label className="p2 !text-black pb-1.5 block">GST Number</label>
                <input
                  type="text"
                  placeholder="GST Number"
                  value={form.gst_number || ""}
                  onChange={(e) => handleChange("gst_number", e.target.value)} // ✅
                  className={inputClass("gst_number")} // ✅
                  maxLength={50}
                />
                {/* {errors.gst_number && ( // ✅
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gst_number}
                  </p>
                )} */}
              </div>
            )}

            {/* Country Dropdown */}
            <div className="relative" ref={countryRef}>
              <label className="p2 !text-black pb-1.5 block">Country *</label>
              <div className="relative">
                <div
                  className={`border p2 ${errors.country ? "border-red-500" : "border-gray-100"} text-gray-300 placeholder:text-gray-300 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full cursor-pointer flex justify-between items-center`}
                  onClick={toggleCountryDropdown}
                >
                  <div className="relative w-full flex gap-2 items-center justify-start cursor-pointer">
                    {filteredflag?.[0] && (
                      <Image
                        src={filteredflag?.[0]?.flag || ""}
                        alt={`${selectedCountry} flag`}
                        width={30}
                        height={30}
                        className="rounded-sm !drop-shadow-2xl"
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

                {/* Dropdown Menu */}
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
                          key={country.code}
                          onClick={() => handleCountrySelect(country.name)}
                          className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer flex items-center gap-2"
                        >
                          <Image
                            src={
                              country.flag ||
                              "/placeholder.svg?height=14&width=20"
                            }
                            alt={`${country.name} flag`}
                            width={20}
                            height={14}
                            className="rounded-sm"
                          />
                          {country.name}
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

              {errors.country && (
                <p className="text-red-500 text-xs mt-1">{errors.country}</p>
              )}
            </div>

            {/* State Dropdown */}
            <div className="relative" ref={stateRef}>
              <label className="p2 !text-black pb-1.5 block">
                State/Province *
              </label>
              <div className="relative">
                <div
                  className={`border p2 ${errors.state ? "border-red-500" : "border-gray-100"} !text-gray-300 placeholder:!text-gray-300 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full ${selectedCountry ? "cursor-pointer" : "cursor-not-allowed opacity-50"} flex justify-between items-center`}
                  onClick={(e) =>
                    selectedCountry ? toggleStateDropdown(e) : null
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

                {/* Dropdown Menu */}
                {isStateDropdownOpen && (
                  <div className="p2 absolute left-0 right-0 mt-1 border border-gray-100 bg-white rounded-b-md shadow-lg z-10 max-h-60 overflow-hidden">
                    <div className="p-2 border-b border-gray-100">
                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={stateSearchTerm}
                        onChange={(e) => setStateSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded text-sm outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <ul className="text-gray-800 max-h-40 overflow-y-auto">
                      {filteredStates.map((state, index) => (
                        <li
                          key={state}
                          onClick={(e) => handleStateSelect(state, e)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
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

              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="p2 !text-black pb-1.5 block">Town/City *</label>
              <input
                type="text"
                placeholder="City"
                value={form.city || ""}
                onChange={(e) => handleChange("city", e.target.value)}
                className={inputClass("city")}
                maxLength={50}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>

            {/* ZIP/Postal Code */}
            <div>
              <label className="p2 !text-black pb-1.5 block">
                Postcode / ZIP *
              </label>
              <input
                type="text"
                placeholder="ZIP/Postal Code"
                value={form.pincode || ""}
                onChange={(e) => handleChange("pincode", e.target.value)}
                className={inputClass("pincode")}
                maxLength={20}
              />
              {errors.pincode && (
                <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="p2 !text-black pb-1.5 block">
                Street address *
              </label>
              <input
                type="text"
                placeholder="Street Address"
                value={form.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                className={inputClass("address")}
                maxLength={200}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            {/* Email Address */}
            {selectedCountry === "India" && (
              <div>
                <label className="p2 !text-black pb-1.5 block">Email *</label>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={inputClass("email")}
                  maxLength={100}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            )}

            {/* Phone Number */}
            <div>
              <label className="p2 !text-black block">Phone Number *</label>
              <div
                className={`flex items-center border rounded-md overflow-visible py-[11px] px-2 bg-white ${
                  errors.phone_no ? "border-red-500" : "border-gray-100"
                }`}
              >
                {/* Custom flag-only dropdown */}
                <Listbox
                  // value={selectedCountry}
                  // onChange={setSelectedCountryCode}
                  className="border-r border-gray-100 pr-[10px]"
                >
                  <div className="relative">
                    <Listbox.Button className="relative w-full flex items-center justify-center cursor-pointer">
                      <Image
                        src={
                          filteredflag?.[0]?.flag ||
                          "/placeholder.svg?height=16&width=24"
                        }
                        alt={`${filteredflag?.[0]?.name} flag`}
                        width={24}
                        height={16}
                        className="rounded-sm mr-2"
                      />
                      <span className="text-xs text-gray-600 mr-1">
                        {filteredflag?.[0]?.dialCode}
                      </span>
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
                    {/* <Listbox.Options className="absolute mt-3 rounded shadow-xl left-0 z-20 w-80 py-1 outline-none border-gray-100 border bg-white max-h-60 overflow-y-auto">
                      {countries.map((country) => (
                        <Listbox.Option
                          key={country.code}
                          value={country}
                          className="flex items-center cursor-pointer py-2 px-3 hover:bg-gray-100"
                        >
                          <Image
                            src={country.flag || "/placeholder.svg?height=14&width=20"}
                            alt={`${country.name} flag`}
                            width={20}
                            height={14}
                            className="rounded-sm mr-3"
                          />
                          <span className="text-sm mr-2">{country.dialCode}</span>
                          <span className="text-sm">{country.name}</span>
                        </Listbox.Option>
                      ))}
                    </Listbox.Options> */}
                  </div>
                </Listbox>

                {/* Phone number input */}
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone_no || ""}
                  onChange={(e) => {
                    // Only allow digits
                    const value = e.target.value.replace(/\D/g, "");
                    handleChange("phone_no", value);
                  }}
                  className="outline-none w-full ml-2 text-gray-200"
                  maxLength={15}
                />
              </div>
              {errors.phone_no && (
                <p className="text-red-500 text-xs mt-1">{errors.phone_no}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Expected format: {filteredflag?.[0]?.phoneLength.join(" or ")}{" "}
                digits
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {/* Terms Agreement */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={form.agreed}
                onChange={(e) => handleChange("agreed", e.target.checked)}
                className="mt-1 xl:w-5 xl:h-5 w-4 h-4 border-gray-100"
              />
              <label htmlFor="terms" className="font-medium cursor-pointer">
                I agree to the{" "}
                <a href="#" className="text-primary ml-1">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary ml-1">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.agreed && (
              <p className="text-red-500 text-xs mt-1 ml-8">{errors.agreed}</p>
            )}
          </div>

          <Button
            onPress={handlePayNow}
            className="group btn btn-primary flex items-center justify-center gap-[10px] w-[220px] xl:!py-[11px] py-[10px] h-auto sm:mt-7 mt-5"
            isLoading={payNowLoading || isLoading}
            disabled={payNowLoading || isLoading}
          >
            {payNowLoading
              ? "Paying..."
              : isLoading
                ? "Loading cart..."
                : !isAuthenticated
                  ? "Login to Pay"
                  : "Pay Now"}
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

          {/* Authentication status message */}
          {!isAuthenticated && (
            <p className="text-sm text-gray-600 mt-2">
              You need to be logged in to complete your purchase. Click the
              button above to login or register.
            </p>
          )}
        </div>

        {/* Cart Total */}
        <div className="md:space-y-4 space-y-2 divide-y divide-primary/10">
          <h4>Your Cart Total</h4>
          <div className="text-sm text-gray-700 sm:space-y-4 space-y-2 mt-[18px] mb-[22px] pt-[18px]">
            {cartItems?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex justify-between py-1 1xl:gap-20 xl:gap-12 gap-4"
                >
                  <span className="p2 hover:text-primary">
                    <Link href={`/product/${item?.product?.slug}`}>
                      {item?.product?.title}
                    </Link>
                  </span>
                  <span className="p2 !text-black !font-medium">
                    ${item?.total?.toFixed(2)}
                  </span>
                  {/* <span className="p2">GST ()</span> */}
                </div>
              );
            })}
            {selectedCountry === "India" && (
              <div className="flex justify-between py-1 1xl:gap-20 xl:gap-12 gap-4">
                <span className="p2">GST (18%)</span>

                <span className="p2 !text-black !font-medium">
                  ${(totalPrice * 0.18)?.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between py-2 font-semibold">
              <p className="font-medium !text-black">Total</p>
              <p className="font-medium !text-black">
                {selectedCountry === "India"
                  ? (totalPrice + totalPrice * 0.18).toFixed(2)
                  : totalPrice.toFixed(2)}
              </p>
            </div>
            {/* <div className="flex items-center gap-2 xl:mt-2">
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
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
