"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getSession, signOut } from "next-auth/react";
import { strapiPost } from "@/lib/api/strapiClient";

export default function GoogleAuthPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Processing Google login...");
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const session = await getSession();
        const idToken = session?.googleIdToken;

        if (!idToken) {
          setError("Google session not found. Please try again.");
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

        // Optional: sign out of NextAuth session after exchange (we use Strapi cookies as auth source)
        await signOut({ redirect: false });

        if (cancelled) return;
        setIsSuccess(true);
        setStatus("Login successful! Redirecting...");

        // Auto redirect after success
        setTimeout(() => {
          if (!cancelled) {
            router.replace("/");
            router.refresh();
          }
        }, 2000);

      } catch (e) {
        console.error(e);
        if (cancelled) return;

        // Handle Strapi API errors properly
        let errorMessage = "Google login failed. Please try again.";

        if (e?.response?.data?.error?.message) {
          errorMessage = e.response.data.error.message;
        } else if (e?.message) {
          errorMessage = e.message;
        }

        setError(errorMessage);
        setStatus("");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleRetry = () => {
    setError(null);
    setStatus("Retrying Google login...");
    // Reload the page to restart the process
    window.location.reload();
  };

  const handleGoHome = () => {
    router.replace("/");
  };

  if (error) {
    return (
      <div style={{
        padding: 24,
        maxWidth: 600,
        margin: "0 auto",
        textAlign: "center",
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{
          backgroundColor: "#fee",
          border: "1px solid #fcc",
          borderRadius: 8,
          padding: 24,
          marginBottom: 20,
          width: "100%"
        }}>
          <h2 style={{
            color: "#c33",
            marginBottom: 16,
            fontSize: "1.5rem",
            fontWeight: "bold"
          }}>
            Login Failed
          </h2>
          <p style={{
            color: "#666",
            marginBottom: 20,
            fontSize: "1.1rem",
            lineHeight: 1.5
          }}>
            {error}
          </p>
          <p style={{
            color: "#888",
            fontSize: "0.9rem",
            marginBottom: 24
          }}>
            If you registered with email/password, please use those credentials to login.
            If you need to link your Google account, please contact support.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={handleRetry}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500"
            }}
          >
            Try Again
          </button>
          <button
            onClick={handleGoHome}
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500"
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div style={{
        padding: 24,
        maxWidth: 600,
        margin: "0 auto",
        textAlign: "center",
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{
          backgroundColor: "#efe",
          border: "1px solid #cfc",
          borderRadius: 8,
          padding: 24,
          marginBottom: 20,
          width: "100%"
        }}>
          <h2 style={{
            color: "#363",
            marginBottom: 16,
            fontSize: "1.5rem",
            fontWeight: "bold"
          }}>
            ✅ Success!
          </h2>
          <p style={{
            color: "#666",
            marginBottom: 0,
            fontSize: "1.1rem"
          }}>
            {status}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: 24,
      maxWidth: 600,
      margin: "0 auto",
      textAlign: "center",
      minHeight: "50vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        borderRadius: 8,
        padding: 24,
        width: "100%"
      }}>
        <div style={{
          display: "inline-block",
          width: 40,
          height: 40,
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #007bff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: 16
        }} />
        <p style={{
          color: "#666",
          marginBottom: 0,
          fontSize: "1.1rem"
        }}>
          {status}
        </p>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

