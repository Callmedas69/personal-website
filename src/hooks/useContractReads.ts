"use client";

import { useReadContracts, useAccount, useReadContract } from "wagmi";
import { INVISIBLE_LAW_ADDRESS, INVISIBLE_LAW_ABI } from "@/abi/InvisibleLaw";

export interface ContractData {
  mintPrice: bigint;
  mintActive: boolean;
  paused: boolean;
  totalMinted: number;
  maxSupply: number;
  maxPerWallet: number;
  allowlistFreeMint: number;
  userMinted: number;
  remaining: number;
  isSoldOut: boolean;
  canMint: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useContractReads(): ContractData {
  const { address, isConnected } = useAccount();

  // Static/dynamic contract reads (always fetched)
  const { data: staticData, isLoading: staticLoading, isError: staticError, error: staticErr, refetch: refetchStatic } = useReadContracts({
    contracts: [
      {
        address: INVISIBLE_LAW_ADDRESS,
        abi: INVISIBLE_LAW_ABI,
        functionName: "mintPrice",
      },
      {
        address: INVISIBLE_LAW_ADDRESS,
        abi: INVISIBLE_LAW_ABI,
        functionName: "mintActive",
      },
      {
        address: INVISIBLE_LAW_ADDRESS,
        abi: INVISIBLE_LAW_ABI,
        functionName: "paused",
      },
      {
        address: INVISIBLE_LAW_ADDRESS,
        abi: INVISIBLE_LAW_ABI,
        functionName: "totalSupply",
      },
      {
        address: INVISIBLE_LAW_ADDRESS,
        abi: INVISIBLE_LAW_ABI,
        functionName: "MAX_SUPPLY",
      },
      {
        address: INVISIBLE_LAW_ADDRESS,
        abi: INVISIBLE_LAW_ABI,
        functionName: "MAX_PER_WALLET",
      },
      {
        address: INVISIBLE_LAW_ADDRESS,
        abi: INVISIBLE_LAW_ABI,
        functionName: "allowlistFreeMint",
      },
    ],
    query: {
      refetchInterval: 15000,
    },
  });

  // User-specific read (only when connected)
  const { data: userMintedData, refetch: refetchUser } = useReadContract({
    address: INVISIBLE_LAW_ADDRESS,
    abi: INVISIBLE_LAW_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 15000,
    },
  });

  // Parse static results with defaults
  const mintPrice = (staticData?.[0]?.result as bigint | undefined) ?? BigInt(0);
  const mintActive = (staticData?.[1]?.result as boolean | undefined) ?? false;
  const paused = (staticData?.[2]?.result as boolean | undefined) ?? false;
  const totalMinted = Number((staticData?.[3]?.result as bigint | undefined) ?? BigInt(0));
  const maxSupply = Number((staticData?.[4]?.result as bigint | undefined) ?? BigInt(618)); // Supply is 618
  const maxPerWallet = Number((staticData?.[5]?.result as bigint | undefined) ?? BigInt(5));
  const allowlistFreeMint = Number((staticData?.[6]?.result as bigint | undefined) ?? BigInt(1));

  // Parse user data
  const userMinted = isConnected
    ? Number((userMintedData as bigint | undefined) ?? BigInt(0))
    : 0;

  // Derived values
  const remaining = maxSupply - totalMinted;
  const isSoldOut = remaining <= 0;
  const canMint = mintActive && !paused && !isSoldOut;

  // Combined refetch
  const refetch = () => {
    refetchStatic();
    if (isConnected) {
      refetchUser();
    }
  };

  return {
    mintPrice,
    mintActive,
    paused,
    totalMinted,
    maxSupply,
    maxPerWallet,
    allowlistFreeMint,
    userMinted,
    remaining,
    isSoldOut,
    canMint,
    isLoading: staticLoading,
    isError: staticError,
    error: staticErr ?? null,
    refetch,
  };
}
