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
import NextLink from "next/link";
import clsx from "clsx";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { siteConfig } from "@/lib/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, SearchIcon } from "@/components/icons";
import { tv } from "tailwind-variants";

const buttonStyles = tv({
  base: [
    "inline-flex items-center justify-center gap-2",
    "rounded-lg px-4 py-2",
    "text-sm font-medium",
    "transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  variants: {
    variant: {
      solid: [
        "bg-primary text-primary-foreground",
        "hover:bg-primary/90",
        "focus-visible:ring-primary",
      ],
      outline: [
        "border border-primary",
        "text-primary",
        "hover:bg-primary/10",
        "focus-visible:ring-primary",
      ],
      danger: [
        "bg-danger text-danger-foreground",
        "hover:bg-danger/90",
        "focus-visible:ring-danger",
      ],
    },
  },
  defaultVariants: {
    variant: "solid",
  },
});

const chainButtonStyles = tv({
  base: [
    "flex items-center gap-2",
    "min-w-[140px]",
    "h-10",
    "px-4",
    "rounded-lg",
    "transition-all duration-200",
    "border border-default-200",
    "bg-background/60",
    "hover:bg-default-100",
    "backdrop-blur-lg",
    "backdrop-saturate-150",
  ],
});

const accountButtonStyles = tv({
  base: [
    "flex items-center gap-2",
    "h-10",
    "px-4",
    "rounded-lg",
    "transition-all duration-200",
    "border border-default-200",
    "bg-background/60",
    "hover:bg-default-100",
    "backdrop-blur-lg",
    "backdrop-saturate-150",
    "group",
  ],
});



export const Navbar = () => {
  const CustomConnectButton = () => {
    return (
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== "loading";
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === "authenticated");

          return (
            <div
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <Button
                      onClick={openConnectModal}
                      size="lg"
                      className="text-xl"
                      variant="light"
                    >
                      Login
                    </Button>
                  );
                }

                if (chain?.unsupported) {
                  return (
                    <Button
                      className={buttonStyles({ variant: "danger" })}
                      onClick={openChainModal}
                    >
                      Wrong Network
                    </Button>
                  );
                }

                return (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={openChainModal}
                      className={chainButtonStyles()}
                      type="button"
                    >
                      {chain.hasIcon && (
                        <div
                          className="w-5 h-5 rounded-full overflow-hidden"
                          style={{ background: chain.iconBackground }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              className="w-5 h-5"
                            />
                          )}
                        </div>
                      )}
                      <span className="text-sm font-medium">{chain.name}</span>
                    </button>

                    <button
                      onClick={openAccountModal}
                      className={accountButtonStyles()}
                      type="button"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-success"></div>
                        <span className="text-sm font-medium">
                          {account.displayName}
                        </span>
                        {account.displayBalance && (
                          <span className="text-sm text-default-500">
                            ({account.displayBalance})
                          </span>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    );
  };

  const searchInput = (
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

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent
        className="basis-1/5 sm:basis-full justify-center items-center flex "
        justify="start"
      >
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            {/*<Button className="text-xl" size="lg" color="default" variant="light">Project</Button>*/}
            <Button
              className="text-xl"
              radius="full"
              size="lg"
              color="primary"
              variant="flat"
            >
              Synchra.namespace
            </Button>
            {/*<Logo />*/}
            {/*<p className="font-bold text-inherit">ACME</p>*/}
          </NextLink>
        </NavbarBrand>
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
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {/*<NavbarItem className="hidden sm:flex gap-2">*/}
        {/*  <Link isExternal href={siteConfig.links.twitter} title="Twitter">*/}
        {/*    <TwitterIcon className="text-default-500" />*/}
        {/*  </Link>*/}
        {/*  <Link isExternal href={siteConfig.links.discord} title="Discord">*/}
        {/*    <DiscordIcon className="text-default-500" />*/}
        {/*  </Link>*/}
        {/*  <Link isExternal href={siteConfig.links.github} title="GitHub">*/}
        {/*    <GithubIcon className="text-default-500" />*/}
        {/*  </Link>*/}
        {/*  <ThemeSwitch />*/}
        {/*</NavbarItem>*/}
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button className="text-xl" size="lg" color="primary" radius="full">
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
        {searchInput}
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
      </NavbarMenu>
    </HeroUINavbar>
  );
};
