// src: https://chakra-ui.com/getting-started/nextjs-guide
"use client";

import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/hooks/use-user";
import { HandleOnComplete } from "@/lib/router-events";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <HandleOnComplete />
        <Toaster />
        {children}
      </ThemeProvider>
    </UserProvider>
  );
}
