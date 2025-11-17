"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { SSRProvider } from "@react-aria/ssr";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SSRProvider>
      <HeroUIProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <ToastProvider placement="top-center" />
          {children}
        </NextThemesProvider>
      </HeroUIProvider>
    </SSRProvider>
  );
}
