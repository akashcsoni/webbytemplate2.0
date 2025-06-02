"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default async function Home() {
  const [authUser, setAuthUser] = useState({});
  const pathname = usePathname();
  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        if (data.authUser) {
          setAuthUser(data.authUser);
        }
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [pathname]);

  return document.location.replace(`/user/${authUser.username}/dashboard`);
}
