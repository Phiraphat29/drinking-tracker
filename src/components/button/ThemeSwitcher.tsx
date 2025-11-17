"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
      color="primary"
      variant="shadow"
      size="md"
      isIconOnly
      className="w-10 h-10 bg-linear-to-r from-blue-600 to-cyan-600 text-white"
    >
      {theme === "dark" ? (
        <i className="fa-solid fa-sun"></i>
      ) : (
        <i className="fa-solid fa-moon"></i>
      )}
    </Button>
  );
}
