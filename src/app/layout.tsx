import type { Metadata } from "next";
import { Akshar } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import GoogleAnalytics from "./GoogleAnalytics";
import Hotjar from "./Hotjar";

import { useCookies } from "react-cookie";
import useUser from "@/hooks/use-user";
import { useEffect } from "react";

const fontSans = Akshar({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "dhamma",
  description: "Baas - Blessing As A Service, a simple way to bless your life.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? (
          <GoogleAnalytics
            ga_id={process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}
          />
        ) : null}
        {process.env.NEXT_PUBLIC_HOTJAR_ID ? (
          <Hotjar hjid={process.env.NEXT_PUBLIC_HOTJAR_ID} />
        ) : null}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
