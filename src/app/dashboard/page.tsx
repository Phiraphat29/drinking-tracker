import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboardClient";
import { Profile, Log } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();

  //* Check if user is logged in
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  //* Retrieve user's profile data (username and daily goal in ml)
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, daily_goal_ml, avatar_url")
    .eq("id", session.user.id)
    .single();

  //* Retrieve user's drinking log
  const { data: logs } = await supabase
    .from("drinking_log")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <DashboardClient
      user={session.user}
      profile={profile as Profile}
      logs={logs as Log[]}
    />
  );
}
