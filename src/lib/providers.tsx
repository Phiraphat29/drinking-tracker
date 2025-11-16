"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { SSRProvider } from "@react-aria/ssr";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SSRProvider>
      <HeroUIProvider>
        <ToastProvider placement="top-center" />
        {children}
      </HeroUIProvider>
    </SSRProvider>
  );
}
