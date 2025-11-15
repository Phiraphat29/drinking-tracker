"use client";

import LoginButton from "@/components/LoginButton";
import { Card, CardHeader, CardBody } from "@heroui/react";
import Image from "next/image";
import "@/styles/wave.css";

export default function SignInPage() {
  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center overflow-hidden">
      {/* Waves background */}
      <div className="sign-in-waves" aria-hidden="true">
        <div className="wave wave--1"></div>
        <div className="wave wave--2"></div>
        <div className="wave wave--3"></div>
      </div>
      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="isBlurred backdrop-blur-xl bg-white/80 shadow-2xl border border-white/20 rounded-4xl animate-slide-up">
          <CardHeader className="flex flex-col pt-8 gap-4 justify-center">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
                ยินดีต้อนรับ
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                ติดตามการดื่มน้ำของคุณ
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-2xl animate-pulse-slow"></div>
              <Image
                src="/logo.png"
                alt="Water Logo"
                width={120}
                height={120}
                priority
                className="mx-auto relative z-10 drop-shadow-2xl transition-transform duration-300"
              />
            </div>

            <div>
              <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                เข้าสู่ระบบ
              </h2>
            </div>
          </CardHeader>

          <CardBody className="pt-4 px-6 flex flex-col items-center justify-center gap-2 min-h-20">
            <LoginButton />
            <div className="mt-6 flex items-center gap-3">
              <span className="text-xs text-gray-400 ">ปลอดภัย & รวดเร็ว</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
