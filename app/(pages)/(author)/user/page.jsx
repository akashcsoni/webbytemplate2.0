"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import PageLoader from "./loading";

export default function UserRootPage() {
  const [authUser, setAuthUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/app-auth/session");
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (data?.authUser) {
            setAuthUser(data.authUser);
          }
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      }
    };
    fetchSession();
    return () => { cancelled = true; };
  }, [pathname]);

  useEffect(() => {
    if (authUser == null) return;
    const documentId = authUser?.documentId || authUser?.id;
    if (documentId) {
      router.replace(`/user/${documentId}/dashboard`);
    }
  }, [authUser, router]);

  return <PageLoader />;
}
