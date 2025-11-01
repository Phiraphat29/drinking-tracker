"use client";

import { Button, Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  //* create Supabase client
  const supabase = createClientComponentClient();

  //* handle sign in with Google
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
    <div className="flex flex-col items-center justify-center h-screen">
      <Card>
        <CardHeader className="flex flex-col items-center justify-center">
          <Image
            src="/icon.png"
            alt="Drinking Tracker App"
            width={200}
            height={200}
            className="mb-4 mx-auto"
          />
        </CardHeader>
        <CardBody>
          <h1>Drinking Tracker App</h1>
          <h2 className="text-lg text-center">ติดตามการดื่มน้ำ</h2>
          <Button
            disableRipple
            onPress={handleSignInWithGoogle}
            className="btn"
          >
            <span>
              ดำเนินการต่อด้วย &ensp;
              <i
                className="fa-brands fa-google ml-2"
                style={{ fontSize: "1.2rem" }}
              ></i>
            </span>
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
