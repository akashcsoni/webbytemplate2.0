"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { trackPageView } from "@/lib/utils/trackUser";

export default function TrackPageViewClient() {
  const pathname = usePathname();
  const { authUser, authLoading } = useAuth();
  const prevPathRef = useRef(null);
  const lastTrackedRef = useRef({ path: null, time: 0 });

  useEffect(() => {
    if (authLoading) return;

    const user_id = authUser?.id || null;

    // Avoid firing twice for same path within 1 second (debounce)
    const now = Date.now();
    if (
      lastTrackedRef.current.path === pathname &&
      now - lastTrackedRef.current.time < 1000
    ) {
      return;
    }

    // Determine referer
    const referer = prevPathRef.current
      ? `${window.location.origin}${prevPathRef.current}`
      : document.referrer || "";

    console.log("📡 Tracking page view:", { user_id, pathname, referer });

    trackPageView({ user_id, referer });

    // Update references
    prevPathRef.current = pathname;
    lastTrackedRef.current = { path: pathname, time: now };
  }, [pathname, authUser, authLoading]);

  return null;
}
