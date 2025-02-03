import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from "@heroui/react";
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
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    className={buttonStyles({ variant: "solid" })}
                    onClick={openConnectModal}
                  >
                    Connect Wallet
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
                            alt={chain.name ?? 'Chain icon'}
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

export default CustomConnectButton;