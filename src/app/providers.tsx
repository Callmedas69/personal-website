"use client";

import { useState } from "react";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";

// Handle both correct and typo environment variables
const projectId = 
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 
  process.env.WALLETCONENCT_PROJECT_ID || 
  "cf21ad89dd9e5835f8b2653f404f2529";

const config = getDefaultConfig({
  appName: "0xdas.dev",
  projectId: projectId,
  chains: [base],
  ssr: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
