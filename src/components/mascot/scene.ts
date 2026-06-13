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
  /** meshes whose material is a mood (blue eye/visor) material — used for blink */
  eyeVoxels: THREE.Mesh[];
  moodMaterials: THREE.MeshStandardMaterial[];
  finalTransforms: VoxelTransform[];
}

// blue threshold: eye/visor voxels (r≈0.144 g≈0.451 b≈0.708 and r≈0.246 g≈0.527 b≈0.708)
function isMoodColor(color: THREE.Color): boolean {
  return color.b > 0.5 && color.g > 0.3 && color.r < 0.4;
}

export function createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  return renderer;
}

export function createScene(): { scene: THREE.Scene; camera: THREE.PerspectiveCamera } {
  const scene = new THREE.Scene();

  // hemisphere: sky=accent-blue, ground=brand-bg
  const hemi = new THREE.HemisphereLight(0x6e9cf1, 0x011627, 1.8);
  scene.add(hemi);

  // key light from upper-front-right
  const dir = new THREE.DirectionalLight(0xd8dee9, 2.5);
  dir.position.set(2, 4, 3);
  scene.add(dir);

  // subtle fill from left
  const fill = new THREE.DirectionalLight(0x75d1c4, 0.6);
  fill.position.set(-3, 1, 2);
  scene.add(fill);

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 5000);
  return { scene, camera };
}

export async function loadModel(url: string): Promise<LoadedModel> {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(url);
  const root = gltf.scene as THREE.Group;

  const voxels: THREE.Mesh[] = [];
  const eyeVoxels: THREE.Mesh[] = [];
  const moodMaterials: THREE.MeshStandardMaterial[] = [];

  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      voxels.push(mesh);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat && isMoodColor(mat.color)) {
        eyeVoxels.push(mesh);
        if (!moodMaterials.includes(mat)) moodMaterials.push(mat);
      }
    }
  });

  // give the eyes a faint self-lit glow so they read as "on"; pulses on events
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

  return { root, voxels, eyeVoxels, moodMaterials, finalTransforms };
}

export function computeModelBounds(root: THREE.Group): THREE.Box3 {
  const box = new THREE.Box3().setFromObject(root);
  return box;
}
