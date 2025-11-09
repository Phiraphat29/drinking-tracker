"use client";

import LoginButton from "@/components/LoginButton";
import { Card, CardHeader, CardBody } from "@heroui/react";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-blue-900 dark:to-cyan-900">
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Welcome text above card */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
            ยินดีต้อนรับ
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            ติดตามการดื่มน้ำของคุณ
          </p>
        </div>

        {/* Glassmorphism Card */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 shadow-2xl border border-white/20 dark:border-gray-700/50 animate-slide-up">
          <CardHeader className="flex flex-col gap-4 justify-center pt-8 pb-4">
            {/* Logo with glow effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400/30 dark:bg-blue-400/20 rounded-full blur-2xl animate-pulse-slow"></div>
              <Image
                src="/icon.png"
                alt="Water Logo"
                width={120}
                height={120}
                priority
                className="mx-auto relative z-10 drop-shadow-2xl hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                เข้าสู่ระบบ
              </h2>
            </div>
          </CardHeader>

          <CardBody className="px-8 py-8 flex flex-col items-center justify-center gap-2 min-h-20">
            <LoginButton />

            {/* Decorative divider */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                ปลอดภัย & รวดเร็ว
              </span>
            </div>
          </CardBody>
        </Card>

        {/* Footer text */}
        <p className="text-center mb-6 text-sm text-gray-500 dark:text-gray-400 animate-fade-in-delay">
          เข้าสู่ระบบเพื่อเริ่มติดตามการดื่มน้ำประจำวันของคุณ 💧
        </p>
      </div>
    </div>
  );
}
