'use client'

import { Image } from "@heroui/react";
import Link from "next/link";
import React from "react";

const SomethingWrong = () => {
  return (
    <div className="container">
      <div className="flex flex-col items-center justify-center text-center w-full h-full lg:pt-[50px] lg:pb-[100px] sm:pt-10 pt-7 sm:pb-20 pb-10">
        <Image
          src="/images/something-wrong.png"
          width="400"
          height="400"
          alt="Something Wrong Page"
          className="2xl:mb-[35px] lg:mb-[25px] md:mb-4 sm:mb-3 mb-2 2xl:w-[400px] 2xl:h-[400px] lg:w-[350px] lg:h-[350px] md:w-[300px] md:h-[300px] sm:w-[250px] sm:h-[250px] w-[200px] h-[200px]"
        />
        <h2 className="2xl:mb-[18px] lg:mb-[10px] md:mb-2 mb-1.5">
          Something Went Wrong
        </h2>
        <p className="2xl:mb-[38px] mb-[20px] w-[484px] max-w-full">
          We encountered an error. Our team has been notified. Please try again shortly.
        </p>
        <Link href="/" className="btn btn-primary">
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default SomethingWrong;
