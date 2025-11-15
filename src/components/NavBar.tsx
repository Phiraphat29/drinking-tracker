import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import ProfileDropdown from "@/components/ProfileDropdown";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types/database";

type NavBarProps = {
  user: User;
  profile: Profile | null;
};

export default function NavBar({ user, profile }: NavBarProps) {
  return (
    <Navbar maxWidth="full">
      <NavbarContent justify="start">
        <NavbarBrand>
          <img src="/icon.png" alt="Logo" className="h-10" />
          <p className="font-bold text-inherit">Drinking Tracker</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ProfileDropdown user={user} profile={profile} />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
