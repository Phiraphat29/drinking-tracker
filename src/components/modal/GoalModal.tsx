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
import { Profile } from "@/types/database";

interface GoalModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  profile: Profile;
  mode?: "onboarding" | "full";
}

export default function GoalModal({
  isOpen,
  onOpenChange,
  userId,
  profile,
  mode = "onboarding",
}: GoalModalProps) {
  const router = useRouter();
  const [username, setUsername] = useState(profile?.username || "");
  const [dailyGoal, setDailyGoal] = useState<number>(
    profile?.daily_goal_ml || 3000
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    profile?.avatar_url || ""
  );

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

    if (!dailyGoal || dailyGoal <= 0) {
      setError("Daily goal must be a positive number");
      setIsLoading(false);
      return;
    }

    try {
      let avatarUrlToSave = profile?.avatar_url || "";

      // Upload avatar only when in full mode and a file is selected
      if (mode === "full" && avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const filePath = `avatars/${userId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, {
            cacheControl: "3600",
            upsert: true,
            contentType: avatarFile.type,
          });

        if (uploadError) {
          // If upload fails, continue without breaking profile update
          console.warn("Avatar upload failed:", uploadError.message);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);
          avatarUrlToSave = publicUrlData.publicUrl;
        }
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          username: username.trim(),
          daily_goal_ml: dailyGoal,
          ...(mode === "full" ? { avatar_url: avatarUrlToSave } : {}),
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
          <ModalHeader>
            {mode === "full"
              ? "แก้ไขโปรไฟล์และเป้าหมายการดื่มน้ำของคุณ"
              : "ป้อนชื่อผู้ใช้และเป้าหมายการดื่มน้ำของคุณ"}
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              {mode === "full" && (
                <div className="flex items-center gap-4">
                  <img
                    src={avatarPreview || profile?.avatar_url || ""}
                    alt="avatar preview"
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setAvatarFile(file);
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setAvatarPreview(url);
                      } else {
                        setAvatarPreview(profile?.avatar_url || "");
                      }
                    }}
                    isDisabled={isLoading}
                  />
                </div>
              )}
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
                value={dailyGoal.toString()}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                isRequired
                isDisabled={isLoading}
                min="1"
              />
              {error && <p className="text-danger text-sm">{error}</p>}
            </div>
          </ModalBody>
          <ModalFooter>
            {mode === "full" && (
              <Button
                color="danger"
                onPress={() => onOpenChange(false)}
                isDisabled={isLoading}
              >
                ยกเลิก
              </Button>
            )}
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
