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
import { useMemo } from "react";
import DefaultLayout from "@/layouts/default";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

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

  // Memoize locale to prevent unnecessary re-renders
  const locale = useMemo(() => {
    return router.locale as Locale;
  }, [router.locale]);

  // Memoize page key to reduce re-renders
  const pageKey = useMemo(() => {
    return router.route;
  }, [router.route]);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          locale={locale}
          // Add these props to stabilize the provider
          showRecentTransactions={true}
          coolMode
        >
          <HeroUIProvider navigate={router.push}>
            <NextThemesProvider>
              <AnimatePresence mode="wait">
                <DefaultLayout>
                <Component {...pageProps} key={pageKey} />
                </DefaultLayout>
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