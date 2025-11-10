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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <GoalModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        userId={user.id}
      />

      <div className="flex flex-col gap-2 min-h-screen">
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
    </div>
  );
}
