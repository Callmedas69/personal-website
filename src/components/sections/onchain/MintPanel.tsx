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
  let buttonText = "MINT ARTWORK";
  let buttonDisabled = isPending || isConfirming;

  if (isOwner) {
    buttonText = isPending || isConfirming ? "MINTING..." : "MINT (OWNER)";
  } else if (!isContractLoading) {
    if (remaining <= 0) {
      buttonText = "SOLD OUT";
      buttonDisabled = true;
    } else if (!canMint) {
      buttonText = "MINT INACTIVE";
      buttonDisabled = true;
    } else if (userMinted >= maxPerWallet) {
      buttonText = "MAX PER WALLET";
      buttonDisabled = true;
    } else if (isPending || isConfirming) {
      buttonText = "MINTING...";
    }
  }

  let buttonBgColor = "var(--color-accent-yellow)";
  let buttonTextColor = "var(--color-terminal-bg)";
  if (buttonDisabled) {
    if (isPending || isConfirming) {
      buttonBgColor = "#244e56";
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
                <div className="text-accent-mint font-bold">[OWNER CONNECTED]</div>
              ) : !canMint ? (
                <div className="text-accent-yellow font-semibold">[PUBLIC INACTIVE]</div>
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
              {isSimulating ? "SIMULATING..." : "SIMULATE MINT"}
            </button>
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded cursor-pointer select-none bg-accent-blue text-terminal-bg border-none hover:brightness-110 active:scale-95 transition-all"
                >
                  <Wallet size={11} />
                  <span>CONNECT</span>
                </button>
              )}
            </ConnectButton.Custom>
          </div>
        )}
      </div>
    </div>
  );
}
