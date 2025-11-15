"use client";

import { DashboardClientProps } from "@/types/database";
import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  addToast,
} from "@heroui/react";
import GoalModal from "@/components/modal/GoalModal";
import NavBar from "@/components/NavBar";

export default function DashboardClient({
  user,
  profile,
  logs,
}: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  //* Show toast after sign-in success
  useEffect(() => {
    const displayName = profile?.username || user.email;
    addToast({
      title: `คุณกำลังเข้าสู่ระบบในฐานะ ${displayName}`,
      color: "success",
    });
  }, [profile, user]);

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

      // calculate the time
      const lastLogTime = new Date(lastLog.created_at).getTime();
      const now = Date.now();
      const twoHour = 2 * 60 * 60 * 1000;

      if (now - lastLogTime > twoHour) {
        new Notification("คุณยังไม่ได้ดื่มน้ำใน 2 ชั่วโมงแล้ว!", {
          body: "จิบน้ำสักหน่อยนะ!",
          icon: "/icon.png",
        });
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [logs]);

  return (
    <>
      <NavBar user={user} profile={profile} />
      <GoalModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        userId={user.id}
        profile={profile}
        mode="onboarding"
      />

      <div className="flex flex-col gap-2 h-full mx-auto max-w-7xl px-4">
        <h1 className="text-2xl font-bold text-center py-2 px-4">Dashboard</h1>
        {/* show drinking log by table (if no data show message) */}
        {logs.length === 0 ? (
          <p className="text-center text-gray-500">No logs found</p>
        ) : (
          <Table
            aria-label="Drinking log table"
            className="flex flex-col gap-2"
          >
            <TableHeader>
              <TableColumn>วันที่ดื่ม</TableColumn>
              <TableColumn>ปริมาณน้ำ (ml)</TableColumn>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log?.id}>
                  <TableCell>{log?.created_at}</TableCell>
                  <TableCell>{log?.amount_ml}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
