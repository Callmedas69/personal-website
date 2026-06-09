export type MoodState = "thinking" | "shipping" | "broke" | "flow";

export const MOOD_CONFIG: Record<MoodState, { label: string; colorClass: string }> = {
  thinking: { label: "thinking", colorClass: "text-white/70" },
  shipping: { label: "shipping", colorClass: "text-accent-green" },
  broke:    { label: "broke",    colorClass: "text-red-400" },
  flow:     { label: "flow",     colorClass: "text-accent-mint" },
};

export interface LogEntry {
  command?: string;
  response: string;
  isHTML?: boolean;
  mood?: MoodState;
}
