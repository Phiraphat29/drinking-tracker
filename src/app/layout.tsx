import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "@/styles/globals.css";
import Providers from "@/lib/providers";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["latin", "thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Drinking Tracker App",
  description: "Track your drinking habits",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Font Awesome */}
        <script
          src="https://kit.fontawesome.com/2d05e739d6.js"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${notoSansThai.className} antialiased select-none h-full`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
