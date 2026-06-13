"use client";

import dynamic from "next/dynamic";

const MascotStage = dynamic(() => import("./MascotStage"), { ssr: false });

export default function Mascot() {
  return <MascotStage />;
}
