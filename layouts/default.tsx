import {
  Button,
  Input,
  Kbd,
  Link,
  link as linkStyles,
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/lib/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, SearchIcon } from "@/components/icons";
import { CustomConnectButton } from "@/components/CustomConnectButton";
import { Head } from "./head";
import { memo } from "react";

const SearchInput = () => (
  <Input
    aria-label="Search"
    classNames={{
      inputWrapper: "bg-default-100",
      input: "text-sm",
    }}
    endContent={
      <Kbd className="hidden lg:inline-block" keys={["command"]}>
        K
      </Kbd>
    }
    labelPlacement="outside"
    placeholder="Search..."
    startContent={
      <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
    }
    type="search"
  />
);

const NavbarItems = memo(() => (
  <div className="hidden lg:flex gap-4 justify-start ml-2">
    {siteConfig.navItems.map((item) => (
      <NavbarItem key={item.href}>
        <NextLink
          className={clsx(
            linkStyles({ color: "foreground" }),
            "data-[active=true]:text-primary data-[active=true]:font-medium",
            "!text-xl",
          )}
          color="foreground"
          href={item.href}
        >
          {item.label}
        </NextLink>
      </NavbarItem>
    ))}
  </div>
));

const NavbarMenuItems = memo(() => (
  <div className="mx-4 mt-2 flex flex-col gap-2">
    {siteConfig.navMenuItems.map((item, index) => (
      <NavbarMenuItem key={`${item}-${index}`}>
        <Link
          color={
            index === 2
              ? "primary"
              : index === siteConfig.navMenuItems.length - 1
                ? "danger"
                : "foreground"
          }
          href="#"
          size="lg"
        >
          {item.label}
        </Link>
      </NavbarMenuItem>
    ))}
  </div>
));

const Navbar = memo(() => {
  const router = useRouter();
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent
        className="basis-1/5 sm:basis-full justify-center items-center flex"
        justify="start"
      >
        <NavbarBrand className="gap-3 flex justify-start items-center  max-w-fit">
          {/*<NextLink href={"/"}>*/}
            <Button
              onPress={() => router.push("/")}
              className="text-xl"
              color="primary"
              radius="full"
              size="lg"
              variant="flat"
            >
              Synchra.namespace
            </Button>
          {/*</NextLink>*/}
        </NavbarBrand>
        <NavbarItems />
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden md:flex">
          <Button
            onPress={() => router.push("/create")}
            className="text-xl"
            color="primary"
            radius="full"
            size="lg"
          >
            Create Objective
          </Button>
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <CustomConnectButton />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <SearchInput />
        <NavbarMenuItems />
      </NavbarMenu>
    </HeroUINavbar>
  );
});

export default function DefaultLayout({ children }) {
  return (
    <div className="relative flex h-screen flex-col p-4">
      <Head />
      <Navbar />
      <main className="container mx-auto max-w-7xl flex-grow px-6 pt-16">
        {children}
      </main>
      <footer className="flex w-full items-center justify-center py-3">
        {/* Footer content here */}
      </footer>
    </div>
  );
}
