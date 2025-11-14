import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Avatar,
} from "@heroui/react";
export default function NavBar() {
  return (
    <Navbar maxWidth="full">
      <NavbarContent justify="start">
        <NavbarBrand>
          <img src="/icon.png" alt="Logo" className="h-10" />
          <p className="font-bold text-inherit">DrinkingTrack</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            color="secondary"
            name="Jason Hughes"
            size="md"
            src="gogeta1.jpg"
          />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
