"use client";

import { DashboardClientProps, Log } from "@/types/database";
import { useState, useEffect } from "react";
import { addToast, Button } from "@heroui/react";
import SettingModal from "@/components/modal/SettingModal";
import NavBar from "@/components/NavBar";
import AddLogModal from "@/components/modal/AddLogModal";
import LogTable from "@/components/LogTable";
import Footer from "@/components/Footer";
import StatsCard from "@/components/StatsCard";
import DateFilterHeader from "@/components/DateFilterHeader";
import { getLocalTimeZone, CalendarDate } from "@internationalized/date";
import type { RangeValue } from "@react-types/shared";
import type { DateValue } from "@react-types/datepicker";

export default function DashboardClient({
  user,
  profile,
  logs,
}: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddLogModalOpen, setIsAddLogModalOpen] = useState(false);

  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(
    null
  );

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

  // สร้างตัวแปรสำหรับ Logs ที่ผ่านการกรองแล้ว
  const filteredLogs = logs.filter((log) => {
    if (!log) return false;
    if (!dateRange) return true;

    const logDate = new Date(log.created_at);
    const tz = getLocalTimeZone();

    // แปลง DateValue เป็น JS Date
    // start: เวลา 00:00:00 ของวันที่เริ่ม
    const startDate = (dateRange.start as CalendarDate).toDate(tz);
    // end: เวลา 00:00:00 ของวันที่สิ้นสุด -> เราต้องปรับให้เป็น 23:59:59 เพื่อครอบคลุมทั้งวัน
    const endDate = (dateRange.end as CalendarDate).toDate(tz);
    endDate.setHours(23, 59, 59, 999);

    return logDate >= startDate && logDate <= endDate;
  });

  const totalVolume = filteredLogs.reduce(
    (acc, log) => acc + (log?.amount_ml || 0),
    0
  );

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
        className="fixed bottom-6 right-6 max-sm:bottom-10 max-sm:right-4 z-50 h-15 w-15 rounded-full rounded-tr-none -rotate-45 flex items-center justify-center text-2xl bg-linear-to-b from-blue-400 to-blue-600 dark:bg-linear-to-b dark:from-blue-500 dark:to-cyan-500"
        onPress={() => setIsAddLogModalOpen(true)}
      >
        <span className="rotate-45">+</span>
      </Button>

      <main className="flex-1">
        <div className="flex flex-col gap-2 mx-auto max-w-4xl px-4 py-4">
          <StatsCard
            logs={logs.filter((log) => log !== null) as Log[]}
            dailyGoal={profile?.daily_goal_ml || 0}
          />
        </div>

        <div className="flex flex-col gap-2 mx-auto max-w-4xl px-4">
          <div className="flex justify-end">
            <DateFilterHeader
              value={dateRange}
              onChange={setDateRange}
              totalVolume={totalVolume}
            />
          </div>
          <LogTable logs={filteredLogs} dateRange={dateRange} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
