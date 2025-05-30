"use client"
import { useState } from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure } from "@heroui/react"

const SinglePageModal = ({ product_id }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [form, setForm] = useState({
    email: "",
    product_id: product_id,
    description: "",
    agreed: false,
  })

  const [errors, setErrors] = useState({})

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors = {}

    // Email validation
    const email = form.email.trim()
    if (!email) {
      newErrors.email = "Email is required."
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address."
    }

    // Description validation
    const description = form.description.trim()
    if (!description) {
      newErrors.description = "Description is required."
    }

    // Terms agreement validation
    if (!form.agreed) {
      newErrors.agreed = "You must agree to the Terms of Service and Privacy Policy."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    // Only clear the error for the field being changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleCheckboxChange = () => {
    setForm((prev) => ({ ...prev, agreed: !prev.agreed }))
    if (errors.agreed) {
      setErrors((prev) => ({ ...prev, agreed: undefined }))
    }
  }

  const contact_for_product = (event) => {
    event.preventDefault()

    const isInquiryValid = validateForm()

    if (!isInquiryValid) {
      console.warn("Product Inquiry form is invalid.")
      return
    } else {
      console.log("Product Inquiry form data", form)
      document.getElementById("ProductInquiry").reset()
      setForm({
        email: "",
        product_id: product_id,
        description: "",
        agreed: false,
      })
      onOpenChange(false)
    }
  }

  const inputClass = (name) =>
    `p2 border ${errors[name] ? "border-red-500" : "border-gray-100"} text-gray-300 placeholder:text-gray-300 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full outline-none`

  return (
    <>
      <Button onPress={onOpen} color="primary" className="w-full btn btn-primary flex items-center justify-center">
        Contact Sales
      </Button>
      <Modal
        backdrop="opaque"
        hideCloseButton={true}
        scrollBehavior="outside"
        isOpen={isOpen}
        radius="lg"
        onOpenChange={onOpenChange}
      >
        <ModalContent className="modal-content">
          {(onClose) => (
            <>
              <ModalHeader className="p-0">
                <div className="flex items-start justify-between w-full">
                  <div className="2xl:mb-10 1xl:mb-8 md:mb-6 mb-4">
                    <h2 className="2xl:mb-10 1xl:mb-8 md:mb-2">Contact Sales</h2>
                    <p className="p2 font-normal">Seamless shopping starts with a simple login.</p>
                  </div>
                  <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M13 13L7 7M7 7L1 1M7 7L13 1M7 7L1 13"
                        stroke="black"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </ModalHeader>
              <ModalBody className="p-0">
                <div className="single-page-modalbody">
                  {/* Left - Form */}
                  <div className="left-form">
                    <form id="ProductInquiry" onSubmit={contact_for_product} className="xl:space-y-4 space-y-3">
                      <div className="grid">
                        <label className="p2 !text-black">Company email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          placeholder="Email address"
                          className={inputClass("email")}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>

                      <div className="h-full">
                        <label className="p2 !text-black">How can we help?</label>
                        <textarea
                          value={form.description}
                          onChange={(e) => handleChange("description", e.target.value)}
                          placeholder="Let's talk now..."
                          className={inputClass("description")}
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                      </div>

                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id="agreed"
                          checked={form.agreed}
                          onChange={handleCheckboxChange}
                          className="mt-1"
                        />
                        <label htmlFor="agreed" className="p2 md:pb-4 sm:pb-2 pb-1">
                          By clicking "Talk to WebbyTemplate", I acknowledge that I have read and understood the{" "}
                          <span className="text-blue-600 underline cursor-pointer">Privacy Notice.</span>
                        </label>
                      </div>
                      {errors.agreed && <p className="text-red-500 text-xs mt-1">{errors.agreed}</p>}

                      <button type="submit" className="btn btn-primary">
                        Talk to WebbyTemplate
                      </button>
                    </form>
                  </div>

                  {/* Right - Info */}
                  <div className="right-info">
                    <h3 className="1xl:mb-4 sm:mb-2 mb-1">Let's Create a Pricing for Your Unique Requirements</h3>
                    <p className="1xl:mb-[30px] xl:mb-[25px] lg:mb-[18px] md:mb-4 sm:mb-3 mb-2">
                      Developing the right pricing strategy involves balancing profitability, customer value. By
                      analyzing your market, costs, and competitive landscape, you can choose an approach.
                    </p>
                    <div className="icon-info">
                      <div className="flex items-start sm:gap-[18px] gap-2">
                        <div className="icon-border">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M18.3274 22.5001C17.4124 22.5001 16.1271 22.1691 14.2024 21.0938C11.862 19.7813 10.0516 18.5696 7.72383 16.2479C5.47946 14.0049 4.38727 12.5527 2.85868 9.77115C1.1318 6.63052 1.42618 4.98427 1.75524 4.28068C2.14712 3.43974 2.72555 2.93677 3.47321 2.43755C3.89787 2.15932 4.34727 1.92081 4.81571 1.72505C4.86258 1.7049 4.90618 1.68568 4.94508 1.66833C5.17712 1.5638 5.52868 1.40583 5.97399 1.57458C6.27118 1.68615 6.53649 1.91443 6.9518 2.32458C7.80352 3.16458 8.96743 5.03537 9.3968 5.95412C9.68508 6.57333 9.87587 6.98208 9.87633 7.44052C9.87633 7.97724 9.60633 8.39115 9.27868 8.83787C9.21727 8.92177 9.15633 9.00193 9.09727 9.07974C8.74055 9.54849 8.66227 9.68396 8.71383 9.92583C8.81837 10.4119 9.5979 11.859 10.879 13.1372C12.1601 14.4155 13.5654 15.1458 14.0534 15.2499C14.3056 15.3038 14.4438 15.2222 14.9276 14.8529C14.997 14.7999 15.0682 14.7451 15.1427 14.6902C15.6424 14.3185 16.0371 14.0555 16.5612 14.0555H16.564C17.0201 14.0555 17.4106 14.2533 18.0574 14.5796C18.9012 15.0052 20.8282 16.1541 21.6734 17.0068C22.0845 17.4211 22.3137 17.6855 22.4257 17.9822C22.5945 18.429 22.4356 18.7791 22.332 19.0135C22.3146 19.0524 22.2954 19.0951 22.2752 19.1424C22.0779 19.61 21.838 20.0585 21.5585 20.4821C21.0602 21.2274 20.5554 21.8044 19.7126 22.1968C19.2798 22.4015 18.8062 22.5052 18.3274 22.5001Z"
                              fill="#0156D5"
                            />
                          </svg>
                        </div>
                        <div className="info">
                          <h4>Experience WebbyTemplate in Action</h4>
                          <p>
                            Request a personalized demo and see how WebbyTemplate can transform your enterprise with
                            tailored plans and pricing.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start sm:gap-[18px] gap-2">
                        <div className="icon-border">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <g clipPath="url(#clip0_1741_5261)">
                              <path
                                d="M18.0002 1.6074C19.8102 2.65244 21.3158 4.15206 22.3681 5.95782C23.4203 7.76357 23.9827 9.81283 23.9996 11.9027C24.0165 13.9926 23.4873 16.0507 22.4643 17.8732C21.4413 19.6958 19.9601 21.2195 18.1673 22.2936C16.3745 23.3678 14.3322 23.9551 12.2427 23.9974C10.1531 24.0396 8.08876 23.5355 6.25394 22.5348C4.41913 21.534 2.87748 20.0715 1.78162 18.2918C0.685763 16.5122 0.0736921 14.4772 0.00600021 12.3883L0 11.9995L0.00600021 11.6107C0.0732047 9.53829 0.676266 7.51863 1.75639 5.74864C2.83651 3.97866 4.35684 2.51876 6.16915 1.51126C7.98145 0.503764 10.0239 -0.0169414 12.0974 -9.19816e-05C14.1708 0.0167575 16.2045 0.570587 18.0002 1.6074ZM12.0001 4.79944C11.7062 4.79948 11.4225 4.90739 11.2029 5.1027C10.9832 5.29802 10.8429 5.56715 10.8085 5.85905L10.8001 5.99946V11.9995L10.8109 12.1567C10.8383 12.3649 10.9198 12.5623 11.0473 12.7291L11.1517 12.8491L14.7518 16.4492L14.8646 16.5476C15.075 16.7109 15.3338 16.7995 15.6002 16.7995C15.8666 16.7995 16.1254 16.7109 16.3358 16.5476L16.4486 16.448L16.5482 16.3352C16.7115 16.1247 16.8001 15.8659 16.8001 15.5996C16.8001 15.3332 16.7115 15.0744 16.5482 14.864L16.4486 14.7512L13.2002 11.5015V5.99946L13.1918 5.85905C13.1574 5.56715 13.017 5.29802 12.7974 5.1027C12.5778 4.90739 12.2941 4.79948 12.0001 4.79944Z"
                                fill="#0156D5"
                              />
                            </g>
                          </svg>
                        </div>
                        <div className="info">
                          <h4>Try WebbyTemplate Enterprise Free</h4>
                          <p>
                            Get hands-on with WebbyTemplate Enterprise—boost your workflow and impact with a free trial
                            today!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default SinglePageModal
