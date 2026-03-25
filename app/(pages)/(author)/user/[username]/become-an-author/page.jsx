"use client";

import { useAuth } from "@/contexts/AuthContext";
import { strapiGet, strapiPost } from "@/lib/api/strapiClient";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import AuthorOnboardingWizard from "@/components/pageSections/AuthorOnboardingWizard";
import PageLoader from "../../loading";

const page = () => {
  const [checkingResume, setCheckingResume] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const { authUser, authToken } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setSessionReady(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const ensureOnboarding = async () => {
      if (!sessionReady || !authUser || !authToken) {
        if (sessionReady) setCheckingResume(false);
        return;
      }
      setCheckingResume(true);
      try {
        const status = await strapiGet("author/onboarding/status", { token: authToken });
        if (!(status?.step >= 1)) {
          await strapiPost("author/onboarding/start", {}, authToken);
        }
      } catch (error) {
        const errMsg =
          error?.response?.data?.error?.message ||
          error?.message ||
          "Failed to start onboarding.";
        toast.error(errMsg);
      } finally {
        setCheckingResume(false);
      }
    };
    ensureOnboarding();
  }, [sessionReady, authUser, authToken]);

  const hasAuth = Boolean(authUser && authToken);
  const showLoader = !sessionReady || (hasAuth && checkingResume);

  if (showLoader) {
    return <PageLoader />;
  }

  if (!hasAuth) {
    return <PageLoader />;
  }

  return <AuthorOnboardingWizard />;
};

export default page;
