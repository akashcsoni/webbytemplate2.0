"use client";

import { themeConfig } from "@/config/theamConfig";
import { useAuth } from "@/contexts/AuthContext";
import { strapiGet, strapiPost } from "@/lib/api/strapiClient";
import {
  Button,
  Checkbox,
  Image,
  Link,
} from "@heroui/react";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import AuthorOnboardingWizard from "@/components/pageSections/AuthorOnboardingWizard";
import PageLoader from "../../loading";

const page = () => {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [checkingResume, setCheckingResume] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const { authUser, authToken } = useAuth();

  // Allow session/auth to hydrate before deciding; after delay, treat "no auth" as not logged in
  useEffect(() => {
    const t = setTimeout(() => setSessionReady(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const checkResume = async () => {
      if (!authUser || !authToken) {
        if (sessionReady) setCheckingResume(false);
        return;
      }
      setCheckingResume(true);
      try {
        const status = await strapiGet("author/onboarding/status", { token: authToken });
        if (status?.step >= 1) {
          setShowWizard(true);
        }
      } catch (e) {
        /* ignore - user may not have started */
      } finally {
        setCheckingResume(false);
      }
    };
    checkResume();
  }, [authUser, authToken, sessionReady]);

  const handleCheckboxChange = (checked) => {
    setIsChecked(checked);
  };

  const handleBecomeAuthor = async () => {
    if (!isChecked) return;

    setLoading(true);
    try {
      const token = authToken || themeConfig.TOKEN;
      await strapiPost("author/onboarding/start", {}, token);
      setShowWizard(true);
    } catch (error) {
      const errMsg = error?.response?.data?.error?.message || error?.message || "An error occurred. Please try again.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const hasAuth = Boolean(authUser && authToken);
  const showLoader = !sessionReady || (hasAuth && checkingResume);
  if (showLoader) {
    return <PageLoader />;
  }

  if (showWizard) {
    return <AuthorOnboardingWizard />;
  }

  return (
    <>
      {/* Toast container for react-hot-toast */}
      <div>
        <h1 className="h2 mb-5 mt-[30px]">Become an Author</h1>
        <div className="flex items-center justify-between lg:flex-row flex-col 2xl:gap-[148px] 1xl:gap-[85px] xl:gap-[50px] sm:gap-6 gap-4 border border-primary/10 rounded-md overflow-hidden mb-[20px] bg-white 1xl:p-[50px] xl:p-10 sm:p-6 p-4">
          <div className="lg:w-1/2">
            <h1 className="h2 1xl:mb-7 xl:mb-[18px] mb-2">Let's get started!</h1>
            <p className="!font-normal 2xl:text-xl 1xl:text-[19px] xl:text-lg sm:text-base text-[15px] sm:leading-[30px] leading-[22px] 1xl:mb-6 xl:mb-4 mb-3 text-black">
              We are currently open for new Authors who specialize in:
            </p>
            <ul className="1xl:mb-6 mb-4 1xl:space-y-3 space-y-2">
              <li className="flex items-center justify-start gap-[10px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  className="xl:w-[17px] xl:h-[17px] w-[15px] h-[15px]"
                >
                  <g clipPath="url(#clip0_4840_838)">
                    <path
                      opacity="0.4"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z"
                      fill="#0156D5"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z"
                      fill="#0156D5"
                    />
                  </g>
                </svg>
                <p className="p2">HTML Templates</p>
              </li>
              <li className="flex items-center justify-start gap-[10px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  className="xl:w-[17px] xl:h-[17px] w-[15px] h-[15px]"
                >
                  <g clipPath="url(#clip0_4840_838)">
                    <path
                      opacity="0.4"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z"
                      fill="#0156D5"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z"
                      fill="#0156D5"
                    />
                  </g>
                </svg>
                <p className="p2">Headless Templates</p>
              </li>
              <li className="flex items-center justify-start gap-[10px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  className="xl:w-[17px] xl:h-[17px] w-[15px] h-[15px]"
                >
                  <g clipPath="url(#clip0_4840_838)">
                    <path
                      opacity="0.4"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z"
                      fill="#0156D5"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z"
                      fill="#0156D5"
                    />
                  </g>
                </svg>
                <p className="p2">UI Templates</p>
              </li>
              <li className="flex items-center justify-start gap-[10px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  className="xl:w-[17px] xl:h-[17px] w-[15px] h-[15px]"
                >
                  <g clipPath="url(#clip0_4840_838)">
                    <path
                      opacity="0.4"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z"
                      fill="#0156D5"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z"
                      fill="#0156D5"
                    />
                  </g>
                </svg>
                <p className="p2">Plugins</p>
              </li>
              <li className="flex items-center justify-start gap-[10px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  className="xl:w-[17px] xl:h-[17px] w-[15px] h-[15px]"
                >
                  <g clipPath="url(#clip0_4840_838)">
                    <path
                      opacity="0.4"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z"
                      fill="#0156D5"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z"
                      fill="#0156D5"
                    />
                  </g>
                </svg>
                <p className="p2">Graphics</p>
              </li>
              <li className="flex items-center justify-start gap-[10px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  className="xl:w-[17px] xl:h-[17px] w-[15px] h-[15px]"
                >
                  <g clipPath="url(#clip0_4840_838)">
                    <path
                      opacity="0.4"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z"
                      fill="#0156D5"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z"
                      fill="#0156D5"
                    />
                  </g>
                </svg>
                <p className="p2">Stock Photos</p>
              </li>
            </ul>

            <p className="p2 1xl:mb-[22px] mb-4">
              We are currently accepting new authors across all categories. To
              express your interest and get started, please proceed to the next
              step.
            </p>

            <div className="flex items-start justify-start w-full 1xl:mb-[26px] mb-4">
              <Checkbox
                isSelected={isChecked}
                onValueChange={handleCheckboxChange}
                classNames={{
                  base: "bg-white hover:!bg-white flex items-start",
                  label: "p2 italic",
                  wrapper:
                    "hover:!bg-white sm:w-[18px] sm:h-[18px] w-4 h-4 mt-0.5 !rounded-none",
                }}
                radius="sm"
              >
                I confirm that I am 18 years of age or older and agree to the
                WebbyTemplate{" "}
                <Link
                  href="javascript:;"
                  className="2xl:text-base md:text-[15px] text-sm leading-5"
                >
                  {" "}
                  Author
                </Link>{" "}
                and{" "}
                <Link
                  href="javascript:;"
                  className="2xl:text-base md:text-[15px] text-sm leading-5"
                >
                  {" "}
                  General Terms
                </Link>
                , as well as WebbyTemplate's{" "}
                <Link
                  href="javascript:;"
                  className="2xl:text-base md:text-[15px] text-sm leading-5"
                >
                  {" "}
                  Privacy Policy.
                </Link>
              </Checkbox>
            </div>
            <Button className="btn btn-primary" onPress={handleBecomeAuthor} isDisabled={!isChecked || loading}>
              {loading ? "Processing..." : "Start Onboarding"}
            </Button>
          </div>
          <div className="lg:w-1/2">
            <Image
              src="/images/become-an-author.png"
              width="638"
              height="620"
              className="rounded-lg w-full h-full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;