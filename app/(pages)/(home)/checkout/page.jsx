"use client"

import { useState, useRef, useEffect } from "react"
import { Listbox } from "@headlessui/react"
import Image from "next/image"
import { useCart } from "@/contexts/CartContext"
import { useRouter } from "next/navigation"
import { countries } from "@/lib/data/countries"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@heroui/react"

export default function CheckoutPage() {
  const router = useRouter()
  const { isLoading, cartItems = [], totalPrice = 0 } = useCart() || {}
  const { openAuth, authLoading, isAuthenticated } = useAuth()

  const [selectedCountryCode, setSelectedCountryCode] = useState(countries[14]) // Default to India
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false)
  const [selectedState, setSelectedState] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [filteredStates, setFilteredStates] = useState([])
  const [stateSearchTerm, setStateSearchTerm] = useState("")
  const [countrySearchTerm, setCountrySearchTerm] = useState("")

  const countryRef = useRef(null)
  const stateRef = useRef(null)

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
  })

  const [shippingForm, setShippingForm] = useState({
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
  })

  const [showShippingForm, setShowShippingForm] = useState(false)
  const [shippingSelectedState, setShippingSelectedState] = useState("")
  const [shippingSelectedCountry, setShippingSelectedCountry] = useState("")
  const [shippingSelectedCountryCode, setShippingSelectedCountryCode] = useState(countries[14])
  const [shippingErrors, setShippingErrors] = useState({})
  const [isShippingCountryDropdownOpen, setIsShippingCountryDropdownOpen] = useState(false)
  const [isShippingStateDropdownOpen, setIsShippingStateDropdownOpen] = useState(false)
  const [shippingCountrySearchTerm, setShippingCountrySearchTerm] = useState("")
  const [shippingStateSearchTerm, setShippingStateSearchTerm] = useState("")
  const [filteredShippingStates, setFilteredShippingStates] = useState([])

  const shippingCountryRef = useRef(null)
  const shippingStateRef = useRef(null)

  const [errors, setErrors] = useState({})

  // Redirect to home if cart is empty
  useEffect(() => {
    if (!isLoading && cartItems.length === 0) {
      console.log("Cart is empty, redirecting to home page...")
      router.push("/")
    }
  }, [cartItems, isLoading, router])

  // Filter states based on selected country for billing
  useEffect(() => {
    if (selectedCountry) {
      const selectedCountryData = countries.find((country) => country.name === selectedCountry)
      if (selectedCountryData && selectedCountryData.states) {
        const countryStates = selectedCountryData.states
        if (stateSearchTerm) {
          setFilteredStates(
            countryStates.filter((state) => state.toLowerCase().includes(stateSearchTerm.toLowerCase())),
          )
        } else {
          setFilteredStates(countryStates)
        }
      } else {
        setFilteredStates([])
      }
      // Reset selected state when country changes
      setSelectedState("")
      setForm((prev) => ({ ...prev, state: "" }))
    } else {
      setFilteredStates([])
    }
  }, [selectedCountry, stateSearchTerm])

  // Filter states based on selected country for shipping
  useEffect(() => {
    if (shippingSelectedCountry) {
      const selectedCountryData = countries.find((country) => country.name === shippingSelectedCountry)
      if (selectedCountryData && selectedCountryData.states) {
        const countryStates = selectedCountryData.states
        if (shippingStateSearchTerm) {
          setFilteredShippingStates(
            countryStates.filter((state) => state.toLowerCase().includes(shippingStateSearchTerm.toLowerCase())),
          )
        } else {
          setFilteredShippingStates(countryStates)
        }
      } else {
        setFilteredShippingStates([])
      }
      // Reset selected state when country changes
      setShippingSelectedState("")
      setShippingForm((prev) => ({ ...prev, state: "" }))
    } else {
      setFilteredShippingStates([])
    }
  }, [shippingSelectedCountry, shippingStateSearchTerm])

  const toggleCountryDropdown = () => setIsCountryDropdownOpen(!isCountryDropdownOpen)
  const toggleStateDropdown = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsStateDropdownOpen(!isStateDropdownOpen)
  }
  const toggleShippingCountryDropdown = () => setIsShippingCountryDropdownOpen(!isShippingCountryDropdownOpen)
  const toggleShippingStateDropdown = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsShippingStateDropdownOpen(!isShippingStateDropdownOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false)
        setCountrySearchTerm("")
      }
      if (stateRef.current && !stateRef.current.contains(event.target)) {
        setIsStateDropdownOpen(false)
        setStateSearchTerm("")
      }
      if (shippingCountryRef.current && !shippingCountryRef.current.contains(event.target)) {
        setIsShippingCountryDropdownOpen(false)
        setShippingCountrySearchTerm("")
      }
      if (shippingStateRef.current && !shippingStateRef.current.contains(event.target)) {
        setIsShippingStateDropdownOpen(false)
        setShippingStateSearchTerm("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone, countryCode) => {
    if (!phone || !countryCode) return false

    const country = countries.find((c) => c.code === countryCode.code)
    if (!country) return false

    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, "")

    // Check if phone length matches expected length for the country
    const isValidLength = country.phoneLength.includes(cleanPhone.length)
    const isValidPattern = country.phonePattern.test(cleanPhone)

    return isValidLength && isValidPattern
  }

  const validateZipCode = (zip, countryName) => {
    if (!zip) return false

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
    }

    const pattern = zipPatterns[countryName]
    if (pattern) {
      return pattern.test(zip)
    }

    // Default validation for other countries (3-10 alphanumeric characters)
    return /^[A-Za-z0-9\s-]{3,10}$/.test(zip)
  }

  const validateForm = () => {
    const newErrors = {}

    // Name validations
    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required."
    } else if (form.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters."
    } else if (!/^[a-zA-Z\s]+$/.test(form.firstName.trim())) {
      newErrors.firstName = "First name can only contain letters and spaces."
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required."
    } else if (form.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters."
    } else if (!/^[a-zA-Z\s]+$/.test(form.lastName.trim())) {
      newErrors.lastName = "Last name can only contain letters and spaces."
    }

    // Company validation (optional but if provided, should be valid)
    if (form.company.trim() && form.company.trim().length < 2) {
      newErrors.company = "Company name must be at least 2 characters."
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required."
    } else if (!validateEmail(form.email.trim())) {
      newErrors.email = "Please enter a valid email address."
    }

    // Address validation
    if (!form.address.trim()) {
      newErrors.address = "Street address is required."
    } else if (form.address.trim().length < 5) {
      newErrors.address = "Please enter a complete address."
    }

    // City validation
    if (!form.city.trim()) {
      newErrors.city = "City is required."
    } else if (form.city.trim().length < 2) {
      newErrors.city = "City name must be at least 2 characters."
    } else if (!/^[a-zA-Z\s.-]+$/.test(form.city.trim())) {
      newErrors.city = "City name can only contain letters, spaces, dots, and hyphens."
    }

    // ZIP code validation
    if (!form.zip.trim()) {
      newErrors.zip = "ZIP/Postal code is required."
    } else if (!validateZipCode(form.zip.trim(), selectedCountry)) {
      newErrors.zip = `Please enter a valid ZIP/Postal code for ${selectedCountry || "the selected country"}.`
    }

    // State validation
    if (!form.state.trim()) {
      newErrors.state = "State/Province is required."
    }

    // Country validation
    if (!form.country.trim()) {
      newErrors.country = "Country is required."
    }

    // Phone validation
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required."
    } else if (!validatePhone(form.phone.trim(), selectedCountryCode)) {
      const country = countries.find((c) => c.code === selectedCountryCode.code)
      const expectedLength = country ? country.phoneLength.join(" or ") : "10"
      newErrors.phone = `Please enter a valid phone number (${expectedLength} digits) for ${selectedCountryCode.name}.`
    }

    // Terms agreement validation
    if (!form.agreed) {
      newErrors.agreed = "You must agree to the Terms of Service and Privacy Policy."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateShippingForm = () => {
    if (!showShippingForm) return true // Skip validation if shipping form is not shown

    const newErrors = {}

    // Name validations
    if (!shippingForm.firstName.trim()) {
      newErrors.firstName = "First name is required."
    } else if (shippingForm.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters."
    } else if (!/^[a-zA-Z\s]+$/.test(shippingForm.firstName.trim())) {
      newErrors.firstName = "First name can only contain letters and spaces."
    }

    if (!shippingForm.lastName.trim()) {
      newErrors.lastName = "Last name is required."
    } else if (shippingForm.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters."
    } else if (!/^[a-zA-Z\s]+$/.test(shippingForm.lastName.trim())) {
      newErrors.lastName = "Last name can only contain letters and spaces."
    }

    // Company validation (optional but if provided, should be valid)
    if (shippingForm.company.trim() && shippingForm.company.trim().length < 2) {
      newErrors.company = "Company name must be at least 2 characters."
    }

    // Email validation
    if (!shippingForm.email.trim()) {
      newErrors.email = "Email is required."
    } else if (!validateEmail(shippingForm.email.trim())) {
      newErrors.email = "Please enter a valid email address."
    }

    // Address validation
    if (!shippingForm.address.trim()) {
      newErrors.address = "Street address is required."
    } else if (shippingForm.address.trim().length < 5) {
      newErrors.address = "Please enter a complete address."
    }

    // City validation
    if (!shippingForm.city.trim()) {
      newErrors.city = "City is required."
    } else if (shippingForm.city.trim().length < 2) {
      newErrors.city = "City name must be at least 2 characters."
    } else if (!/^[a-zA-Z\s.-]+$/.test(shippingForm.city.trim())) {
      newErrors.city = "City name can only contain letters, spaces, dots, and hyphens."
    }

    // ZIP code validation
    if (!shippingForm.zip.trim()) {
      newErrors.zip = "ZIP/Postal code is required."
    } else if (!validateZipCode(shippingForm.zip.trim(), shippingSelectedCountry)) {
      newErrors.zip = `Please enter a valid ZIP/Postal code for ${shippingSelectedCountry || "the selected country"}.`
    }

    // State validation
    if (!shippingForm.state.trim()) {
      newErrors.state = "State/Province is required."
    }

    // Country validation
    if (!shippingForm.country.trim()) {
      newErrors.country = "Country is required."
    }

    // Phone validation
    if (!shippingForm.phone.trim()) {
      newErrors.phone = "Phone number is required."
    } else if (!validatePhone(shippingForm.phone.trim(), shippingSelectedCountryCode)) {
      const country = countries.find((c) => c.code === shippingSelectedCountryCode.code)
      const expectedLength = country ? country.phoneLength.join(" or ") : "10"
      newErrors.phone = `Please enter a valid phone number (${expectedLength} digits) for ${shippingSelectedCountryCode.name}.`
    }

    setShippingErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePayNow = () => {
    // Check if user is authenticated first
    if (!isAuthenticated) {
      console.log("User not authenticated, opening login modal...")
      openAuth("login")
      return
    }

    // Check if cart is empty
    if (!cartItems || cartItems.length === 0) {
      console.log("Cart is empty, redirecting to home...")
      router.push("/")
      return
    }

    // Validate both billing and shipping forms
    const isBillingValid = validateForm()
    const isShippingValid = validateShippingForm()

    if (isBillingValid && isShippingValid) {
      // Prepare checkout data
      const checkoutData = {
        billing_address: {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          company_name: form.company.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          pincode: form.zip.trim(),
          state: form.state.trim(),
          country: form.country.trim(),
          phone_no: `${selectedCountryCode.dialCode}${form.phone.trim()}`,
        },
        shipping_address: showShippingForm,
        ...(showShippingForm && {
          shippingDetails: {
            first_name: shippingForm.firstName.trim(),
            last_name: shippingForm.lastName.trim(),
            company_name: shippingForm.company.trim(),
            email: shippingForm.email.trim(),
            address: shippingForm.address.trim(),
            city: shippingForm.city.trim(),
            pincode: shippingForm.zip.trim(),
            state: shippingForm.state.trim(),
            country: shippingForm.country.trim(),
            phone_no: `${shippingSelectedCountryCode.dialCode}${shippingForm.phone.trim()}`
          },
        }),
      }

      // Log checkout data to console
      console.log("Complete Checkout Data:", checkoutData)
    }
  }

  const handleStateSelect = (state, e) => {
    // Prevent event propagation to avoid dropdown toggle conflicts
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    // Update state in a single batch to prevent race conditions
    setSelectedState(state)
    setForm((prev) => ({ ...prev, state: state }))
    setStateSearchTerm("")
    setErrors((prev) => ({ ...prev, state: "" }))

    // Close dropdown after a small delay to ensure state is set
    setTimeout(() => {
      setIsStateDropdownOpen(false)
    }, 50)
  }

  const handleCountrySelect = (country) => {
    setSelectedCountry(country)
    setForm((prev) => ({ ...prev, country: country }))
    setIsCountryDropdownOpen(false)
    setCountrySearchTerm("")
    setErrors((prev) => ({ ...prev, country: "" }))
  }

  const handleShippingChange = (name, value) => {
    setShippingForm((prev) => ({ ...prev, [name]: value }))
    setShippingErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleShippingStateSelect = (state, e) => {
    // Prevent event propagation to avoid dropdown toggle conflicts
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    // Update state in a single batch to prevent race conditions
    setShippingSelectedState(state)
    setShippingForm((prev) => ({ ...prev, state: state }))
    setShippingStateSearchTerm("")
    setShippingErrors((prev) => ({ ...prev, state: "" }))

    // Close dropdown after a small delay to ensure state is set
    setTimeout(() => {
      setIsShippingStateDropdownOpen(false)
    }, 50)
  }

  const handleShippingCountrySelect = (country) => {
    setShippingSelectedCountry(country)
    setShippingForm((prev) => ({ ...prev, country: country }))
    setIsShippingCountryDropdownOpen(false)
    setShippingCountrySearchTerm("")
    setShippingErrors((prev) => ({ ...prev, country: "" }))
  }

  const handleShippingCheckboxChange = (checked) => {
    setShowShippingForm(checked)
    if (!checked) {
      // Clear shipping form and errors when unchecked
      setShippingForm({
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
      })
      setShippingSelectedState("")
      setShippingSelectedCountry("")
      setShippingErrors({})
    }
  }

  const inputClass = (name) =>
    `p2 border ${errors[name] ? "border-red-500" : "border-gray-100"} text-gray-300 placeholder:text-gray-300 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full outline-none`

  const shippingInputClass = (name) =>
    `p2 border ${shippingErrors[name] ? "border-red-500" : "border-gray-100"} text-gray-300 placeholder:text-gray-300 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full outline-none`

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()),
  )

  const filteredShippingCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(shippingCountrySearchTerm.toLowerCase()),
  )

  // Show loading state while checking cart
  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </div>
    )
  }

  // Don't render the component if cart is empty (will redirect)
  if (!cartItems || cartItems.length === 0) {
    return null
  }

  return (
    <div className="container px-4 py-8">
      {/* Login prompt for returning customers */}
      {!authLoading && !isAuthenticated && (
        <div className="m-3">
          <div className="text-lg w-full rounded-1xl border border-green-100 font-bold leading-tight bg-[#d8efff] p-4 pr-8 relative">
            Returning customer?{" "}
            <button onClick={() => openAuth("login")} className="underline underline-offset-1">
              Click here to login
            </button>
          </div>
        </div>
      )}

      {/* Show user status if authenticated */}
      {!authLoading && isAuthenticated && (
        <div className="m-3">
          <div className="text-lg w-full rounded-1xl border border-green-100 font-bold leading-tight bg-[#e8f5e8] p-4 pr-8 relative">
            ✓ You are logged in and ready to checkout
          </div>
        </div>
      )}

      {/* Checkout Title */}
      <h1 className="h2 border-b border-primary/10 xl:pb-[30px] pb-4">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-[45px] sm:gap-7 gap-5 sm:mt-[25px] mt-4">
        {/* Billing Details */}
        <div className="lg:col-span-2">
          <h2 className="h3 mb-[6px]">Billing Detail</h2>
          <p className="p2 md:mb-[30px] mb-5">
            Discover the most in-demand top-downloaded items trusted by top businesses.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 2xl:gap-y-5 gap-y-4">
            {/* First Name */}
            <div>
              <label className="p2 !text-black mb-[6px]">First name *</label>
              <input
                type="text"
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={inputClass("firstName")}
                maxLength={50}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className="p2 !text-black mb-[6px]">Last name *</label>
              <input
                type="text"
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={inputClass("lastName")}
                maxLength={50}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>

            {/* Company Name */}
            <div>
              <label className="p2 !text-black mb-[6px]">Company name (optional)</label>
              <input
                type="text"
                placeholder="Company Name"
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className={inputClass("company")}
                maxLength={100}
              />
              {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="p2 !text-black mb-[6px]">Email *</label>
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={inputClass("email")}
                maxLength={100}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="p2 !text-black mb-[6px]">Street address *</label>
              <input
                type="text"
                placeholder="Street Address"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className={inputClass("address")}
                maxLength={200}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            {/* City */}
            <div>
              <label className="p2 !text-black mb-[6px]">Town/City *</label>
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className={inputClass("city")}
                maxLength={50}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            {/* ZIP/Postal Code */}
            <div>
              <label className="p2 !text-black mb-[6px]">Postcode / ZIP *</label>
              <input
                type="text"
                placeholder="ZIP/Postal Code"
                value={form.zip}
                onChange={(e) => handleChange("zip", e.target.value)}
                className={inputClass("zip")}
                maxLength={20}
              />
              {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="p2 !text-black block">Phone Number *</label>
              <div
                className={`flex items-center border rounded-md overflow-visible py-[11px] px-2 bg-white ${errors.phone ? "border-red-500" : "border-gray-100"
                  }`}
              >
                {/* Custom flag-only dropdown */}
                <Listbox
                  value={selectedCountryCode}
                  onChange={setSelectedCountryCode}
                  className="border-r border-gray-100 pr-[10px]"
                >
                  <div className="relative">
                    <Listbox.Button className="relative w-full flex items-center justify-center cursor-pointer">
                      <Image
                        src={selectedCountryCode.flag || "/placeholder.svg?height=16&width=24"}
                        alt={`${selectedCountryCode.name} flag`}
                        width={24}
                        height={16}
                        className="rounded-sm mr-2"
                      />
                      <span className="text-xs text-gray-600 mr-1">{selectedCountryCode.dialCode}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 9 9" fill="none">
                        <g clipPath="url(#clip0_1233_287)">
                          <path
                            d="M4.11673 7.15175C4.33218 7.35027 4.66391 7.35027 4.87937 7.15175L8.81858 3.52223C8.93421 3.41568 9 3.26561 9 3.10837V2.78716C9 2.29637 8.4156 2.04078 8.05523 2.37395L4.88007 5.30948C4.66441 5.50886 4.33168 5.50886 4.11602 5.30948L0.940859 2.37395C0.58049 2.04078 -0.00390625 2.29637 -0.00390625 2.78716V3.10837C-0.00390625 3.26561 0.0618803 3.41568 0.177518 3.52223L4.11673 7.15175Z"
                            fill="#808080"
                          />
                        </g>
                      </svg>
                    </Listbox.Button>
                    <Listbox.Options className="absolute mt-3 rounded shadow-xl left-0 z-20 w-80 py-1 outline-none border-gray-100 border bg-white max-h-60 overflow-y-auto">
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
                    </Listbox.Options>
                  </div>
                </Listbox>

                {/* Phone number input */}
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => {
                    // Only allow digits
                    const value = e.target.value.replace(/\D/g, "")
                    handleChange("phone", value)
                  }}
                  className="outline-none w-full ml-2 text-gray-200"
                  maxLength={15}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Expected format: {selectedCountryCode.phoneLength.join(" or ")} digits
              </p>
            </div>

            {/* Country Dropdown */}
            <div className="relative" ref={countryRef}>
              <label className="p2 !text-black mb-[6px]">Country *</label>
              <div className="relative">
                <div
                  className={`border p2 ${errors.country ? "border-red-500" : "border-gray-100"} text-gray-300 placeholder:text-gray-300 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full cursor-pointer flex justify-between items-center`}
                  onClick={toggleCountryDropdown}
                >
                  <span className="text-gray-200">{selectedCountry || "Select Country"}</span>
                  <div className="flex items-center">
                    <svg
                      className={`w-4 h-4 transform transition-transform duration-300 ${isCountryDropdownOpen ? "rotate-180" : "rotate-0"}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
                            src={country.flag || "/placeholder.svg?height=14&width=20"}
                            alt={`${country.name} flag`}
                            width={20}
                            height={14}
                            className="rounded-sm"
                          />
                          {country.name}
                        </li>
                      ))}
                      {filteredCountries.length === 0 && (
                        <li className="px-4 py-2 text-gray-500">No countries found</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
            </div>

            {/* State Dropdown */}
            <div className="relative" ref={stateRef}>
              <label className="p2 !text-black mb-[6px]">State/Province *</label>
              <div className="relative">
                <div
                  className={`border p2 ${errors.state ? "border-red-500" : "border-gray-100"} !text-gray-300 placeholder:!text-gray-300 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full ${selectedCountry ? "cursor-pointer" : "cursor-not-allowed opacity-50"} flex justify-between items-center`}
                  onClick={(e) => (selectedCountry ? toggleStateDropdown(e) : null)}
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Dropdown Menu */}
                {isStateDropdownOpen && (
                  <div className="p2 absolute left-0 right-0 mt-1 border border-gray-100 bg-white rounded-b-md shadow-lg z-10 max-h-60 overflow-hidden">
                    {/* <div className="p-2 border-b border-gray-100">
                      <input
                        type="text"
                        placeholder="Search states..."
                        value={stateSearchTerm}
                        onChange={(e) => setStateSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && filteredStates.length > 0) {
                            e.preventDefault()
                            handleStateSelect(filteredStates[0], e)
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded text-sm outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div> */}
                    <ul className="text-gray-800 max-h-40 overflow-y-auto">
                      {filteredStates.map((state, index) => (
                        <li
                          key={state}
                          onClick={(e) => handleStateSelect(state, e)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault()
                              handleStateSelect(state, e)
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
                          {selectedCountry ? "No states found for this country" : "Please select a country first"}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
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
            {errors.agreed && <p className="text-red-500 text-xs mt-1 ml-8">{errors.agreed}</p>}

            {/* Shipping Details Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="shipping"
                checked={showShippingForm}
                onChange={(e) => handleShippingCheckboxChange(e.target.checked)}
                className="mt-1 xl:w-5 xl:h-5 w-4 h-4 border-gray-100"
              />
              <label htmlFor="shipping" className="font-medium cursor-pointer">
                Ship to a different address?
              </label>
            </div>
          </div>

          {/* Shipping Details Form */}
          {showShippingForm && (
            <div className="mt-6 h2 border-t border-primary/10 xl:pt-[30px] pt-4">
              <h3 className="h4 mb-4">Shipping Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 2xl:gap-y-5 gap-y-4">
                {/* Shipping First Name */}
                <div>
                  <label className="p2 !text-black mb-[6px]">First name *</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={shippingForm.firstName}
                    onChange={(e) => handleShippingChange("firstName", e.target.value)}
                    className={shippingInputClass("firstName")}
                    maxLength={50}
                  />
                  {shippingErrors.firstName && <p className="text-red-500 text-xs mt-1">{shippingErrors.firstName}</p>}
                </div>

                {/* Shipping Last Name */}
                <div>
                  <label className="p2 !text-black mb-[6px]">Last name *</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={shippingForm.lastName}
                    onChange={(e) => handleShippingChange("lastName", e.target.value)}
                    className={shippingInputClass("lastName")}
                    maxLength={50}
                  />
                  {shippingErrors.lastName && <p className="text-red-500 text-xs mt-1">{shippingErrors.lastName}</p>}
                </div>

                {/* Shipping Company Name */}
                <div>
                  <label className="p2 !text-black mb-[6px]">Company name (optional)</label>
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={shippingForm.company}
                    onChange={(e) => handleShippingChange("company", e.target.value)}
                    className={shippingInputClass("company")}
                    maxLength={100}
                  />
                  {shippingErrors.company && <p className="text-red-500 text-xs mt-1">{shippingErrors.company}</p>}
                </div>

                {/* Shipping Email Address */}
                <div>
                  <label className="p2 !text-black mb-[6px]">Email *</label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={shippingForm.email}
                    onChange={(e) => handleShippingChange("email", e.target.value)}
                    className={shippingInputClass("email")}
                    maxLength={100}
                  />
                  {shippingErrors.email && <p className="text-red-500 text-xs mt-1">{shippingErrors.email}</p>}
                </div>

                {/* Shipping Address */}
                <div>
                  <label className="p2 !text-black mb-[6px]">Street address *</label>
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={shippingForm.address}
                    onChange={(e) => handleShippingChange("address", e.target.value)}
                    className={shippingInputClass("address")}
                    maxLength={200}
                  />
                  {shippingErrors.address && <p className="text-red-500 text-xs mt-1">{shippingErrors.address}</p>}
                </div>

                {/* Shipping City */}
                <div>
                  <label className="p2 !text-black mb-[6px]">Town/City *</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={shippingForm.city}
                    onChange={(e) => handleShippingChange("city", e.target.value)}
                    className={shippingInputClass("city")}
                    maxLength={50}
                  />
                  {shippingErrors.city && <p className="text-red-500 text-xs mt-1">{shippingErrors.city}</p>}
                </div>

                {/* Shipping ZIP/Postal Code */}
                <div>
                  <label className="p2 !text-black mb-[6px]">Postcode / ZIP *</label>
                  <input
                    type="text"
                    placeholder="ZIP/Postal Code"
                    value={shippingForm.zip}
                    onChange={(e) => handleShippingChange("zip", e.target.value)}
                    className={shippingInputClass("zip")}
                    maxLength={20}
                  />
                  {shippingErrors.zip && <p className="text-red-500 text-xs mt-1">{shippingErrors.zip}</p>}
                </div>

                {/* Shipping State Dropdown */}
                <div className="relative" ref={shippingStateRef}>
                  <label className="p2 !text-black mb-[6px]">State/Province *</label>
                  <div className="relative">
                    <div
                      className={`border p2 ${shippingErrors.state ? "border-red-500" : "border-gray-100"} !text-gray-300 placeholder:!text-gray-300 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full ${shippingSelectedCountry ? "cursor-pointer" : "cursor-not-allowed opacity-50"} flex justify-between items-center`}
                      onClick={(e) => (shippingSelectedCountry ? toggleShippingStateDropdown(e) : null)}
                    >
                      <span className="text-gray-200">
                        {shippingSelectedState ||
                          (shippingSelectedCountry ? "Select State/Province" : "Select Country First")}
                      </span>
                      <div className="flex items-center">
                        <svg
                          className={`w-4 h-4 transform transition-transform duration-300 ${isShippingStateDropdownOpen ? "rotate-180" : "rotate-0"}`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Dropdown Menu */}
                    {isShippingStateDropdownOpen && (
                      <div className="p2 absolute left-0 right-0 mt-1 border border-gray-100 bg-white rounded-b-md shadow-lg z-10 max-h-60 overflow-hidden">
                        {/* <div className="p-2 border-b border-gray-100">
                          <input
                            type="text"
                            placeholder="Search states..."
                            value={shippingStateSearchTerm}
                            onChange={(e) => setShippingStateSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && filteredShippingStates.length > 0) {
                                e.preventDefault()
                                handleShippingStateSelect(filteredShippingStates[0], e)
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-200 rounded text-sm outline-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div> */}
                        <ul className="text-gray-800 max-h-40 overflow-y-auto">
                          {filteredShippingStates.map((state, index) => (
                            <li
                              key={state}
                              onClick={(e) => handleShippingStateSelect(state, e)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault()
                                  handleShippingStateSelect(state, e)
                                }
                              }}
                              tabIndex={0}
                              className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer focus:bg-primary focus:text-white outline-none"
                            >
                              {state}
                            </li>
                          ))}
                          {filteredShippingStates.length === 0 && (
                            <li className="px-4 py-2 text-gray-500">
                              {shippingSelectedCountry
                                ? "No states found for this country"
                                : "Please select a country first"}
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  {shippingErrors.state && <p className="text-red-500 text-xs mt-1">{shippingErrors.state}</p>}
                </div>

                {/* Shipping Country Dropdown */}
                <div className="relative" ref={shippingCountryRef}>
                  <label className="p2 !text-black mb-[6px]">Country *</label>
                  <div className="relative">
                    <div
                      className={`border p2 ${shippingErrors.country ? "border-red-500" : "border-gray-100"} text-gray-300 placeholder:text-gray-300 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full cursor-pointer flex justify-between items-center`}
                      onClick={toggleShippingCountryDropdown}
                    >
                      <span className="text-gray-200">{shippingSelectedCountry || "Select Country"}</span>
                      <div className="flex items-center">
                        <svg
                          className={`w-4 h-4 transform transition-transform duration-300 ${isShippingCountryDropdownOpen ? "rotate-180" : "rotate-0"}`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Dropdown Menu */}
                    {isShippingCountryDropdownOpen && (
                      <div className="p2 absolute left-0 right-0 mt-1 border border-gray-100 bg-white rounded-b-md shadow-lg z-10 max-h-60 overflow-hidden">
                        <div className="p-2 border-b border-gray-100">
                          <input
                            type="text"
                            placeholder="Search countries..."
                            value={shippingCountrySearchTerm}
                            onChange={(e) => setShippingCountrySearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded text-sm outline-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <ul className="text-gray-800 max-h-40 overflow-y-auto">
                          {filteredShippingCountries.map((country) => (
                            <li
                              key={country.code}
                              onClick={() => handleShippingCountrySelect(country.name)}
                              className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer flex items-center gap-2"
                            >
                              <Image
                                src={country.flag || "/placeholder.svg?height=14&width=20"}
                                alt={`${country.name} flag`}
                                width={20}
                                height={14}
                                className="rounded-sm"
                              />
                              {country.name}
                            </li>
                          ))}
                          {filteredShippingCountries.length === 0 && (
                            <li className="px-4 py-2 text-gray-500">No countries found</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  {shippingErrors.country && <p className="text-red-500 text-xs mt-1">{shippingErrors.country}</p>}
                </div>

                {/* Shipping Phone Number */}
                <div>
                  <label className="p2 !text-black block">Phone Number *</label>
                  <div
                    className={`p2 flex items-center border rounded-md overflow-visible py-[11px] px-2 bg-white ${shippingErrors.phone ? "border-red-500" : "border-gray-100"}`}
                  >
                    <Listbox
                      value={shippingSelectedCountryCode}
                      onChange={setShippingSelectedCountryCode}
                      className="border-r border-gray-100 pr-[10px]"
                    >
                      <div className="relative">
                        <Listbox.Button className="relative w-full flex items-center justify-center cursor-pointer">
                          <Image
                            src={shippingSelectedCountryCode.flag || "/placeholder.svg?height=16&width=24"}
                            alt={`${shippingSelectedCountryCode.name} flag`}
                            width={24}
                            height={16}
                            className="rounded-sm mr-2"
                          />
                          <span className="text-xs text-gray-600 mr-1">{shippingSelectedCountryCode.dialCode}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 9 9" fill="none">
                            <g clipPath="url(#clip0_1233_287)">
                              <path
                                d="M4.11673 7.15175C4.33218 7.35027 4.66391 7.35027 4.87937 7.15175L8.81858 3.52223C8.93421 3.41568 9 3.26561 9 3.10837V2.78716C9 2.29637 8.4156 2.04078 8.05523 2.37395L4.88007 5.30948C4.66441 5.50886 4.33168 5.50886 4.11602 5.30948L0.940859 2.37395C0.58049 2.04078 -0.00390625 2.29637 -0.00390625 2.78716V3.10837C-0.00390625 3.26561 0.0618803 3.41568 0.177518 3.52223L4.11673 7.15175Z"
                                fill="#808080"
                              />
                            </g>
                          </svg>
                        </Listbox.Button>
                        <Listbox.Options className="absolute mt-3 rounded shadow-xl left-0 z-20 w-80 py-1 outline-none border-gray-100 border bg-white max-h-60 overflow-y-auto">
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
                        </Listbox.Options>
                      </div>
                    </Listbox>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={shippingForm.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "")
                        handleShippingChange("phone", value)
                      }}
                      className="outline-none w-full ml-2 text-gray-200"
                      maxLength={15}
                    />
                  </div>
                  {shippingErrors.phone && <p className="text-red-500 text-xs mt-1">{shippingErrors.phone}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    Expected format: {shippingSelectedCountryCode.phoneLength.join(" or ")} digits
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            onPress={handlePayNow}
            className="group btn btn-primary flex items-center justify-center gap-[10px] w-[220px] xl:!py-[11px] py-[10px] h-auto sm:mt-7 mt-5"
          >
            {!isAuthenticated ? "Login to Pay" : "Pay Now"}
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
              You need to be logged in to complete your purchase. Click the button above to login or register.
            </p>
          )}
        </div>

        {/* Cart Total */}
        <div className="md:space-y-4 space-y-2 divide-y divide-primary/10">
          <h4>Your Cart Total</h4>
          <div className="text-sm text-gray-700 sm:space-y-4 space-y-2 mt-[18px] mb-[22px] pt-[18px]">
            {cartItems?.map((item, index) => {
              return (
                <div key={index} className="flex justify-between py-1 1xl:gap-20 xl:gap-12 gap-4">
                  <span className="p2">{item?.product?.title}</span>
                  <span className="p2 !text-black !font-medium">${item?.total?.toFixed(2)}</span>
                </div>
              )
            })}
          </div>

          <div>
            <div className="flex justify-between py-2 font-semibold">
              <p className="font-medium !text-black">Total</p>
              <p className="font-medium !text-black">${totalPrice?.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2 xl:mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 3.93994L12 0.439941L2 3.93994V11.9999C2 16.1269 4.534 19.0119 6.896 20.8029C8.32208 21.8734 9.88622 22.7463 11.546 23.3979C11.6593 23.4406 11.7733 23.4813 11.888 23.5199L12 23.5599L12.114 23.5199C12.3327 23.444 12.5494 23.3626 12.764 23.2759C14.3097 22.6391 15.7681 21.8081 17.104 20.8029C19.467 19.0119 22 16.1269 22 11.9999V3.93994ZM11.001 15.4149L6.76 11.1719L8.174 9.75694L11.002 12.5859L16.659 6.92894L18.074 8.34294L11.001 15.4149Z"
                  fill="#0156D5"
                />
              </svg>
              <p className="text-black font-medium">10 day money back guarantee.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
