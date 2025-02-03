import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@heroui/react";
import { tv } from "tailwind-variants";
import ProfileMenu from "@/components/ProfileMenu";

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
      solid: ["bg-primary text-primary-foreground", "hover:bg-primary/90"],
      outline: ["border border-primary", "text-primary", "hover:bg-primary/10"],
      danger: ["bg-danger text-danger-foreground", "hover:bg-danger/90"],
    },
  },
  defaultVariants: {
    variant: "solid",
  },
});

const chainButtonStyles = tv({
  base: [
    "flex items-center gap-2",
    "min-w-[100px]",
    "h-10",
    "px-4",
    "rounded-lg",
    "border border-default-200",
    "bg-background/60",
    "hover:bg-default-100",
  ],
});

const accountButtonStyles = tv({
  base: [
    "flex items-center gap-2",
    "h-10",
    "px-4",
    "rounded-full",
    "border border-default-200",
    "bg-background/60",
    "hover:bg-default-100",
  ],
});

export const CustomConnectButton = () => {
    console.log('hi')
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
        if (!mounted) return null;

        const ready = authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        if (connected) {
          return chain?.unsupported ? (
            <Button
              className={buttonStyles({ variant: "danger" })}
              onPress={openChainModal}
            >
              Wrong Network
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                className={chainButtonStyles()}
                type="button"
                onClick={openChainModal}
              >
                {chain?.hasIcon && (
                  <div
                    className="w-5 h-5 rounded-full overflow-hidden"
                    style={{ background: chain.iconBackground }}
                  >
                    {chain.iconUrl && (
                      <img
                        alt={chain.name ?? "Chain icon"}
                        className="w-5 h-5"
                        src={chain.iconUrl}
                      />
                    )}
                  </div>
                )}
                <span className="text-sm font-medium">{chain.name}</span>
              </button>
              <button
                className={accountButtonStyles()}
                type="button"
                onClick={openAccountModal}
              >
                <div className="h-2 w-2 rounded-full bg-success" />
              </button>
              <ProfileMenu />
            </div>
          );
        }

        return (
          <Button
            className="text-xl w-52"
            size="lg"
            variant="light"
            onPress={openConnectModal}
          >
            Login
          </Button>
        );
      }}
    </ConnectButton.Custom>
  );
};
