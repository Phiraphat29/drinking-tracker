import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Avatar, 
     DropdownItem,DropdownTrigger,Dropdown,DropdownMenu,} from "@heroui/react";
export default function NavBar() {
  return (
    <Navbar>
      <NavbarBrand >
        <img src="/icon.png" alt="Logo" className="h-10" />
        <p className="font-bold text-inherit">DrinkingTrack</p>
      </NavbarBrand>
      <NavbarContent className="grow" />
      <NavbarContent justify="end">
        <Avatar
          isBordered
          as="button"
          className="transition-transform "
          color="secondary"
          name="Jason Hughes"
          size="md"
          src="gogeta1.jpg"
        />
      </NavbarContent>
    </Navbar>
  );
}
