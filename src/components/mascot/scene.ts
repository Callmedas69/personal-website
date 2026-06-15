import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export interface VoxelTransform {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  scale: THREE.Vector3;
}

export interface LoadedModel {
  root: THREE.Group;
  voxels: THREE.Mesh[];
  /** white eye voxels (#ffffff) — blink */
  eyeVoxels: THREE.Mesh[];
  /** blue orb voxels (#6ab3db / #88c0db) — breathe + hover-glow */
  orbVoxels: THREE.Mesh[];
  /** skin-tone hand voxels (#efcda7) — micro-bob */
  handVoxels: THREE.Mesh[];
  /** the orb's materials — recolored by the mood system + driven by the glow */
  moodMaterials: THREE.MeshStandardMaterial[];
  /** the eye materials — recolored by the mood system (color only, no glow) */
  eyeMaterials: THREE.MeshStandardMaterial[];
  finalTransforms: VoxelTransform[];
}

// part classifiers on linear baseColorFactor (verified against the GLB):
//   eyes  #ffffff → (1, 1, 1)
//   orb   #6ab3db / #88c0db → (0.14,0.45,0.71) / (0.25,0.53,0.71)
//   hands #efcda7 → (0.86,0.61,0.39)
function isEyeColor(c: THREE.Color): boolean {
  return c.r > 0.85 && c.g > 0.85 && c.b > 0.85;
}
function isOrbColor(c: THREE.Color): boolean {
  return c.b > 0.5 && c.g > 0.3 && c.r < 0.4;
}
function isHandColor(c: THREE.Color): boolean {
  return c.r > 0.6 && c.g > 0.4 && c.g < 0.75 && c.b < 0.5 && c.r > c.g && c.g > c.b;
}

export function createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // PBR-neutral keeps the true material colors (ACES darkened/desaturated them)
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  return renderer;
}

export function createScene(): { scene: THREE.Scene; camera: THREE.PerspectiveCamera } {
  const scene = new THREE.Scene();

  // neutral ambient: near-white sky, soft mid-grey ground — keeps the cloak true
  // grey (not navy) and lifts the crevices so the figure reads as one surface
  const hemi = new THREE.HemisphereLight(0xffffff, 0x6b7280, 2.2);
  scene.add(hemi);

  // key light from upper-front-right, neutral white — defines the cube faces
  const dir = new THREE.DirectionalLight(0xffffff, 2.2);
  dir.position.set(3, 5, 4);
  scene.add(dir);

  // soft cool fill from the left so shadowed faces don't go black
  const fill = new THREE.DirectionalLight(0xbcd0ee, 0.9);
  fill.position.set(-4, 1, 2);
  scene.add(fill);

  // gentle ambient floor so no face crushes to pure black
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));

  // The voxels are deep cubes that overlap ~10 units and sit ~2600 units from the
  // camera. A near plane of 0.1 leaves almost no depth-buffer precision out there,
  // so the overlapping faces z-fight (the "mortar" seam grid). Bracket near/far
  // tightly around the model — this is what makes it render clean.
  const camera = new THREE.PerspectiveCamera(35, 1, 1200, 4200);
  return { scene, camera };
}

export async function loadModel(url: string): Promise<LoadedModel> {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(url);
  const root = gltf.scene as THREE.Group;

  const voxels: THREE.Mesh[] = [];
  const eyeVoxels: THREE.Mesh[] = [];
  const orbVoxels: THREE.Mesh[] = [];
  const handVoxels: THREE.Mesh[] = [];
  const moodMaterials: THREE.MeshStandardMaterial[] = [];
  const eyeMaterials: THREE.MeshStandardMaterial[] = [];

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    if (!mat) return;

    // the GLB ships every cube as doubleSided; these are solid opaque voxels, so
    // render front faces only — kills back-face overdraw and any residual z-fight
    mat.side = THREE.FrontSide;

    voxels.push(mesh);
    if (isEyeColor(mat.color)) {
      eyeVoxels.push(mesh);
      if (!eyeMaterials.includes(mat)) eyeMaterials.push(mat);
    } else if (isOrbColor(mat.color)) {
      orbVoxels.push(mesh);
      if (!moodMaterials.includes(mat)) moodMaterials.push(mat);
    } else if (isHandColor(mat.color)) {
      handVoxels.push(mesh);
    }
  });

  // give the orb a faint self-lit glow so it reads as "on"; breathes + pulses on events
  moodMaterials.forEach((mat) => {
    mat.emissive.copy(mat.color);
    mat.emissiveIntensity = 0.25;
  });

  // capture final world transforms BEFORE any scattering
  const finalTransforms: VoxelTransform[] = voxels.map((v) => ({
    position: v.position.clone(),
    quaternion: v.quaternion.clone(),
    scale: v.scale.clone(),
  }));

  return { root, voxels, eyeVoxels, orbVoxels, handVoxels, moodMaterials, eyeMaterials, finalTransforms };
}

export function computeModelBounds(root: THREE.Group): THREE.Box3 {
  const box = new THREE.Box3().setFromObject(root);
  return box;
}
