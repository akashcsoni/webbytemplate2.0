"use client";
import "@/styles/globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Providers } from "../../providers";
import clsx from "clsx";
import { fontSans } from "@/config/fonts";
import AuthorHeader from "@/components/authorHeader/header";
import { AuthorFooter } from "@/components/authorFooter/footer";
import { useEffect, useState } from "react";
import { strapiGet } from "@/lib/api/strapiClient";

export default function Layout({ children }) {
  const [authUser, setAuthUser] = useState({});
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path;
  };

  const getTokenData = async () => {
    try {
      const response = await fetch("/api/auth/session"); // replace with actual API URL
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAuthUser(data?.authUser || {});
      getUserData(data?.authToken, data?.authUser?.id);
    } catch (error) {
      console.error("Error fetching token data:", error);
    }
  };

  useEffect(() => {
    // Fetch token data when the component mounts
    getTokenData();
  }, []);

  const getUserData = async (authToken) => {
    if (authToken) {
      // console.log(authToken, "authtoken");
      const userData = await strapiGet(`users/me`, {
        params: { populate: "*" },
        token: authToken,
      });

      // const userDataById = await strapiGet(`users/me`, {
      //   params: { populate: "*" },
      //   token: authToken,
      // });

      if (userData) {
        setAuthUser(userData);
      }
    }
  };

  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <script
          type="text/javascript"
          src="https://cdn.jsdelivr.net/npm/luxon@2.3.1/build/global/luxon.min.js"
        />
      </head>
      <body
        className={clsx(
          "min-h-screen bg-blue-300/50 font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <AuthorHeader authUser={authUser} />
          {authUser && (
            <section className="2xl:pb-20 lg:pb-[70px] md:pb-[60px] sm:pb-[50px] pb-10">
              <div className="">
                {/* Sidebar */}
                {authUser?.author === true ? (
                  <div className="bg-white border-y border-primary/10 shadow-sm w-full flex items-center">
                    <div className="container">
                      <ul className="flex items-center lg:justify-start justify-between overflow-auto h-full">
                        {[
                          {
                            id: "dashboard",
                            label: "DASHBOARD",
                            path: `/user/${authUser?.username}/dashboard`,
                          },
                          {
                            id: "products",
                            label: "PRODUCTS",
                            path: `/user/${authUser?.username}/products/list`,
                          },
                          {
                            id: "paymentTax",
                            label: "PAYMENT & TAX SET UP",
                            path: `/user/${authUser?.username}/paymentTax`,
                          },
                          {
                            id: "ticket-support",
                            label: "TICKETS / SUPPORT",
                            path: `/user/${authUser?.username}/support`,
                          },
                          {
                            id: "downloads",
                            label: "DOWNLOADS",
                            path: `/user/${authUser?.username}/download`,
                          },
                          {
                            id: "profile-settiings",
                            label: "PROFILE SETTINGS",
                            path: `/user/${authUser?.username}/setting`,
                          },
                        ].map((tab, index, arr) => (
                          <li
                            key={index}
                            className={`relative flex items-center xl:gap-3 gap-2 cursor-pointer transition flex-shrink-0 h-[46px] px-[35px]`}
                          >
                            <Link
                              href={tab.path}
                              className={`flex items-center xl:gap-3 gap-2 w-full h-full  ${
                                isActive(tab.path)
                                  ? "text-primary font-medium border-b-2 border-primary"
                                  : "text-black border-b-2 border-transparent hover:border-primary hover:text-primary"
                              }`}
                            >
                              <span className="lg:text-sm text-[13px] font-medium">
                                {tab.label}
                              </span>
                            </Link>
                            {/* Short divider (not after last item) */}
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
                          {
                            id: "profile-settiings",
                            label: "PROFILE SETTINGS",
                            path: `/user/${authUser?.username}/setting`,
                          },
                          {
                            id: "downloads",
                            label: "DOWNLOADS",
                            path: `/user/${authUser?.username}/download`,
                          },
                          {
                            id: "ticket-support",
                            label: "SUPPORT",
                            path: `/user/${authUser?.username}/support`,
                          },
                          {
                            id: "become-an-author",
                            label: "BECOME AN AUTHOR",
                            path: `/user/${authUser?.username}/become-an-author`,
                          },
                        ].map((tab, index, arr) => (
                          <li
                            key={index}
                            className={`relative flex items-center xl:gap-3 gap-2 cursor-pointer transition flex-shrink-0 h-[46px] px-[35px]`}
                          >
                            <Link
                              href={tab.path}
                              className={`flex items-center xl:gap-3 gap-2 w-full h-full  ${
                                isActive(tab.path)
                                  ? "text-primary font-medium border-b-2 border-primary"
                                  : "text-black border-b-2 border-transparent hover:border-primary hover:text-primary"
                              }`}
                            >
                              <span className="lg:text-sm text-[13px] font-medium">
                                {tab.label}
                              </span>
                            </Link>
                            {/* Short divider (not after last item) */}
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
          )}
          <AuthorFooter />
        </Providers>
      </body>
    </html>
  );
}
