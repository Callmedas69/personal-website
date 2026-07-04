"use client";

import { Send, RefreshCw, Wallet } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface MintPanelProps {
  isConnected: boolean;
  isOwner: boolean;
  canMint: boolean;
  isPending: boolean;
  isConfirming: boolean;
  isContractLoading: boolean;
  remaining: number;
  userMinted: number;
  maxPerWallet: number;
  isSimulating: boolean;
  onMint: () => void;
  onSimulate: () => void;
}

/** Mint controls — presented as a process panel, not a sales CTA. */
export default function MintPanel({
  isConnected,
  isOwner,
  canMint,
  isPending,
  isConfirming,
  isContractLoading,
  remaining,
  userMinted,
  maxPerWallet,
  isSimulating,
  onMint,
  onSimulate,
}: MintPanelProps) {
  let buttonText = "mint artwork";
  let buttonDisabled = isPending || isConfirming;

  if (isOwner) {
    buttonText = isPending || isConfirming ? "minting..." : "mint (owner)";
  } else if (!isContractLoading) {
    if (remaining <= 0) {
      buttonText = "sold out";
      buttonDisabled = true;
    } else if (!canMint) {
      buttonText = "mint inactive";
      buttonDisabled = true;
    } else if (userMinted >= maxPerWallet) {
      buttonText = "max per wallet";
      buttonDisabled = true;
    } else if (isPending || isConfirming) {
      buttonText = "minting...";
    }
  }

  // primary CTA color is accent-blue, matching the CONNECT button shown when
  // disconnected — one role (primary action), one color, regardless of wallet state
  let buttonBgColor = "var(--color-accent-blue)";
  let buttonTextColor = "var(--color-terminal-bg)";
  if (buttonDisabled) {
    if (isPending || isConfirming) {
      buttonBgColor = "rgba(117,209,196,0.18)"; // accent-mint tint: pending is a live process
      buttonTextColor = "var(--color-accent-mint)";
    } else {
      buttonBgColor = "var(--color-terminal-inner)";
      buttonTextColor = "var(--color-text-slate)";
    }
  }

  return (
    <div className="border border-border-line rounded-lg bg-terminal-inner/40 p-5 font-mono space-y-4 select-none">
      <div className="text-[10px] text-text-slate">// proof of work, onchain</div>

      <div className="flex items-center justify-between">
        <div className="text-[10px] text-text-slate">
          {isConnected && (
            <>
              {isOwner ? (
                <div className="text-accent-mint font-bold">[ owner connected ]</div>
              ) : !canMint ? (
                <div className="text-accent-yellow font-semibold">[ public inactive ]</div>
              ) : null}
            </>
          )}
        </div>

        {isConnected ? (
          <button
            onClick={onMint}
            disabled={buttonDisabled}
            className={`flex items-center space-x-1 hover:brightness-110 transition-all text-xs font-semibold px-3 py-1.5 rounded select-none border-none ${
              buttonDisabled ? "cursor-not-allowed opacity-75" : "cursor-pointer active:scale-95"
            }`}
            style={{ background: buttonBgColor, color: buttonTextColor }}
          >
            {isPending || isConfirming ? (
              <>
                <RefreshCw size={11} className="animate-spin" />
                <span>{buttonText}</span>
              </>
            ) : (
              <>
                <Send size={11} />
                <span>{buttonText}</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={onSimulate}
              disabled={isSimulating}
              className="px-2.5 py-1 text-[11px] border border-border-line text-text-slate hover:text-text-primary rounded hover:bg-terminal-inner/30 cursor-pointer"
            >
              {isSimulating ? "simulating..." : "simulate mint"}
            </button>
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded cursor-pointer select-none bg-accent-blue text-terminal-bg border-none hover:brightness-110 active:scale-95 transition-all"
                >
                  <Wallet size={11} />
                  <span>connect</span>
                </button>
              )}
            </ConnectButton.Custom>
          </div>
        )}
      </div>
    </div>
  );
}
