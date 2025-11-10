"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface GoalModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export default function GoalModal({
  isOpen,
  onOpenChange,
  userId,
}: GoalModalProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [dailyGoal, setDailyGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
        .eq("id", userId);

      if (updateError) {
        throw updateError;
      }

      onOpenChange(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
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
                label="ป้อนเป้าหมายการดื่มน้ำต่อวัน (ml)"
                placeholder="3000"
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
  );
}
