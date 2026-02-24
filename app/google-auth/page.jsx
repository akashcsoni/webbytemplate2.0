"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getSession, signOut } from "next-auth/react";
import { strapiPost } from "@/lib/api/strapiClient";

function getErrorMessage(error) {
  if (!error) return "Google login failed. Please try again.";
  const data = error?.response?.data;
  if (data?.error?.message) return data.error.message;
  if (data?.message) return data.message;
  if (data?.data && Array.isArray(data.data)) {
    const messages = data.data
      .map((err) => err.messages?.[0]?.message || err.message)
      .filter(Boolean);
    if (messages.length) return messages.join(" ");
  }
  return error?.message || "Google login failed. Please try again.";
}

export default function GoogleAuthPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Processing Google login...");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const session = await getSession();
        const idToken = session?.googleIdToken;

        if (!idToken) {
          if (cancelled) return;
          setError("Google session not found. Please try again.");
          setIsLoading(false);
          await signOut({ redirect: false });
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

        await signOut({ redirect: false });

        if (cancelled) return;
        setStatus("Login successful. Redirecting...");
        router.replace("/");
        router.refresh();
      } catch (e) {
        console.error(e);
        if (cancelled) return;
        setError(getErrorMessage(e));
        setIsLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (error) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 p-6 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">
            Google login failed
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Back to home
            </Link>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setIsLoading(true);
                setStatus("Processing Google login...");
                router.replace("/");
              }}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-md bg-primary text-white hover:opacity-90 transition-opacity text-sm font-medium"
            >
              Try again with email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {isLoading && (
          <p className="text-gray-600 dark:text-gray-400">{status}</p>
        )}
      </div>
    </div>
  );
}

