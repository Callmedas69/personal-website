import * as THREE from "three";
import { gsap } from "@/lib/motion";
import type { VoxelTransform } from "./scene";

function randomOnSphere(radius: number): THREE.Vector3 {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi)
  );
}

function randomQuat(): THREE.Quaternion {
  const q = new THREE.Quaternion();
  q.setFromEuler(
    new THREE.Euler(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    )
  );
  return q;
}

// shuffle Fisher-Yates so assembly looks organic
function shuffledIndices(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function scatterVoxels(
  voxels: THREE.Mesh[],
  finals: VoxelTransform[],
  scatterRadius: number
) {
  voxels.forEach((v) => {
    const scatter = randomOnSphere(scatterRadius);
    v.position.copy(scatter);
    v.quaternion.copy(randomQuat());
    v.scale.setScalar(0.001);
    // store original final on userData for instant-resolve path
    const idx = voxels.indexOf(v);
    v.userData._final = finals[idx];
  });
}

export function buildAssemblyTimeline(
  voxels: THREE.Mesh[],
  finals: VoxelTransform[]
): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true });
  const order = shuffledIndices(voxels.length);
  const totalSpread = 1.4; // seconds

  order.forEach((i, slot) => {
    const v = voxels[i];
    const f = finals[i];
    const at = (slot / voxels.length) * totalSpread;

    tl.to(
      v.position,
      { x: f.position.x, y: f.position.y, z: f.position.z, duration: 0.9, ease: "power4.out" },
      at
    );
    tl.to(
      v.quaternion,
      { x: f.quaternion.x, y: f.quaternion.y, z: f.quaternion.z, w: f.quaternion.w, duration: 0.9, ease: "power4.out" },
      at
    );
    tl.to(
      v.scale,
      { x: f.scale.x, y: f.scale.y, z: f.scale.z, duration: 0.35, ease: "back.out(2)" },
      at
    );
  });

  return tl;
}

export function resolveToFinals(voxels: THREE.Mesh[], finals: VoxelTransform[]) {
  voxels.forEach((v, i) => {
    v.position.copy(finals[i].position);
    v.quaternion.copy(finals[i].quaternion);
    v.scale.copy(finals[i].scale);
  });
}

/**
 * Precompute an outward direction per voxel for the footer dissolve — each
 * voxel flies away from the model centroid plus a touch of jitter so the
 * scatter feels organic rather than a clean radial burst.
 */
export function computeDissolveDirs(finals: VoxelTransform[]): THREE.Vector3[] {
  const centroid = new THREE.Vector3();
  finals.forEach((f) => centroid.add(f.position));
  centroid.multiplyScalar(1 / Math.max(1, finals.length));

  return finals.map((f) => {
    const dir = f.position.clone().sub(centroid);
    if (dir.lengthSq() < 1e-6) dir.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    dir.normalize();
    // bias upward + add jitter so it drifts into the void rather than a flat ring
    dir.x += (Math.random() - 0.5) * 0.6;
    dir.y += 0.4 + Math.random() * 0.4;
    dir.z += (Math.random() - 0.5) * 0.6;
    return dir.normalize();
  });
}

/**
 * Scrub-driven dissolve: at p=0 voxels sit at finals (assembled); at p=1 they
 * have flung outward by `spread`. Cubes stay fully opaque — they shatter and
 * fly off-screen rather than fading. Fully reversible.
 */
export function applyDissolve(
  voxels: THREE.Mesh[],
  finals: VoxelTransform[],
  dirs: THREE.Vector3[],
  p: number,
  spread: number
) {
  const eased = p * p; // ease-in so the model holds then bursts
  voxels.forEach((v, i) => {
    const f = finals[i];
    const d = dirs[i];
    v.position.set(
      f.position.x + d.x * eased * spread,
      f.position.y + d.y * eased * spread,
      f.position.z + d.z * eased * spread
    );
  });
}
