"use client";

import { DashboardClientProps } from "@/types/database";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  addToast,
} from "@heroui/react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function DashboardClient({
  user,
  profile,
  logs,
}: DashboardClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [dailyGoal, setDailyGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  //* Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    //* Validation
    if (!username.trim()) {
      setError("Username is required");
      setIsLoading(false);
      return;
    }

    if (!dailyGoal || parseInt(dailyGoal) <= 0) {
      setError("Daily goal must be a positive number");
      setIsLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          username: username.trim(),
          daily_goal_ml: parseInt(dailyGoal),
        })
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      setIsModalOpen(false);
      router.refresh(); // Refresh the server component to get updated data
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        placement="top-center"
        hideCloseButton
        isDismissable={false}
      >
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>ป้อนชื่อผู้ใช้และเป้าหมายการดื่มน้ำของคุณ</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  type="text"
                  label="ชื่อผู้ใช้"
                  placeholder="ป้อนชื่อผู้ใช้"
                  variant="bordered"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  isRequired
                  isDisabled={isLoading}
                />
                <Input
                  type="number"
                  label="การดื่มน้ำ (ml)"
                  placeholder="ป้อนเป้าหมายการดื่มน้ำใน (ml)"
                  variant="bordered"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(e.target.value)}
                  isRequired
                  isDisabled={isLoading}
                  min="1"
                />
                {error && <p className="text-danger text-sm">{error}</p>}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                type="submit"
                isLoading={isLoading}
                isDisabled={isLoading}
              >
                Save
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

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
