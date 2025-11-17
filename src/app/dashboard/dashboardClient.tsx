"use client";

import { DashboardClientProps } from "@/types/database";
import { useState, useEffect } from "react";
import { addToast, Button } from "@heroui/react";
import SettingModal from "@/components/modal/SettingModal";
import NavBar from "@/components/NavBar";
import AddLogModal from "@/components/modal/AddLogModal";
import LogTable from "@/components/LogTable";
import Footer from "@/components/Footer";

export default function DashboardClient({
  user,
  profile,
  logs,
}: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddLogModalOpen, setIsAddLogModalOpen] = useState(false);

  //* Show toast after sign-in success
  useEffect(() => {
    const displayName = profile?.username || user.email;
    addToast({
      title: `คุณกำลังเข้าสู่ระบบในฐานะ ${displayName}`,
      color: "success",
    });
  }, []);

  //* Show modal if daily goal or username is null
  useEffect(() => {
    if (profile?.daily_goal_ml === null || profile?.username === null) {
      setIsModalOpen(true);
    }
  }, [profile]);

  //* Show notification if user doesn't add drinking log in 2 hours by using interval
  useEffect(() => {
    const interval = setInterval(() => {
      const lastLog = logs[0];
      if (!lastLog) return;

      const lastLogTime = new Date(lastLog.created_at).getTime();
      const now = Date.now();
      const twoHour = 2 * 60 * 60 * 1000;

      if (now - lastLogTime > twoHour) {
        new Notification("คุณยังไม่ได้ดื่มน้ำมา 2 ชั่วโมงแล้ว!", {
          body: "จิบน้ำสักหน่อยนะ!",
          icon: "/icon.png",
        });
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [logs]);

  return (
    <div className="min-h-dvh flex flex-col">
      <NavBar user={user} profile={profile} />

      <SettingModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        userId={user.id}
        profile={profile}
        mode="onboarding"
      />
      <AddLogModal
        isOpen={isAddLogModalOpen}
        onOpenChange={setIsAddLogModalOpen}
        userId={user.id}
      />

      <Button
        aria-label="Add log"
        color="primary"
        variant="shadow"
        isIconOnly
        className="fixed bottom-6 right-6 max-sm:bottom-10 max-sm:right-4 z-50 h-15 w-15 rounded-full flex items-center justify-center text-2xl"
        onPress={() => setIsAddLogModalOpen(true)}
      >
        +
      </Button>

      <main className="flex-1">
        <div className="flex flex-col gap-2 mx-auto max-w-7xl px-4 py-8 pb-10">
          <LogTable logs={logs} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
