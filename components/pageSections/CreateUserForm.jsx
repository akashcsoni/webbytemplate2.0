"use client";

import { Skeleton } from "@heroui/react";
import { useState, useEffect } from "react";
import { strapiGet } from "@/lib/api/strapiClient";
import AccountInformationForm from "./AccountInformationForm";
import BillingInformationForm from "./BillingInformationForm";
// import SecurityForm from "./SecurityForm";

const profileSetting = ({ title, sub_title, form, button }) => {
  // Skeleton loader component
  const FormSkeleton = () => (
    <div className="space-y-6">
      {/* Account Information Skeleton */}
      <div className="border border-primary/10 rounded-md overflow-hidden bg-white">
        <div className="border-b border-primary/10 sm:px-5 px-3 py-[6px] bg-white">
          <Skeleton className="h-6 w-48 rounded" />
        </div>
        <div className="sm:py-6 py-4">
          <div className="flex flex-wrap">
            <div className="w-full sm:w-full md:w-1/2 xl:w-1/2 !p-[5px]">
              <Skeleton className="h-4 w-20 mb-2 rounded" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
            <div className="w-full sm:w-full md:w-1/2 xl:w-1/2 !p-[5px]">
              <Skeleton className="h-4 w-20 mb-2 rounded" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
            <div className="w-full sm:w-full md:w-1/2 xl:w-1/2 !p-[5px]">
              <Skeleton className="h-4 w-24 mb-2 rounded" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
            <div className="w-full sm:w-full md:w-1/2 xl:w-1/2 !p-[5px]">
              <Skeleton className="h-4 w-28 mb-2 rounded" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
          </div>
          <Skeleton className="h-11 w-[220px] rounded-md mt-5" />
        </div>
      </div>

      {/* Billing Information Skeleton */}
      <div className="border border-primary/10 rounded-md overflow-hidden bg-white">
        <div className="border-b border-primary/10 sm:px-5 px-3 py-[6px] bg-white">
          <Skeleton className="h-6 w-48 rounded" />
        </div>
        <div className="sm:py-6 py-4">
          <div className="flex flex-wrap">
            <div className="w-full sm:w-full md:w-1/2 xl:w-1/2 !p-[5px]">
              <Skeleton className="h-4 w-32 mb-2 rounded" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
            <div className="w-full sm:w-full md:w-1/2 xl:w-1/2 !p-[5px]">
              <Skeleton className="h-4 w-28 mb-2 rounded" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
            <div className="w-full !p-[5px]">
              <Skeleton className="h-4 w-20 mb-2 rounded" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
            <div className="w-full sm:w-full md:w-1/3 xl:w-1/3 !p-[5px]">
              <Skeleton className="h-4 w-16 mb-2 rounded" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
            <div className="w-full sm:w-full md:w-1/3 xl:w-1/3 !p-[5px]">
              <Skeleton className="h-4 w-20 mb-2 rounded" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
            <div className="w-full sm:w-full md:w-1/3 xl:w-1/3 !p-[5px]">
              <Skeleton className="h-4 w-24 mb-2 rounded" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
            <div className="w-full sm:w-full md:w-1/3 xl:w-1/3 !p-[5px]">
              <Skeleton className="h-4 w-24 mb-2 rounded" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
          </div>
          <Skeleton className="h-11 w-[220px] rounded-md mt-5" />
        </div>
      </div>
    </div>
  );

  const [fromSetLoading, setFromSetLoading] = useState(true);
  const [defaultValueData, setDefaultValueData] = useState({});

  const getTokenData = async () => {
    try {
      const response = await fetch("/api/app-auth/session");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching token data:", error);
    }
  };

  const getUserData = async () => {
    setFromSetLoading(true);
    const { authToken } = await getTokenData();
    if (authToken) {
      const userData = await strapiGet(`users/me`, {
        params: { populate: "*" },
        token: authToken,
      });
      if (userData) {
        setDefaultValueData(userData);
        setFromSetLoading(false);
      }
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="sm:py-6 py-4">
      {fromSetLoading ? (
        <FormSkeleton />
      ) : (
        form && defaultValueData && (
          <div className="space-y-6">
            {/* Account Information Section */}
            <AccountInformationForm button={button} userData={defaultValueData} />

            {/* Billing Information Section */}
            <BillingInformationForm button={button} userData={defaultValueData} />

            {/* Security Section */}
            {/* <SecurityForm button={button} /> */}
          </div>
        )
      )}
    </div>
  );
};

export default profileSetting;
