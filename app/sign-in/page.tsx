"use client";

import LoginButton from "@/components/LoginButton";
import { Card, CardHeader, CardBody, CardFooter, Link } from "@heroui/react";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <Image
        src="/icon.png"
        alt="logo"
        width={100}
        height={100}
        className="mb-4"
      />
      <Card className="max-w-[400px] w-full">
        <CardHeader className="flex gap-8 justify-center">
          <h2 className="text-2xl font-bold">เข้าสู่ระบบ</h2>
        </CardHeader>
        <CardBody className="flex justify-center">
          <LoginButton />
        </CardBody>
      </Card>
    </div>
  );
}
