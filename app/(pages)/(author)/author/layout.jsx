"use client";
import "@/styles/globals.css";
// import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Providers } from "../../providers";
import clsx from "clsx";
import { fontSans } from "@/config/fonts";
import AuthorHeader from "@/components/authorHeader/header";
import { AuthorFooter } from "@/components/authorFooter/footer";

export default function Layout({ children }) {
  const pathname = usePathname();
  
  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-blue-300/50 font-sans antialiased",
          fontSans.variable,
        )}
      >
        <AuthorHeader />

        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <section className="xl:pb-[120px] lg:pb-[100px] sm:pb-20 pb-12">
            <div className="">
              {/* Sidebar */}
              <div className="bg-white border-y border-primary/10 shadow-sm w-full flex items-center">
                <div className="container">
                  <ul className=" flex items-center lg:justify-start justify-between lg:gap-5 gap-3 overflow-auto">
                    {[
                      {
                        id: "dashboard",
                        label: "DASHBOARD",
                        path: "/author/account/dashboard",
                      },
                      {
                        id: "products",
                        label: "PRODUCTS",
                        path: "/author/account/products",
                      },
                      {
                        id: "paymentTax",
                        label: "PAYMENT & TAX SET UP",
                        path: "/author/account/paymentTax",
                      },
                      {
                        id: "ticket-support",
                        label: "TICKETS / SUPPORT",
                        path: "/author/account/ticket-support",
                      },
                      {
                        id: "downloads",
                        label: "DOWNLOADS",
                        path: "/author/account/downloads",
                      },
                      {
                        id: "profile-settiings",
                        label: "PROFILE SETTINGS",
                        path: "/author/account/profileSetting",
                      },
                    ].map((tab) => (
                      <li
                        key={tab.id}
                        className={`flex items-center xl:gap-3 gap-2 cursor-pointer transition flex-shrink-0`}
                      >
                        <Link
                          href={tab.path}
                          className={`flex items-center xl:gap-3 gap-2 xl:px-6 p-3 2xl:py-4 w-full ${
                            isActive(tab.path)
                              ? "text-primary font-medium border-b-2 border-primary"
                              : "text-black border-b-2 border-transparent hover:border-primary hover:text-primary"
                          }`}
                        >
                          <span className="lg:text-sm text-[13px] font-medium">
                            {tab.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Main Content */}
              <div className="container">
                <div className="lg:col-span-3">
                  <main>{children}</main>
                </div>
              </div>
            </div>
          </section>
        </Providers>
        <AuthorFooter />
      </body>
    </html>
  );
}
