import "@/styles/globals.css";
import clsx from "clsx";
import { Providers } from "../providers";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import Header from "@/components/header/header";
import { FooterFooterContainer } from "@/components/footer/footer-container";
import Script from "next/script";

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
        {/* Preload critical fonts for better performance */}
        <link
          rel="preload"
          href="/assets/fonts/ProductSans-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/assets/fonts/ProductSans-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/assets/fonts/ProductSans-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Preload critical images for better LCP */}
        <link
          rel="preload"
          as="image"
          href="/logo/webby-logo.svg"
          type="image/svg+xml"
        />
        <link
          rel="preload"
          as="image"
          href="/images/place_holder.png"
          type="image/png"
        />
        <link
          rel="preload"
          as="image"
          href="/images/no-image.svg"
          type="image/svg+xml"
        />

        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="//checkout.razorpay.com" />
        <link rel="dns-prefetch" href="//studio.webbytemplate.com" />

        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://studio.webbytemplate.com" />

        {/* Resource hints for better performance */}
        <link rel="prefetch" href="/api/auth/session" />
        <link rel="prefetch" href="/api/cart-cookie" />

        {/* Critical CSS inlining would go here if needed */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical font loading optimization */
            @font-face {
              font-family: 'Product Sans';
              src: url('/assets/fonts/ProductSans-Regular.woff2') format('woff2');
              font-weight: 400;
              font-style: normal;
              font-display: swap;
            }
            /* Prevent layout shift during font loading */
            body { font-family: 'Product Sans', system-ui, -apple-system, sans-serif; }
          `
        }} />
      </head>
      <body
        className={clsx(
          "min-h-screen bg-white font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <Header />
          <main>{children}</main>
          <FooterFooterContainer />
        </Providers>
        <Script
          dangerouslySetInnerHTML={{
            __html: `window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}`,
          }}
        />
        <Script
          id="zsiqscript"
          src="https://salesiq.zohopublic.in/widget?wc=siq80204715dc712d38f147a31f84d9ae62cfb628ce61feff32ab93ec9655c75845"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
