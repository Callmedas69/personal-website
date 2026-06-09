import { MOOD_CONFIG, type MoodState } from "./types";

interface MoodBadgeProps {
  mood: MoodState;
}

export default function MoodBadge({ mood }: MoodBadgeProps) {
  const { label, colorClass } = MOOD_CONFIG[mood];
  return (
    <span className={`text-[10px] font-mono ${colorClass} opacity-80`}>
      ● {label}
    </span>
  );
}
