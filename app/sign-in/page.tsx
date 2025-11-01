"use client";

import LoginButton from "@/components/LoginButton";
import { Card, CardHeader, CardBody } from "@heroui/react";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <Card className="max-w-[400px] w-200 h-auto">
        <CardHeader className="flex flex-col gap-2 justify-center">
          <Image
            src="/icon.png"
            alt="logo"
            width={100}
            height={100}
            className="mx-auto"
          />
          <h2 className="text-2xl font-bold">เข้าสู่ระบบ</h2>
        </CardHeader>
        <CardBody>
          <LoginButton />
        </CardBody>
      </Card>
    </div>
  );
}
