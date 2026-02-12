"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getSession, signOut } from "next-auth/react";
import { strapiPost } from "@/lib/api/strapiClient";

export default function GoogleAuthPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Processing Google login...");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const session = await getSession();
        const idToken = session?.googleIdToken;

        if (!idToken) {
          setStatus("Google session not found. Please try again.");
          // Ensure any partial NextAuth state is cleared
          await signOut({ redirect: false });
          router.replace("/");
          return;
        }

        const cart_id = Cookies.get("cart_id") || 0;
        const wishlist_id = Cookies.get("wishlist_id") || 0;

        setStatus("Connecting your Google account to WebbyTemplate...");

        const res = await strapiPost("auth/google", {
          id_token: idToken,
          cart_id,
          wishlist_id,
        });

        if (!res?.jwt || !res?.user) {
          throw new Error("Invalid response from backend");
        }

        setStatus("Setting login session...");

        const query = {
          token: res.jwt,
          user: JSON.stringify(res.user),
        };
        const queryString = Object.entries(query)
          .filter(([_, value]) => value != null)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join("&");

        const cookieResponse = await fetch(`/api/app-auth/login?${queryString}`);
        if (!cookieResponse.ok) {
          throw new Error("Failed to set authentication cookies");
        }

        // Optional: sign out of NextAuth session after exchange (we use Strapi cookies as auth source)
        await signOut({ redirect: false });

        if (cancelled) return;
        setStatus("Login successful. Redirecting...");
        router.replace("/");
        router.refresh();
      } catch (e) {
        console.error(e);
        if (cancelled) return;
        setStatus(
          e?.message || "Google login failed. Please try again."
        );
        router.replace("/");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div style={{ padding: 24 }}>
      <p>{status}</p>
    </div>
  );
}

