import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import SignInClient from "./SignInClient";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return <SignInClient />;
}
