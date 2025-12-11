import "@/styles/globals.css";
import clsx from "clsx";
import { Providers } from "./(pages)/providers";
import TrackPageViewClient from "./(pages)/TrackPageViewClient";
import { fontSans } from "@/config/fonts";

export const metadata = {
  title: "WebbyTemplate",
  description: "Website templates and resources from WebbyTemplate",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={clsx(
          "min-h-screen bg-white font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers>
          <TrackPageViewClient />
          {children}
        </Providers>
      </body>
    </html>
  );
}
