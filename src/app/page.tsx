"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Spinner } from "@heroui/react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // User is signed in, redirect to dashboard
        router.replace("/dashboard");
      } else {
        // User is not signed in, redirect to sign-in
        router.replace("/sign-in");
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking auth
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Spinner
          color="primary"
          variant="wave"
          size="lg"
          label="กำลังตรวจสอบข้อมูลผู้ใช้..."
        />
      </div>
    </div>
  );
}
