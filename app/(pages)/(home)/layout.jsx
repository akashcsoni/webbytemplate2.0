import "@/styles/globals.css";
import clsx from "clsx";
import { Providers } from "../providers";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import Header from "@/components/header/header";
import { FooterFooterContainer } from "@/components/footer/footer-container";
import Script from "next/script";
import React from 'react';
import TrackPageViewClient from "../TrackPageViewClient";

export const metadata = {
  title: {
    default: siteConfig.name,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://salesiq.zohopublic.in" />
        <link rel="dns-prefetch" href="https://studio.webbytemplate.com" />
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "tr0nh7k6rz");
          `}
        </Script>
      </head>
      <body
        className={clsx(
          "min-h-screen bg-white font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <TrackPageViewClient />
          <Header />
          <main>{children}</main>
          <FooterFooterContainer />
        </Providers>
        <Script
          dangerouslySetInnerHTML={{
            __html: `window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}`,
          }}
          strategy="lazyOnload"
        />
        {/* Google Analytics - Deferred to reduce main-thread blocking */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W2K9LVCP3D"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W2K9LVCP3D', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        <Script
          id="zsiqscript"
          src="https://salesiq.zohopublic.in/widget?wc=siq80204715dc712d38f147a31f84d9ae62cfb628ce61feff32ab93ec9655c75845"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
