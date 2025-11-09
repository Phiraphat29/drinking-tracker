import { User } from "@supabase/supabase-js";

export type Profile = {
    username: string | null;
    daily_goal_ml: number | null;
    avatar_url: string | null;
} | null;

export type Log = {
    id: number;
    created_at: string;
    user_id: string;
    drink_name: string;
    amount_ml: number;
} | null;

export type DashboardClientProps = {
    user: User;
    profile: Profile;
    logs: Log[];
}