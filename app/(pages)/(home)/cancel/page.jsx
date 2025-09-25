"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { strapiPost } from "@/lib/api/strapiClient";
import { useSearchParams } from "next/navigation";
import { themeConfig } from "@/config/theamConfig";
import { Suspense } from "react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const verifyStripePayment = async () => {
      if (!sessionId) {
        setStatus("❌ Missing session ID");
        return;
      }

      try {
        const res = await strapiPost(
          "stripe/verify", // ✅ no /api prefix
          { session_id: sessionId },
          themeConfig.TOKEN // ❗optional, only if auth required
        );

        if (res?.success) {
          setStatus("✅ Payment successful! Transaction saved.");
        } else {
          setStatus("⚠️ Payment verified but something went wrong.");
        }
      } catch (err) {
        console.error("Stripe verification failed:", err);
        setStatus("❌ Stripe verification failed.");
      }
    };

    verifyStripePayment();
  }, [sessionId]);

  return <h1>cancel page</h1>;
}

function CheckoutPageLoading() {
  return (
    <div className="container">
      <div className="flex items-center justify-center 1xl:pt-[70px] xl:pt-[60px] md:pt-[50px] sm:pt-[40px] pt-7">
        <div className="lg:w-[706px] w-[600px] max-w-full flex flex-col items-center justify-center">
          <div className="animate-pulse bg-gray-200 rounded-full 1xl:w-[98px] md:w-[92px] w-[74px] 1xl:h-[98px] md:h-[92px] h-[74px] 1xl:mb-[38px] xl:mb-7 md:mb-6 mb-4"></div>
          <div className="animate-pulse bg-gray-200 h-8 w-64 rounded"></div>
        </div>
      </div>
    </div>
  );
}

// // Main component with Suspense wrapper
export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutPageLoading />}>
      <CheckoutContent />
    </Suspense>
  );
}
