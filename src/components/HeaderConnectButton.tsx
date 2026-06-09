"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function HeaderConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

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
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="px-2.5 py-1 rounded text-[11px] font-mono border border-accent-blue/30 text-accent-blue bg-terminal-inner/40 hover:bg-accent-blue/10 hover:border-accent-blue/60 transition-all cursor-pointer select-none"
                  >
                    [ CONNECT_WALLET ]
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="px-2.5 py-1 rounded text-[11px] font-mono border border-red-500/40 text-red-400 bg-red-950/10 hover:bg-red-500/10 transition-all cursor-pointer select-none"
                  >
                    [ WRONG_NETWORK ]
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="hidden sm:block px-2 py-0.5 rounded border border-border-line text-text-slate hover:text-text-primary transition-all cursor-pointer select-none"
                  >
                    {chain.name}
                  </button>
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="px-2.5 py-1 rounded border border-accent-mint/30 text-accent-mint bg-terminal-inner/40 hover:bg-accent-mint/10 hover:border-accent-mint/60 transition-all cursor-pointer select-none"
                  >
                    [{account.displayName}]
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
