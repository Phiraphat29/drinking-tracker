"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types/database";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import SettingModal from "@/components/modal/SettingModal";
import { Check, MonitorCog, Moon, Sun } from "lucide-react";

type ProfileDropdownProps = {
  user: User;
  profile: Profile;
};

export default function ProfileDropdown({
  user,
  profile,
}: ProfileDropdownProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const avatarUrl = profile.avatar_url || user.user_metadata.avatar_url;
  const displayName = profile.username || "User";
  const email = user.email;

  const [notifyPermission, setNotifyPermission] =
    useState<NotificationPermission>("default");
  const [isNotificationsEnabled, setIsNotificationsEnabled] =
    useState<boolean>(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
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
      <Dropdown placement="bottom-end" backdrop="blur">
        <DropdownTrigger>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-700 pe-2 px-1 ps-5 rounded-xl transition-background ease-in-out duration-300">
            <div className="flex flex-col items-end max-sm:hidden">
              <span className="text-md font-bold text-blue-700">
                {displayName}
              </span>
              <span className="text-sm text-zinc-500 dark:text-gray-400">
                {email}
              </span>
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
          <DropdownSection title="ธีม">
            <DropdownItem
              key="theme-system"
              onPress={() => {
                setTheme("system");
              }}
              className="text-blue-500"
              startContent={<MonitorCog className="w-5 h-5" />}
              endContent={
                theme === "system" ? <Check className="w-5 h-5" /> : null
              }
              color="primary"
            >
              ระบบ
            </DropdownItem>
            <DropdownItem
              key="theme-light"
              onPress={() => {
                setTheme("light");
              }}
              className="text-blue-500"
              startContent={<Sun className="w-5 h-5" />}
              endContent={
                theme === "light" ? <Check className="w-5 h-5" /> : null
              }
              color="primary"
            >
              สว่าง
            </DropdownItem>
            <DropdownItem
              key="theme-dark"
              onPress={() => {
                setTheme("dark");
              }}
              className="text-blue-500"
              startContent={<Moon className="w-5 h-5" />}
              endContent={
                theme === "dark" ? <Check className="w-5 h-5" /> : null
              }
              color="primary"
            >
              มืด
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="การตั้งค่าบัญชี">
            <DropdownItem
              key="edit-profile"
              className="text-blue-500"
              color="primary"
              onPress={() => setIsSettingOpen(true)}
            >
              แก้ไขข้อมูลผู้ใช้
            </DropdownItem>
            <DropdownItem
              key="request-notifications"
              onPress={handleToggleNotifications}
              className="text-blue-500"
              color="primary"
              isDisabled={notifyPermission === "denied"}
            >
              {notifyPermission === "denied"
                ? "คุณบล็อกการแจ้งเตือน (เปิดในเบราว์เซอร์)"
                : notifyPermission === "granted" && isNotificationsEnabled
                ? "ปิดการแจ้งเตือน"
                : "เปิดการแจ้งเตือน"}
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="ออกจากระบบ">
            <DropdownItem
              key="sign-out"
              onPress={handleSignOut}
              className="text-danger"
              color="danger"
            >
              ออกจากระบบ
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
      <SettingModal
        isOpen={isSettingOpen}
        onOpenChange={setIsSettingOpen}
        userId={user.id}
        profile={profile}
        mode="full"
      />
    </div>
  );
}
