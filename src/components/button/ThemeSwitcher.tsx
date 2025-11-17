"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { MonitorCog, Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      // system -> light -> dark
      onPress={() =>
        setTheme(
          theme === "system" ? "light" : theme === "light" ? "dark" : "system"
        )
      }
      color="primary"
      variant="shadow"
      size="md"
      isIconOnly
      className="w-10 h-10 bg-linear-to-r from-blue-600 to-cyan-600 text-white"
    >
      {theme === "system" ? (
        <MonitorCog className="w-5 h-5" />
      ) : theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </Button>
  );
}
