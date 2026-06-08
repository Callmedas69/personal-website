"use client";

import { useEffect, useRef } from "react";

type Mood = "thinking" | "shipping" | "broke" | "flow";

interface OxNullProps {
  mood?: Mood;
  size?: number;
  className?: string;
}

const PIXELS = [
  [0,0,0,2,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,2,1,1,1],
  [2,1,1,1,1,2,1,1,1,1],
  [1,1,3,4,3,4,3,1,1,2],
  [1,1,3,5,3,5,3,1,1,1],
  [1,1,3,3,3,3,3,2,1,1],
  [1,2,3,3,3,3,3,1,1,1],
  [0,1,1,1,1,1,1,1,1,0],
  [0,0,4,4,4,4,4,2,1,0],
  [0,0,0,6,6,6,4,1,1,0],
  [0,6,6,7,7,6,6,4,1,0],
  [0,6,6,6,6,6,6,4,2,0],
  [0,8,1,6,6,6,4,8,1,0],
  [0,0,0,0,1,1,1,1,0,0],
  [0,0,0,1,1,1,1,1,0,0],
  [0,0,0,9,1,1,1,1,0,0],
  [0,0,0,1,9,1,1,2,0,0],
  [0,0,0,1,4,1,1,1,0,0],
  [0,0,0,1,4,1,1,1,1,0],
  [0,0,1,1,1,9,9,9,1,0],
];

const BASE_PALETTE: Record<number, string> = {
  1: "#808080", // GR
  2: "#868686", // GL
  3: "#2a2a2a", // DK
  4: "#646464", // GD
  5: "#ffffff", // EW  eye (default)
  6: "#6ab3db", // BL  item (default)
  7: "#88c0db", // BM
  8: "#efcda7", // SK
  9: "#4a4a4a", // FT
};

const MOOD_OVERRIDES: Record<Mood, { eye: string; item: string }> = {
  thinking: { eye: "#ffffff", item: "#6ab3db" },
  shipping: { eye: "#00e87a", item: "#00e87a" },
  broke:    { eye: "#ff4d4d", item: "#ff4d4d" },
  flow:     { eye: "#60d0ff", item: "#9d7cf4" },
};

export default function OxNull({ mood = "thinking", size = 80, className }: OxNullProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const GRID_W = 10;
  const GRID_H = 21;
  const px = Math.floor(size / GRID_W);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const overrides = MOOD_OVERRIDES[mood];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    PIXELS.forEach((row, r) => {
      row.forEach((code, c) => {
        if (code === 0) return;
        let color = BASE_PALETTE[code];
        if (code === 5) color = overrides.eye;
        if (code === 6 || code === 7) color = overrides.item;
        ctx.fillStyle = color;
        ctx.fillRect(c * px, r * px, px, px);
      });
    });
  }, [mood, px]);

  return (
    <canvas
      ref={canvasRef}
      width={GRID_W * px}
      height={GRID_H * px}
      style={{ imageRendering: "pixelated", width: GRID_W * px, height: GRID_H * px }}
      className={className}
    />
  );
}