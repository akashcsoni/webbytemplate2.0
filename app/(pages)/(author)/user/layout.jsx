"use client";
import "@/styles/globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Providers } from "../../providers";
import { HIDE_EARNINGS_TEMPORARILY } from "@/config/theamConfig";
import clsx from "clsx";
import { fontSans } from "@/config/fonts";
import AuthorHeader from "@/components/authorHeader/header";
import { AuthorFooter } from "@/components/authorFooter/footer";
import { useEffect, useState } from "react";
import { strapiGet } from "@/lib/api/strapiClient";

export default function Layout({ children }) {
  const [authUser, setAuthUser] = useState({});
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const normalizePath = (path) => (path ? path.replace(/\/+$/, "") : "");

  const isActive = (path) => {
    const current = normalizePath(pathname);
    const target = normalizePath(path);
    return current === target || current.startsWith(`${target}/`);
  };

  // Get documentId from URL so it's consistent on server and client (avoids hydration mismatch)
  const pathId = pathname?.split("/")?.[2] || "";
  const getDocumentId = () => {
    return authUser?.documentId || authUser?.id || pathId;
  };

  const getTokenData = async () => {
    try {
      const response = await fetch("/api/app-auth/session");
      if (!response.ok) {
        setAuthUser({});
        return;
      }
      const data = await response.json();
      setAuthUser(data?.authUser || {});
      if (data?.authToken) {
        getUserData(data.authToken);
      }
    } catch (error) {
      console.error("Error fetching token data:", error);
      setAuthUser({});
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) getTokenData();
  }, [mounted]);

  const getUserData = async (authToken) => {
    if (!authToken) return;
    try {
      const userData = await strapiGet(`users/me`, {
        params: { populate: "*" },
        token: authToken,
      });
      if (userData) {
        setAuthUser(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Keep existing authUser from session so layout still renders
    }
  };

  return (
    <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
      <div
        className={clsx(
          "min-h-screen bg-blue-300/50 font-sans antialiased",
          fontSans.variable
        )}
      >
        <AuthorHeader authUser={authUser} />
        <section className="2xl:pb-20 lg:pb-[70px] md:pb-[60px] sm:pb-[50px] pb-10">
            <div className="">
              {/* Sidebar: when !mounted use same list for server/client to avoid hydration mismatch */}
              {(!mounted || authUser?.author !== true) ? (
                <div className="bg-white border-y border-primary/10 shadow-sm w-full flex items-center">
                  <div className="container">
                    <ul className="flex items-center lg:justify-start justify-between overflow-auto h-full">
                      {[
                        { id: "profile-settiings", label: "SETTINGS", path: `/user/${pathId}/setting` },
                        { id: "downloads", label: "DOWNLOADS", path: `/user/${pathId}/download` },
                        { id: "earning", label: "EARNINGS", path: `/user/${pathId}/earning` },
                        { id: "ticket-support", label: "SUPPORT", path: `/user/${pathId}/support` },
                        { id: "become-an-author", label: "BECOME AN AUTHOR", path: `/user/${pathId}/become-an-author` },
                      ].filter((tab) => !(HIDE_EARNINGS_TEMPORARILY && tab.id === "earning")).map((tab, index, arr) => (
                        <li
                          key={tab.id}
                          className={`relative flex items-center xl:gap-3 gap-2 cursor-pointer transition flex-shrink-0 h-[46px] px-[35px]`}
                        >
                          <Link
                            href={tab.path}
                            className={`flex items-center xl:gap-3 gap-2 w-full h-full  ${isActive(tab.path)
                              ? "text-primary font-medium border-b-2 border-primary"
                              : "text-black border-b-2 border-transparent hover:border-primary hover:text-primary"
                              }`}
                          >
                            <span className="lg:text-sm text-[13px] font-medium">
                              {tab.label}
                            </span>
                          </Link>
                          {index !== arr.length - 1 && (
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 h-[35px] w-[1px] bg-primary/10" />
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-y border-primary/10 shadow-sm w-full flex items-center">
                  <div className="container">
                    <ul className="flex items-center lg:justify-start justify-between overflow-auto h-full">
                      {[
                        { id: "dashboard", label: "DASHBOARD", path: `/user/${getDocumentId()}/dashboard` },
                        { id: "products", label: "PRODUCTS", path: `/user/${getDocumentId()}/products/list` },
                        { id: "earning", label: "EARNINGS", path: `/user/${getDocumentId()}/earning` },
                        { id: "ticket-support", label: "TICKETS / SUPPORT", path: `/user/${getDocumentId()}/support` },
                        { id: "downloads", label: "DOWNLOADS", path: `/user/${getDocumentId()}/download` },
                        { id: "profile", label: "PROFILE", path: `/user/${getDocumentId()}/profile` },
                        { id: "settiings", label: "SETTINGS", path: `/user/${getDocumentId()}/setting` },
                      ].filter((tab) => !(HIDE_EARNINGS_TEMPORARILY && tab.id === "earning")).map((tab, index, arr) => (
                        <li
                          key={tab.id}
                          className={`relative flex items-center xl:gap-3 gap-2 cursor-pointer transition flex-shrink-0 h-[46px] px-[35px]`}
                        >
                          <Link
                            href={tab.path}
                            className={`flex items-center xl:gap-3 gap-2 w-full h-full  ${isActive(tab.path)
                              ? "text-primary font-medium border-b-2 border-primary"
                              : "text-black border-b-2 border-transparent hover:border-primary hover:text-primary"
                              }`}
                          >
                            <span className="lg:text-sm text-[13px] font-medium">
                              {tab.label}
                            </span>
                          </Link>
                          {index !== arr.length - 1 && (
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 h-[35px] w-[1px] bg-primary/10" />
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Main Content */}
              <div className="container">
                <div className="lg:col-span-3">
                  <main>{children}</main>
                </div>
              </div>
            </div>
          </section>
        <AuthorFooter />
      </div>
      <script
        type="text/javascript"
        src="https://cdn.jsdelivr.net/npm/luxon@2.3.1/build/global/luxon.min.js"
        defer
        async
      />
    </Providers>
  );
}