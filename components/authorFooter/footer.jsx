"use client";
import React from "react";
import Image from "next/image";

export function AuthorFooter() {
  return (
    <footer className="bg-primary w-full">
      <div className="container">
        <div className="flex items-center justify-between gap-3 w-full py-6 flex-wrap sm:text-start text-center">
          <p className="p2 !text-white ">
            © 2025 WebbyTemplate.com owned by WebbyCrown Solutions. All rights
            reserved.
          </p>
          <p className="p2 !text-white">Privacy Policy</p>
          <p className="p2 !text-white">Refund Policy</p>
          <Image
            src="/images/payment-card.svg"
            alt="payment-card"
            width={365}
            height={32}
            className="w-[365px] h-[32px]"
          />
        </div>
      </div>
    </footer>
  );
}
