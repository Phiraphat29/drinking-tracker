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
    >
      ดำเนินการต่อด้วย Google
      <i className="fa-brands fa-google ml-2"></i>
    </Button>
  );
}
