/**
 * Screen-space poses for the scroll companion. Positions are in NDC
 * (-1..1, y up), heightFrac is the fraction of viewport height the model
 * should occupy, rotY/rotX are the resting orientation in radians.
 *
 * Hero is NOT here — it aligns to the `[data-mascot-slot='hero']` DOM rect
 * so it tracks the responsive layout. These are the after-hero stops.
 */
export interface Pose {
  ndcX: number;
  ndcY: number;
  heightFrac: number;
  rotY: number;
  rotX: number;
}

export const POSES: Record<string, Pose> = {
  // top-right corner, shrunk, peeking above the terminal panel, turned to watch
  terminal: { ndcX: 0.76, ndcY: 0.62, heightFrac: 0.24, rotY: 0.6, rotX: 0.18 },
  // upper-right, small — rotY is driven continuously by the log scrub (barrel spin)
  log: { ndcX: 0.7, ndcY: 0.5, heightFrac: 0.28, rotY: 0, rotX: 0.04 },
  // right of the onchain panels, scaled up, facing the block ticker
  onchain: { ndcX: 0.66, ndcY: -0.02, heightFrac: 0.46, rotY: -0.3, rotX: 0.06 },
  // center stage for the dissolve finale
  footer: { ndcX: 0, ndcY: 0, heightFrac: 0.5, rotY: 0, rotX: 0 },
};

export type SectionName = "hero" | "terminal" | "log" | "onchain" | "footer";
