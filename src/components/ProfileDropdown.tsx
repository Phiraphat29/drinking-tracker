"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types/database";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import GoalModal from "@/components/modal/SettingModal";

type ProfileDropdownProps = {
  user: User;
  profile: Profile | null;
};

export default function ProfileDropdown({
  user,
  profile,
}: ProfileDropdownProps) {
  const router = useRouter();
  const avatarUrl = profile?.avatar_url || user.user_metadata.avatar_url;
  const displayName = profile?.username || "User";
  const email = user.email;

  const [notifyPermission, setNotifyPermission] =
    useState<NotificationPermission>("default");
  const [isNotificationsEnabled, setIsNotificationsEnabled] =
    useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if ("Notification" in window) {
      setNotifyPermission(Notification.permission);
      const saved = localStorage.getItem("notificationsEnabled");
      if (saved !== null) {
        setIsNotificationsEnabled(saved === "true");
      } else {
        setIsNotificationsEnabled(Notification.permission === "granted");
      }
    }
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  const handleToggleNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.warn("Notifications are not supported in this environment.");
      return;
    }

    if (notifyPermission === "denied") {
      alert(
        "คุณบล็อกการแจ้งเตือนในเบราว์เซอร์ กรุณาเปิดใช้งานใน Settings/Preferences."
      );
      return;
    }

    if (notifyPermission === "default") {
      try {
        const permission = await Notification.requestPermission();
        setNotifyPermission(permission);
        if (permission === "granted") {
          setIsNotificationsEnabled(true);
          localStorage.setItem("notificationsEnabled", "true");
          new Notification("เปิดการแจ้งเตือนแล้ว!", {
            body: "คุณจะได้รับการแจ้งเตือนจากเรา",
            icon: "/icon.png",
          });
        }
      } catch (error) {
        console.error("Failed to request notification permission:", error);
      }
      return;
    }

    const nextEnabled = !isNotificationsEnabled;
    setIsNotificationsEnabled(nextEnabled);
    localStorage.setItem("notificationsEnabled", String(nextEnabled));
    if (nextEnabled) {
      try {
        new Notification("เปิดการแจ้งเตือนแล้ว!", {
          body: "คุณจะได้รับการแจ้งเตือนจากเรา",
          icon: "/icon.png",
        });
      } catch {}
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-5">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-zinc-300 p-2 ps-5 rounded-full transition-background ease-in-out duration-800">
            <div className="flex flex-col items-end max-sm:hidden">
              <span className="text-md font-bold text-blue-700">
                {displayName}
              </span>
              <span className="text-sm text-zinc-500">{email}</span>
            </div>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="primary"
              name={displayName}
              size="md"
              src={avatarUrl}
            />
          </div>
        </DropdownTrigger>
        <DropdownMenu color="primary" variant="solid">
          <DropdownItem
            key="edit-profile"
            className="text-blue-700"
            color="primary"
            onPress={() => setIsEditOpen(true)}
          >
            แก้ไขข้อมูลผู้ใช้
          </DropdownItem>
          <DropdownItem
            key="request-notifications"
            onPress={handleToggleNotifications}
            className="text-blue-700"
            color="primary"
            isDisabled={notifyPermission === "denied"}
          >
            {notifyPermission === "denied"
              ? "คุณบล็อกการแจ้งเตือน (เปิดในเบราว์เซอร์)"
              : notifyPermission === "granted" && isNotificationsEnabled
              ? "ปิดการแจ้งเตือน"
              : "เปิดการแจ้งเตือน"}
          </DropdownItem>
          <DropdownItem
            key="sign-out"
            onPress={handleSignOut}
            className="text-danger"
            color="danger"
          >
            ออกจากระบบ
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <GoalModal
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        userId={user.id}
        profile={
          profile || { username: "", daily_goal_ml: 3000, avatar_url: "" }
        }
        mode="full"
      />
    </div>
  );
}
