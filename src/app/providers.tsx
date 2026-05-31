"use client";

import { useState } from "react";
import { RainbowKitProvider, getDefaultConfig, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { fallback } from "viem";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";

const projectId = 
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 
  "cf21ad89dd9e5835f8b2653f404f2529";

const alchemyRpcUrl = 
  process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || 
  process.env.ALCHEMY_RPC_URL || 
  "https://base-mainnet.g.alchemy.com/v2/AsvPzqeE3UvGE8eMLM0Hp";

const officialBaseRpcUrl = 
  process.env.NEXT_PUBLIC_OFFICIAL_BASE_RPC_URL || 
  process.env.OFFICIAL_BASE_RPC_URL || 
  "https://mainnet.base.org";

const config = getDefaultConfig({
  appName: "0xdas.dev",
  projectId: projectId,
  chains: [base],
  ssr: true,
  transports: {
    [base.id]: fallback([
      http(alchemyRpcUrl),
      http(officialBaseRpcUrl)
    ]),
  },
});

const customTheme = {
  ...darkTheme({
    accentColor: "#6e9cf1",
    accentColorForeground: "#011627",
    borderRadius: "small",
    fontStack: "system",
    overlayBlur: "small",
  }),
  fonts: {
    body: "var(--font-mono), monospace",
  },
  colors: {
    ...darkTheme().colors,
    modalBackground: "#011627",
    modalBorder: "rgba(192, 199, 209, 0.15)",
    modalText: "#d8dee9",
    modalTextSecondary: "#5f7d97",
    actionButtonBorder: "rgba(192, 199, 209, 0.12)",
    actionButtonSecondaryBackground: "#070d19",
    closeButton: "#5f7d97",
    closeButtonBackground: "#070d19",
    connectButtonBackground: "#070d19",
    connectButtonText: "#d8dee9",
    generalBorder: "rgba(192, 199, 209, 0.12)",
    generalBorderDim: "rgba(192, 199, 209, 0.06)",
    menuItemBackground: "#070d19",
    profileAction: "#070d19",
    profileActionHover: "rgba(110, 156, 241, 0.1)",
    profileForeground: "#011627",
  }
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
