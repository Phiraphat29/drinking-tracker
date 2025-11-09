"use client";

import { Button } from "@heroui/react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginButton() {
  const handleSignInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.log("Error logging in:", error.message);
    }
  };

  return (
    <Button
      onPress={handleSignInWithGoogle}
      color="primary"
      variant="shadow"
      size="md"
      className="w-100 h-10 px-6 bg-linear-to-r from-blue-600 to-cyan-600 text-white"
    >
      ดำเนินการต่อด้วย
      <i className="fa-brands fa-google ml-2"></i>
    </Button>
  );
}
