import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "@/styles/globals.css";
import Providers from "@/lib/providers";
import Bg from "@/components/Bg";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["latin", "thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Drinking Tracker App",
  description: "เว็บแอปสำหรับติดตามการดื่มน้ำของคุณ",
  keywords: ["ติดตามการดื่มน้ำ", "การดื่มน้ำ", "drinking tracker", "drink"],
  authors: [
    { name: "Phiraphat Loratsachan", url: "https://github.com/Phiraphat29" },
    {
      name: "Thayakorn Koomphai",
      url: "https://github.com/6652410026ThayakornKoomphai",
    },
  ],
  openGraph: {
    title: "Drinking Tracker App",
    description: "เว็บแอปสำหรับติดตามการดื่มน้ำของคุณ",
    url: "https://drinking-tracker.vercel.app",
    images: "/icon.png",
  },
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
    <html lang="en" className="min-h-dvh" suppressHydrationWarning>
      <head>
        {/* Font Awesome */}
        <script
          src="https://kit.fontawesome.com/2d05e739d6.js"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${notoSansThai.className} antialiased select-none h-full relative`}
      >
        <Providers>
          <Bg />
          {children}
        </Providers>
      </body>
    </html>
  );
}
