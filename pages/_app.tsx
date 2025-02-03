import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";

import { fontMono, fontSans } from "@/lib/fonts";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { type Locale, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/wagmi";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

// Shared transition configuration
export const TRANSITION_CONFIG = {
  duration: 0.5,
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const CARD_TRANSITION_ID = "card-transition";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { locale } = useRouter() as { locale: Locale };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale={locale}>
          <HeroUIProvider navigate={router.push}>
            <NextThemesProvider>
              <AnimatePresence mode="wait">
                <Component {...pageProps} key={router.route} />
              </AnimatePresence>
            </NextThemesProvider>
          </HeroUIProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};