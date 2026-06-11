"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, STAGGER, MM } from "@/lib/motion";
import { useAccount, useBlockNumber } from "wagmi";
import { formatEther } from "viem";
import { useContractReads } from "@/hooks/useContractReads";
import { useMint } from "@/hooks/useMint";
import { INVISIBLE_LAW_ADDRESS } from "@/abi/InvisibleLaw";
import BlockTicker from "./onchain/BlockTicker";
import RpcConsole from "./onchain/RpcConsole";
import MintPanel from "./onchain/MintPanel";

/**
 * Onchain proof section — being live on Base is a personality trait, not a
 * feature. RPC console left, block ticker + mint panel right.
 */
export default function OnchainSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM, (ctx) => {
        const { ok } = ctx.conditions as { ok: boolean };
        if (!ok) return;
        gsap.from("[data-onchain-panel]", {
          y: 24,
          autoAlpha: 0,
          duration: 0.7,
          ease: EASE.outSoft,
          stagger: STAGGER.panels,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: sectionRef }
  );

  const { address, isConnected, connector, chain } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const {
    mintPrice,
    totalMinted,
    maxSupply,
    canMint,
    isOwner,
    userMinted,
    remaining,
    maxPerWallet,
    isLoading: isContractLoading,
  } = useContractReads();

  const { mint, isPending, isConfirming, isSuccess, error, txHash, receipt } = useMint();

  // Simulated mint flow for disconnected visitors
  const [simLog, setSimLog] = useState<string[]>([
    "RPC status: Connected to Base mainnet",
    "Wallet status: DISCONNECTED",
    "Ready to execute simulation...",
  ]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simCount, setSimCount] = useState(0);

  const executeSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimLog([
      "RPC status: Connected to Base mainnet",
      "Wallet status: DISCONNECTED (SIMULATED)",
      ">> Simulating contract write to InvisibleLaw...",
      ">> Gas estimated: 38,243 units",
      ">> Awaiting simulated signature approval...",
    ]);

    setTimeout(() => {
      setSimLog((prev) => [...prev, ">> Simulated signature approved."]);
      setTimeout(() => {
        const mockHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
        setSimCount((prev) => prev + 1);
        setSimLog((prev) => [
          ...prev,
          `>> Simulated Tx Hash: ${mockHash.slice(0, 10)}...${mockHash.slice(-8)}`,
          `>> Success: [SIMULATION] Invisible Law #${100 + simCount} minted.`,
          `>> Gas used: 52,109 units`,
        ]);
        setIsSimulating(false);
      }, 800);
    }, 800);
  };

  const handleRealMint = () => {
    if (isPending || isConfirming || (!isOwner && !canMint)) return;
    mint(1, mintPrice, isOwner);
  };

  // Derive live transaction log from contract state (no setState-in-effect)
  const activeTxLog: string[] = [];

  if (chain) {
    activeTxLog.push(`RPC status: Connected to ${chain.name} (Chain ID: ${chain.id})`);
  } else {
    activeTxLog.push("RPC status: Connected to Base mainnet");
  }

  if (blockNumber) {
    activeTxLog.push(`Current block: #${blockNumber.toString()}`);
  }

  if (connector && address) {
    const shortenedAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;
    activeTxLog.push(`Wallet status: Connected via ${connector.name} (${shortenedAddr})`);
  } else {
    activeTxLog.push("Wallet status: Connected");
  }

  activeTxLog.push(`Contract address: ${INVISIBLE_LAW_ADDRESS}`);
  if (!isContractLoading) {
    activeTxLog.push(`Contract status: ${canMint ? "ACTIVE" : "INACTIVE"} | Total Minted: ${totalMinted} / ${maxSupply}`);
    activeTxLog.push(`User Balance: ${userMinted} PHI | Unit Price: ${formatEther(mintPrice)} ETH`);
  }

  if (isPending) {
    activeTxLog.push(">> [1/3] Signature requested: Please confirm the transaction in your wallet...");
  }

  if (txHash) {
    activeTxLog.push(`>> [2/3] Broadcasted. Tx Hash: ${txHash}`);
    if (isConfirming) {
      activeTxLog.push(">> [3/3] Confirming transaction on Base L2... waiting for inclusion...");
    }
  }

  if (isSuccess) {
    activeTxLog.push(">> [3/3] Confirmed!");
    if (receipt) {
      activeTxLog.push(`>> Success: Invisible Law minted in block #${receipt.blockNumber.toString()}!`);
      activeTxLog.push(`>> Gas used: ${receipt.gasUsed?.toString() || "unknown"} units`);
    } else {
      activeTxLog.push(">> Success: Invisible Law minted successfully on Base L2!");
    }
  }

  if (error) {
    let errorMsg = error.message;
    if (errorMsg.includes("User rejected the request") || errorMsg.includes("User denied transaction signature")) {
      errorMsg = "User rejected transaction signature.";
    } else if (errorMsg.length > 80) {
      errorMsg = errorMsg.slice(0, 80) + "...";
    }
    activeTxLog.push(`>> [ERROR] Transaction failed: ${errorMsg}`);
  }

  const logsToRender = isConnected ? activeTxLog : simLog;

  return (
    <section ref={sectionRef} className="relative w-full max-w-6xl mx-auto px-6 py-20">
      <div className="font-mono text-sm font-bold text-accent-mint mb-6 select-none">// onchain</div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div data-onchain-panel className="lg:col-span-7">
          <RpcConsole logs={logsToRender} />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div data-onchain-panel>
            <BlockTicker blockNumber={blockNumber} />
          </div>
          <div data-onchain-panel>
            <MintPanel
              isConnected={isConnected}
              isOwner={isOwner}
              canMint={canMint}
              isPending={isPending}
              isConfirming={isConfirming}
              isContractLoading={isContractLoading}
              remaining={remaining}
              userMinted={userMinted}
              maxPerWallet={maxPerWallet}
              isSimulating={isSimulating}
              onMint={handleRealMint}
              onSimulate={executeSimulation}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
