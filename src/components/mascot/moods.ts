import * as THREE from "three";

// matches AgentTerminal.tsx THEMES + CSS var palette
export const MOOD_ACCENT: Record<string, [number, number, number]> = {
  thinking: [0x6e / 255, 0x9c / 255, 0xf1 / 255],  // #6e9cf1
  shipping: [0xaa / 255, 0xe8 / 255, 0x7b / 255],  // #aae87b
  broke:    [0xf8 / 255, 0x71 / 255, 0x71 / 255],  // #f87171
  flow:     [0x60 / 255, 0xd0 / 255, 0xff / 255],  // #60d0ff
};

export function getMoodColor(theme: string): [number, number, number] {
  return MOOD_ACCENT[theme] ?? MOOD_ACCENT.thinking;
}

export function applyMoodToMaterials(
  mats: THREE.MeshStandardMaterial[],
  theme: string,
  gsapInstance: typeof import("gsap").gsap,
  duration = 0.55
) {
  const [r, g, b] = getMoodColor(theme);
  mats.forEach((mat) => {
    gsapInstance.to(mat.color, { r, g, b, duration, ease: "power3.inOut" });
    gsapInstance.to(mat.emissive, { r, g, b, duration, ease: "power3.inOut" });
  });
}

export function setMoodInstant(
  mats: THREE.MeshStandardMaterial[],
  theme: string
) {
  const [r, g, b] = getMoodColor(theme);
  mats.forEach((mat) => {
    mat.color.setRGB(r, g, b);
    mat.emissive.setRGB(r, g, b);
  });
}

/**
 * Recolor the whole mascot to a mood: the orb gets full color + emissive (it
 * glows), the eyes get color only (no glow). Both tween together so a mood
 * change reads as one seamless transition.
 */
export function applyMascotMood(
  orb: THREE.MeshStandardMaterial[],
  eyes: THREE.MeshStandardMaterial[],
  theme: string,
  gsapInstance: typeof import("gsap").gsap,
  duration = 0.55
) {
  const [r, g, b] = getMoodColor(theme);
  orb.forEach((mat) => {
    gsapInstance.to(mat.color, { r, g, b, duration, ease: "power3.inOut" });
    gsapInstance.to(mat.emissive, { r, g, b, duration, ease: "power3.inOut" });
  });
  eyes.forEach((mat) => {
    gsapInstance.to(mat.color, { r, g, b, duration, ease: "power3.inOut" });
  });
}

export function setMascotMoodInstant(
  orb: THREE.MeshStandardMaterial[],
  eyes: THREE.MeshStandardMaterial[],
  theme: string
) {
  const [r, g, b] = getMoodColor(theme);
  orb.forEach((mat) => {
    mat.color.setRGB(r, g, b);
    mat.emissive.setRGB(r, g, b);
  });
  eyes.forEach((mat) => mat.color.setRGB(r, g, b));
}
