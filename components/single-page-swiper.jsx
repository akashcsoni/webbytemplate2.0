"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel, Keyboard } from "swiper/modules";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

import "swiper/css";
import "swiper/css/navigation";
// import { cn } from "@/lib/utils"
// import { URL } from "@/config/theamConfig"
import { containsTargetURL } from "@/lib/containsTargetURL";

const SinglePageSwiper = ({
  gallery_images = [],
  className = "",
  imageWidth = 868,
  imageHeight = 554,
  showSocialShare = true,
  breakpoints,
}) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Default breakpoints if not provided
  const defaultBreakpoints = {
    0: {
      slidesPerView: 1,
      spaceBetween: 15,
    },
    426: {
      slidesPerView: 1.4,
      spaceBetween: 15,
    },
    640: {
      slidesPerView: 1.4,
      spaceBetween: 20,
    },
    992: {
      slidesPerView: 1.4,
      spaceBetween: 30,
    },
  };

  // Check if gallery_images is valid and has items
  const hasImages = Array.isArray(gallery_images) && gallery_images.length > 0;

  useEffect(() => {
    const swiper = swiperRef.current?.swiper;
    if (swiper && prevRef.current && nextRef.current) {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, [imagesLoaded]);

  // Social share buttons data
  const socialButtons = [
    {
      name: "Facebook",
      icon: (
        <path d="M7.25884 19.2969H11.1733V11.4582H14.7003L15.0878 7.56326H11.1733V5.59623C11.1733 5.33669 11.2764 5.08777 11.46 4.90424C11.6435 4.72072 11.8924 4.61761 12.1519 4.61761H15.0878V0.703125H12.1519C10.8542 0.703125 9.60963 1.21865 8.692 2.13628C7.77436 3.05392 7.25884 4.2985 7.25884 5.59623V7.56326H5.3016L4.91406 11.4582H7.25884V19.2969Z" />
      ),
    },
    {
      name: "Twitter",
      icon: (
        <path d="M19.8741 4.77712C19.2061 5.08077 18.486 5.28031 17.7399 5.37574C18.5033 4.91593 19.0933 4.18718 19.3709 3.31094C18.6508 3.74472 17.8527 4.04837 17.0111 4.22188C16.3257 3.47578 15.3627 3.04199 14.2696 3.04199C12.2308 3.04199 10.5651 4.70772 10.5651 6.76385C10.5651 7.05882 10.5998 7.34512 10.6605 7.61406C7.572 7.4579 4.82182 5.97436 2.99126 3.72737C2.67026 4.27394 2.48807 4.91593 2.48807 5.59264C2.48807 6.88531 3.13874 8.0305 4.14512 8.68117C3.52915 8.68117 2.95655 8.50766 2.45336 8.24739V8.27341C2.45336 10.078 3.73736 11.5875 5.43779 11.9259C4.89195 12.0759 4.31866 12.0967 3.76339 11.9866C3.99903 12.7262 4.46051 13.3733 5.08297 13.8371C5.70543 14.3008 6.45757 14.5578 7.23365 14.5719C5.91814 15.6135 4.28741 16.1764 2.60953 16.1683C2.31455 16.1683 2.01958 16.1509 1.72461 16.1162C3.37298 17.1746 5.33368 17.7906 7.43319 17.7906C14.2696 17.7906 18.0262 12.1167 18.0262 7.19763C18.0262 7.0328 18.0262 6.87663 18.0175 6.7118C18.7463 6.19126 19.3709 5.53191 19.8741 4.77712Z" />
      ),
    },
    {
      name: "Pinterest",
      icon: (
        <path d="M8.65691 13.2279C8.14584 15.9812 7.52367 18.6213 5.67736 20C5.10873 15.8387 6.51467 12.7127 7.16714 9.39485C6.0541 7.46572 7.30147 3.58222 9.64874 4.5387C12.5374 5.71638 7.14694 11.7118 10.7658 12.4613C14.5443 13.243 16.0876 5.71133 13.7443 3.26103C10.3588 -0.275028 3.88964 3.18124 4.68553 8.24444C4.87945 9.48272 6.12076 9.85845 5.18145 11.5674C3.01497 11.0715 2.36856 9.31203 2.45239 6.96576C2.58571 3.12771 5.80261 0.439052 9.02859 0.0673668C13.109 -0.4033 16.938 1.60966 17.4663 5.56184C18.0622 10.0221 15.625 14.854 11.2627 14.5055C10.08 14.4116 9.58309 13.8086 8.65691 13.2279Z" />
      ),
    },
    {
      name: "YouTube",
      icon: (
        <>
          <g clipPath="url(#clip0_803_5041)">
            <path d="M8.05099 13.0823L13.2741 10.0632L8.05099 7.04405V13.0823ZM19.6847 5.20238C19.8155 5.67538 19.9061 6.3094 19.9664 7.11449C20.0369 7.91959 20.0671 8.61399 20.0671 9.21781L20.1275 10.0632C20.1275 12.2671 19.9664 13.8874 19.6847 14.924C19.4331 15.8297 18.8494 16.4134 17.9436 16.665C17.4706 16.7958 16.6052 16.8864 15.2767 16.9468C13.9685 17.0172 12.7709 17.0474 11.6639 17.0474L10.0637 17.1078C5.84703 17.1078 3.22039 16.9468 2.18383 16.665C1.27809 16.4134 0.694398 15.8297 0.442804 14.924C0.311976 14.451 0.221402 13.8169 0.16102 13.0118C0.0905737 12.2067 0.0603823 11.5123 0.0603823 10.9085L0 10.0632C0 7.85921 0.16102 6.23895 0.442804 5.20238C0.694398 4.29665 1.27809 3.71295 2.18383 3.46136C2.65683 3.33053 3.52231 3.23996 4.85072 3.17957C6.159 3.10913 7.35659 3.07894 8.4636 3.07894L10.0637 3.01855C14.2804 3.01855 16.9071 3.17957 17.9436 3.46136C18.8494 3.71295 19.4331 4.29665 19.6847 5.20238Z" />
          </g>
        </>
      ),
    },
    {
      name: "Instagram",
      icon: (
        <path d="M6.5013 1.66602H13.5013C16.168 1.66602 18.3346 3.83268 18.3346 6.49935V13.4993C18.3346 14.7812 17.8254 16.0106 16.919 16.917C16.0126 17.8235 14.7832 18.3327 13.5013 18.3327H6.5013C3.83464 18.3327 1.66797 16.166 1.66797 13.4993V6.49935C1.66797 5.21747 2.17719 3.98809 3.08362 3.08167C3.99004 2.17524 5.21942 1.66602 6.5013 1.66602ZM6.33463 3.33268C5.53899 3.33268 4.77592 3.64875 4.21331 4.21136C3.65071 4.77397 3.33464 5.53703 3.33464 6.33268V13.666C3.33464 15.3243 4.6763 16.666 6.33463 16.666H13.668C14.4636 16.666 15.2267 16.3499 15.7893 15.7873C16.3519 15.2247 16.668 14.4617 16.668 13.666V6.33268C16.668 4.67435 15.3263 3.33268 13.668 3.33268H6.33463ZM14.3763 4.58268C14.6526 4.58268 14.9175 4.69243 15.1129 4.88778C15.3082 5.08313 15.418 5.34808 15.418 5.62435C15.418 5.90062 15.3082 6.16557 15.1129 6.36092C14.9175 6.55627 14.6526 6.66601 14.3763 6.66601C14.1 6.66601 13.8351 6.55627 13.6397 6.36092C13.4444 6.16557 13.3346 5.90062 13.3346 5.62435C13.3346 5.34808 13.4444 5.08313 13.6397 4.88778C13.8351 4.69243 14.1 4.58268 14.3763 4.58268ZM10.0013 5.83268C11.1064 5.83268 12.1662 6.27167 12.9476 7.05307C13.729 7.83447 14.168 8.89428 14.168 9.99935C14.168 11.1044 13.729 12.1642 12.9476 12.9456C12.1662 13.727 11.1064 14.166 10.0013 14.166C8.89623 14.166 7.83642 13.727 7.05502 12.9456C6.27362 12.1642 5.83463 11.1044 5.83463 9.99935C5.83463 8.89428 6.27362 7.83447 7.05502 7.05307C7.83642 6.27167 8.89623 5.83268 10.0013 5.83268ZM10.0013 7.49935C9.33826 7.49935 8.70237 7.76274 8.23353 8.23158C7.76469 8.70042 7.5013 9.33631 7.5013 9.99935C7.5013 10.6624 7.76469 11.2983 8.23353 11.7671C8.70237 12.236 9.33826 12.4993 10.0013 12.4993C10.6643 12.4993 11.3002 12.236 11.7691 11.7671C12.2379 11.2983 12.5013 10.6624 12.5013 9.99935C12.5013 9.33631 12.2379 8.70042 11.7691 8.23158C11.3002 7.76274 10.6643 7.49935 10.0013 7.49935Z" />
      ),
    },
    {
      name: "LinkedIn",
      icon: (
        <path d="M5.56768 3.75739C5.56745 4.23049 5.37928 4.68413 5.04458 5.01849C4.70987 5.35286 4.25605 5.54057 3.78295 5.54034C3.30984 5.5401 2.85621 5.35193 2.52184 5.01723C2.18748 4.68253 1.99976 4.22871 2 3.75561C2.00024 3.2825 2.1884 2.82887 2.52311 2.4945C2.85781 2.16013 3.31163 1.97242 3.78473 1.97266C4.25784 1.97289 4.71147 2.16106 5.04584 2.49576C5.3802 2.83046 5.56792 3.28428 5.56768 3.75739ZM5.6212 6.86127H2.05352V18.0281H5.6212V6.86127ZM11.2581 6.86127H7.70829V18.0281H11.2225V12.1682C11.2225 8.90377 15.4769 8.60052 15.4769 12.1682V18.0281H19V10.9552C19 5.45204 12.703 5.65718 11.2225 8.3597L11.2581 6.86127Z" />
      ),
    },
  ];

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // const scrollContainerRef = useRef(null);
  // const [scrollProgress, setScrollProgress] = useState(0);
  // const handleScroll = () => {
  //   const el = scrollContainerRef.current;
  //   if (!el) return;
  //   const max = el.scrollHeight - el.clientHeight;
  //   if (max <= 0) {            // nothing to scroll
  //     setScrollProgress(100);
  //     return;
  //   }
  //   setScrollProgress((el.scrollTop / max) * 100);
  // };

  // // reset when modal opens
  // useEffect(() => {
  //   if (!isOpen) return;
  //   setScrollProgress(0);
  //   requestAnimationFrame(() => {
  //     const el = scrollContainerRef.current;
  //     if (el) { el.scrollTop = 0; handleScroll(); }
  //   });
  // }, [isOpen]);
  const modalBodyRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = modalBodyRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const scrolled = (scrollTop / scrollHeight) * 100;
      setProgress(scrolled);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  return (
    <div className={("relative w-full pb-5", className)}>
      <div className="2xl:w-[59vw] lg:w-[68vw] w-[98vw] [@media(max-width:426px)]:w-full">
        {hasImages ? (
          <Swiper
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onSwiper={(swiper) => {
              // Initialize the button disabled state on load
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            ref={swiperRef}
            slidesPerView="auto"
            spaceBetween={10}
            // cssMode
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            // mousewheel
            // keyboard
            breakpoints={breakpoints || defaultBreakpoints}
            modules={[Navigation, Mousewheel, Keyboard]}
            onInit={() => setImagesLoaded(true)}
            className="w-full"
          >
            {gallery_images.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="relative group w-full h-full lg:before:pt-[69%] before:pt-[64%] before:block overflow-hidden">
                  <Image
                    src={containsTargetURL(img?.url) ? img?.url : `${img?.url}`}
                    alt={`Product ${i + 1}`}
                    width={imageWidth}
                    height={imageHeight}
                    className="flex-shrink-0 object-cover w-full h-full absolute top-0 left-0 bottom-0 right-0"
                  />
                  <div className="group-hover:flex hidden items-center justify-center absolute top-0 left-0 w-full h-full group-hover:bg-black/50 transition-all duration-300 ease-in-out">
                    <Button
                      onPress={onOpen}
                      className="border border-white 2xl:py-2 2xl:px-10 1xl:py-[6px] 1xl:px-8 py-1 xl:px-6 px-4 h-fit w-fit flex items-center justify-center sm:gap-3 gap-1.5 bg-transparent"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="21"
                        viewBox="0 0 20 21"
                        fill="none"
                        className="1xl:w-[20px] 1xl:h-[21px] sm:w-[18px] sm:h-[19px] w-[16px] h-[17px]"
                      >
                        <path
                          d="M17.1094 2.67969H2.89062C1.71271 2.67969 0.757812 3.63458 0.757812 4.8125V16.1875C0.757812 17.3654 1.71271 18.3203 2.89062 18.3203H17.1094C18.2873 18.3203 19.2422 17.3654 19.2422 16.1875V4.8125C19.2422 3.63458 18.2873 2.67969 17.1094 2.67969Z"
                          stroke="white"
                          strokeWidth="1.47875"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.5547 8.36719C14.34 8.36719 14.9766 7.73059 14.9766 6.94531C14.9766 6.16003 14.34 5.52344 13.5547 5.52344C12.7694 5.52344 12.1328 6.16003 12.1328 6.94531C12.1328 7.73059 12.7694 8.36719 13.5547 8.36719Z"
                          stroke="white"
                          strokeWidth="1.47875"
                          strokeMiterlimit="10"
                        />
                        <path
                          d="M12.1328 14.0451L8.10446 10.0243C7.84813 9.76798 7.50359 9.61927 7.14127 9.60853C6.77896 9.5978 6.42622 9.72584 6.15516 9.96649L0.757812 14.7653M8.57812 18.32L14.0586 12.8396C14.3092 12.5884 14.6447 12.4401 14.9991 12.4236C15.3535 12.4072 15.7013 12.5238 15.9741 12.7507L19.2422 15.4763"
                          stroke="white"
                          strokeWidth="1.47875"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="text-white">Screenshots</p>
                    </Button>

                    {/* modal start */}
                    <Modal
                      backdrop="opaque"
                      size="full"
                      hideCloseButton
                      classNames={{
                        backdrop: "bg-white w-screen h-screen",
                      }}
                      scrollBehavior="inside"
                      isOpen={isOpen}
                      onOpenChange={onOpenChange}
                    >
                      <ModalContent className="shadow-none ">
                        {(onClose) => (
                          <>
                            <ModalHeader className="bg-[#E6EFFB80] flex 2xl:flex-row flex-col px-4">
                              <div className="max-w-[1120px] mx-auto w-full gap-2">
                                <Button
                                  variant="light"
                                  onPress={onClose}
                                  className="flex items-center justify-start gap-[6px] 2xl:absolute relative 2xl:top-5 2xl:left-5 z-10"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                  >
                                    <g clipPath="url(#clip0_1348_11)">
                                      <path
                                        d="M6.2619 1.58984L1 7M1 7L6.2619 12.4102M1 7L12.9023 7"
                                        stroke="black"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </g>
                                  </svg>
                                  <p>Back</p>
                                </Button>
                                <div className=" flex md:flex-row flex-col md:items-center items-start justify-between gap-2">
                                  <div className="flex flex-col items-start gap-2">
                                    <h2>
                                      Diazelo: Fashion & Clothing eCommerce XD
                                      Template...
                                    </h2>
                                    <div className="flex items-center justify-start gap-2">
                                      <div className="rounded-full overflow-hidden">
                                        <Image
                                          src="/images/author-logo.png"
                                          alt="Author Logo"
                                          width="28"
                                          height="28"
                                          className="flex-shrink-0 object-cover rounded-full"
                                        />
                                      </div>
                                      <p className="p2 text-[#505050]">
                                        WebbyCrown
                                      </p>
                                    </div>
                                  </div>
                                  <button className="btn btn-primary gap-[10px] sm:w-auto w-full">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="21"
                                      viewBox="0 0 18 21"
                                      fill="none"
                                    >
                                      <path
                                        d="M5.7474 7.25V4C5.7474 2.20507 7.20247 0.75 8.9974 0.75C10.7923 0.75 12.2474 2.20507 12.2474 4V7.25M2.4974 5.08333H15.4974L16.5807 19.1667H1.41406L2.4974 5.08333Z"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                    Add to Cart
                                  </button>
                                </div>
                                {/* Progress bar at top */}
                              </div>
                            </ModalHeader>
                            <ModalBody

                              className="p-0 h-full w-full"
                            >
                              <div className="sticky top-0 z-10 bg-gray-100 ">
                                <div
                                  className="h-2 bg-primary transition-all duration-200 w-full"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <div ref={modalBodyRef} className="w-full h-full 2xl:my-[30px] my-[10px] max-w-[1120px] mx-auto px-4 overflow-y-auto ">
                                <div className="w-full h-full ">
                                  <div className="mb-[25px] relative group w-full before:content-[''] before:block before:pt-[64%] lg:before:pt-[66%] overflow-hidden">
                                    <Image
                                      src="/images/diazelo.png"
                                      alt="Author Logo"
                                      width="1120"
                                      height="200"
                                      className="absolute top-0 left-0 w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="mb-[25px] relative group w-full before:content-[''] before:block before:pt-[64%] lg:before:pt-[66%] overflow-hidden">
                                    <Image
                                      src="/images/diazelo.png"
                                      alt="Author Logo"
                                      width="1120"
                                      height="200"
                                      className="absolute top-0 left-0 w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="mb-[25px] relative group w-full before:content-[''] before:block before:pt-[64%] lg:before:pt-[66%] overflow-hidden">
                                    <Image
                                      src="/images/diazelo.png"
                                      alt="Author Logo"
                                      width="1120"
                                      height="200"
                                      className="absolute top-0 left-0 w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="mb-[25px] relative group w-full before:content-[''] before:block before:pt-[64%] lg:before:pt-[66%] overflow-hidden">
                                    <Image
                                      src="/images/diazelo.png"
                                      alt="Author Logo"
                                      width="1120"
                                      height="200"
                                      className="absolute top-0 left-0 w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              </div>
                            </ModalBody>
                          </>
                        )}
                      </ModalContent>
                    </Modal>
                    {/* modal end */}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          // Fallback when no images are available
          <div className="flex items-center justify-center w-full h-[300px] bg-gray-100 rounded-md">
            <p className="text-gray-500">No images available</p>
          </div>
        )}
      </div>

      <div className="flex sm:justify-between justify-center items-center sm:flex-row flex-col-reverse w-full sm:mt-[25px] mt-5 gap-5">
        {showSocialShare && (
          <div className="flex sm:justify-start justify-center items-center w-full gap-[10px]">
            {socialButtons.map((button, index) => (
              <div
                key={index}
                className="border border-blue-300 p-3 rounded-full xl:w-11 xl:h-11 w-10 h-10 hover:border-primary hover:bg-primary group flex items-center justify-center cursor-pointer"
                role="button"
                aria-label={`Share on ${button.name}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="fill-primary group-hover:fill-white flex-shrink-0 xl:w-[22px] xl:h-5 w-5 h-[18px]"
                >
                  {button.icon}
                </svg>
              </div>
            ))}
          </div>
        )}

        {hasImages && (
          <div className="flex justify-end items-center xl:gap-6 gap-5">
            <button
              ref={prevRef}
              aria-label="Previous slide"
              className={` ${isBeginning ? "opacity-50 cursor-not-allowed" : "opacity-100"
                }`}
              disabled={isBeginning}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M9.00305 2.12549L1.12891 9.99963M1.12891 9.99963L9.00305 17.8738M1.12891 9.99963L18.9401 9.99963"
                  stroke="black"
                  strokeWidth="1.7998"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              ref={nextRef}
              aria-label="Next slide"
              className={` ${isEnd ? "opacity-50 cursor-not-allowed" : "opacity-100"
                }`}
              disabled={isEnd}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10.9969 2.12549L18.8711 9.99963M18.8711 9.99963L10.9969 17.8738M18.8711 9.99963L1.0599 9.99963"
                  stroke="black"
                  strokeWidth="1.7998"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePageSwiper;
