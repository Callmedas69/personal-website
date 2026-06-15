"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap, ScrollTrigger, DUR, EASE, MM } from "@/lib/motion";
import { createRenderer, createScene, loadModel, computeModelBounds } from "./scene";
import {
  scatterVoxels,
  buildAssemblyTimeline,
  resolveToFinals,
  computeDissolveDirs,
  applyDissolve,
} from "./assembly";
import { applyMascotMood, setMascotMoodInstant } from "./moods";
import { POSES, type SectionName } from "./poses";

// each section gives the mascot a mood — eyes + orb recolor as you scroll through
const SECTION_MOOD: Record<SectionName, string> = {
  hero: "thinking",
  terminal: "flow",
  log: "shipping",
  onchain: "flow",
  footer: "broke",
};

const MODEL_URL = "/models/0xnull.glb";
// distance from camera to model plane
const CAM_Z = 2600;
const TWO_PI = Math.PI * 2;

interface WorldPose {
  x: number;
  y: number;
  scale: number;
  rotY: number;
  rotX: number;
}

function getSlotRect(selector: string): DOMRect | null {
  const el = document.querySelector<HTMLElement>(selector);
  return el ? el.getBoundingClientRect() : null;
}

export default function MascotStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cvs: HTMLCanvasElement = canvas;

    // WebGL probe — bail silently if unsupported
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") ?? probe.getContext("webgl");
    if (!gl) return;

    // The hero slot is `hidden md:block` — the design only shows the mascot on
    // desktop. Skip all 3D work on mobile (saves the GLB fetch + a WebGL context).
    if (!window.matchMedia(MM.desktop).matches) return;

    const reduced = () => window.matchMedia(MM.reduce).matches;

    let disposed = false;
    let modelData: Awaited<ReturnType<typeof loadModel>> | null = null;
    let modelHeight = 1;
    let modelGroup: THREE.Group | null = null;
    let assemblyTl: gsap.core.Timeline | null = null;

    let heroAligned = false;
    let tickerAdded = false;
    let idleT = 0;

    // pointer parallax
    let mouseX = 0;
    let mouseY = 0;
    let curMouseX = 0;
    let curMouseY = 0;

    // pose lerp state
    let currentSection: SectionName = "hero";
    const worldCur: WorldPose = { x: 0, y: 0, scale: 1, rotY: 0, rotX: 0 };
    const worldTgt: WorldPose = { x: 0, y: 0, scale: 1, rotY: 0, rotX: 0 };

    // blink + glow
    let baseEyeScaleY: number[] = [];
    let blinkTimer: number | null = null;
    let eyePulse = 0;

    // per-part interactive motion
    let baseHandY: number[] = [];
    let gazeStep = 0; // local-space unit used to size the hand bob
    let orbGlow = 0; // eased hover-glow boost on the orb
    const orbWorld = new THREE.Vector3();

    // dissolve finale
    let dissolveDirs: THREE.Vector3[] = [];
    let dissolveSpread = 1;
    let dissolveP = 0;
    let prevDissolveP = 0;

    let moodObserver: MutationObserver | null = null;
    const scrollTriggers: ScrollTrigger[] = [];

    const renderer = createRenderer(canvas);
    const { scene, camera } = createScene();
    camera.position.z = CAM_Z;

    function viewMetrics() {
      const vw = cvs.clientWidth;
      const vh = cvs.clientHeight;
      const fovRad = (camera.fov * Math.PI) / 180;
      const halfH = Math.tan(fovRad / 2) * CAM_Z;
      const halfW = halfH * (vw / vh);
      return { vw, vh, halfH, halfW };
    }

    function resize() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      renderer.setSize(vw, vh, false);
      camera.aspect = vw / vh;
      camera.updateProjectionMatrix();
      // recompute the active target so the model stays anchored after a resize
      Object.assign(worldTgt, computeTarget(currentSection));
      if (reduced()) renderFrame();
    }

    function renderFrame() {
      if (disposed) return;
      renderer.render(scene, camera);
    }

    function addTicker() {
      if (tickerAdded) return;
      tickerAdded = true;
      gsap.ticker.add(tickLoop);
    }

    function removeTicker() {
      if (!tickerAdded) return;
      tickerAdded = false;
      gsap.ticker.remove(tickLoop);
    }

    function computeTarget(section: SectionName): WorldPose {
      if (section === "hero") {
        const rect = getSlotRect("[data-mascot-slot='hero']");
        if (rect) {
          const { vw, vh, halfH, halfW } = viewMetrics();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const ndcX = (cx / vw) * 2 - 1;
          const ndcY = -((cy / vh) * 2 - 1);
          return {
            x: ndcX * halfW,
            y: ndcY * halfH,
            scale: ((rect.height / vh) * 2 * halfH) / modelHeight,
            rotY: -0.12,
            rotX: 0,
          };
        }
        // fallback if the slot isn't laid out yet
        const { halfH } = viewMetrics();
        return { x: 0, y: 0, scale: (0.55 * 2 * halfH) / modelHeight, rotY: -0.12, rotX: 0 };
      }

      const pose = POSES[section];
      const { halfH, halfW } = viewMetrics();
      return {
        x: pose.ndcX * halfW,
        y: pose.ndcY * halfH,
        scale: (pose.heightFrac * 2 * halfH) / modelHeight,
        rotY: pose.rotY,
        rotX: pose.rotX,
      };
    }

    function setSection(name: SectionName) {
      if (currentSection === name) return;
      currentSection = name;
      // wrap current yaw into [-π,π] so the lerp to the next pose never unwinds
      // a full barrel-spin backwards (the log section can push rotY past 2π)
      worldCur.rotY = ((worldCur.rotY + Math.PI) % TWO_PI + TWO_PI) % TWO_PI - Math.PI;
      Object.assign(worldTgt, computeTarget(name));
      // recolor the mascot (eyes + orb) to this section's mood — a smooth tween,
      // no brightness flare, so the scroll-through transition stays seamless
      if (modelData) {
        const mood = SECTION_MOOD[name];
        if (reduced()) {
          setMascotMoodInstant(modelData.moodMaterials, modelData.eyeMaterials, mood);
        } else {
          applyMascotMood(modelData.moodMaterials, modelData.eyeMaterials, mood, gsap);
        }
      }
    }

    function tickLoop() {
      if (disposed || !modelGroup) return;
      // before choreography (e.g. during the boot assembly) the model owns its
      // own transform — only render, never apply a pose
      if (!heroAligned) {
        renderFrame();
        return;
      }
      idleT += 0.016;
      const isReduced = reduced();

      // The hero pose is anchored to a DOM slot that scrolls with the page, so
      // re-resolve its target every frame — otherwise it's only computed at the
      // moment setSection("hero") fires (part-way up the page) and never settles
      // back to the slot's resting rect when you scroll to the very top. Other
      // sections are fixed NDC poses and only need the one-shot setSection target.
      if (currentSection === "hero") Object.assign(worldTgt, computeTarget("hero"));

      // ease pose
      const k = 0.08;
      worldCur.x += (worldTgt.x - worldCur.x) * k;
      worldCur.y += (worldTgt.y - worldCur.y) * k;
      worldCur.scale += (worldTgt.scale - worldCur.scale) * k;
      worldCur.rotY += (worldTgt.rotY - worldCur.rotY) * k;
      worldCur.rotX += (worldTgt.rotX - worldCur.rotX) * k;

      // pointer parallax (eased)
      curMouseX += (mouseX - curMouseX) * 0.08;
      curMouseY += (mouseY - curMouseY) * 0.08;

      const bob = isReduced ? 0 : Math.sin(idleT * 0.8) * 10;
      modelGroup.position.x = worldCur.x;
      modelGroup.position.y = worldCur.y + bob;
      modelGroup.scale.setScalar(worldCur.scale);
      modelGroup.rotation.y = worldCur.rotY + (isReduced ? 0 : curMouseX * 0.25);
      modelGroup.rotation.x = worldCur.rotX + (isReduced ? 0 : curMouseY * 0.14);

      // ── per-part interactive motion (only while live & not dissolving) ──
      const interactive =
        modelData != null && !isReduced && dissolveP < 0.001 && prevDissolveP < 0.001;

      if (interactive && modelData) {
        // hands: gentle bob, lagging the body bob — reads as channeling the orb
        modelData.handVoxels.forEach((h, i) => {
          h.position.y = baseHandY[i] + Math.sin(idleT * 0.8 - 0.6) * gazeStep * 0.6;
        });

        // orb hover-glow: project a representative orb voxel, compare to pointer NDC
        const rep = modelData.orbVoxels[Math.floor(modelData.orbVoxels.length / 2)];
        if (rep) {
          modelGroup.updateMatrixWorld(true);
          rep.getWorldPosition(orbWorld).project(camera);
          const d = Math.hypot(orbWorld.x - mouseX, orbWorld.y - mouseY);
          orbGlow += ((d < 0.28 ? 0.6 : 0) - orbGlow) * 0.1;
        }
      } else {
        orbGlow += (0 - orbGlow) * 0.1;
        // settle hands back to rest when paused (e.g. reduced-motion toggle)
        if (modelData && dissolveP < 0.001 && prevDissolveP < 0.001) {
          modelData.handVoxels.forEach((h, i) => (h.position.y = baseHandY[i]));
        }
      }

      // orb emissive: idle breathe + section-arrival pulse + hover glow
      if (modelData) {
        const breathe = isReduced ? 0 : Math.sin(idleT * 1.2) * 0.12;
        const intensity = 0.25 + breathe + eyePulse + orbGlow;
        modelData.moodMaterials.forEach((m) => (m.emissiveIntensity = intensity));
        if (eyePulse > 0.001) eyePulse *= 0.92;
      }

      // dissolve (only touch voxels while it's active or just settled to 0)
      if (modelData && (dissolveP > 0.001 || prevDissolveP > 0.001)) {
        applyDissolve(modelData.voxels, modelData.finalTransforms, dissolveDirs, dissolveP, dissolveSpread);
        prevDissolveP = dissolveP;
      }

      renderFrame();
    }

    function scheduleBlink() {
      if (disposed || reduced() || !modelData) return;
      const delay = 3000 + Math.random() * 4000;
      blinkTimer = window.setTimeout(() => {
        if (disposed || !modelData) return;
        const eyes = modelData.eyeVoxels;
        const proxy = { b: 1 };
        gsap.to(proxy, {
          b: 0.1,
          duration: 0.07,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
          onUpdate: () => eyes.forEach((e, i) => (e.scale.y = baseEyeScaleY[i] * proxy.b)),
        });
        scheduleBlink();
      }, delay);
    }

    function setupMoodObserver() {
      moodObserver = new MutationObserver(() => {
        if (!modelData) return;
        const theme = document.documentElement.dataset.theme ?? "thinking";
        if (reduced()) {
          setMascotMoodInstant(modelData.moodMaterials, modelData.eyeMaterials, theme);
        } else {
          applyMascotMood(modelData.moodMaterials, modelData.eyeMaterials, theme, gsap);
          eyePulse = 0.8; // flare the orb on a manual mood switch
        }
        renderFrame();
      });
      moodObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    }

    // one trigger per section: whichever section owns screen-center is active
    function mkSectionTrigger(name: SectionName) {
      const el = document.querySelector(`[data-mascot-section='${name}']`);
      if (!el) return;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter: () => setSection(name),
        onEnterBack: () => setSection(name),
      });
      scrollTriggers.push(st);
    }

    // log section: barrel-spin the yaw across the horizontal scrub
    function mkLogSpinTrigger() {
      const el = document.querySelector("[data-mascot-section='log']");
      if (!el) return;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          if (currentSection === "log") worldTgt.rotY = self.progress * TWO_PI;
        },
      });
      scrollTriggers.push(st);
    }

    // footer: scrub-driven voxel dissolve into the void
    function mkFooterTrigger() {
      const el = document.querySelector("[data-mascot-section='footer']");
      if (!el) return;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 75%",
        end: "bottom bottom",
        scrub: true,
        onEnter: () => setSection("footer"),
        onEnterBack: () => setSection("footer"),
        onUpdate: (self) => {
          dissolveP = self.progress;
        },
        onLeaveBack: () => {
          dissolveP = 0;
        },
      });
      scrollTriggers.push(st);
    }

    // unified entry into the live, scroll-reactive state (both visit paths)
    function startChoreography() {
      if (!modelGroup || !modelData) return;
      cvs.style.zIndex = "5";

      // seed a controlled entrance derived from the hero target (a touch low,
      // small and turned), then lerp into place — never read modelGroup, whose
      // scale carries the GLB's dequantization transform
      const hero = computeTarget("hero");
      Object.assign(worldTgt, hero);
      worldCur.x = hero.x;
      worldCur.y = hero.y - modelHeight * hero.scale * 0.1;
      worldCur.scale = hero.scale * 0.72;
      worldCur.rotY = hero.rotY - 0.35;
      worldCur.rotX = hero.rotX;
      currentSection = "hero";
      heroAligned = true;

      baseEyeScaleY = modelData.eyeVoxels.map((e) => e.scale.y);
      baseHandY = modelData.handVoxels.map((h) => h.position.y);
      gazeStep = modelHeight * 0.02; // hand-bob amplitude (~⅓ voxel)
      dissolveDirs = computeDissolveDirs(modelData.finalTransforms);
      dissolveSpread = modelHeight * 4; // fling the (opaque) cubes clear off-screen

      setupMoodObserver();

      if (reduced()) {
        // static: snap to hero, render once, no ticker / triggers / blink
        Object.assign(worldCur, worldTgt);
        modelGroup.position.set(worldCur.x, worldCur.y, 0);
        modelGroup.scale.setScalar(worldCur.scale);
        modelGroup.rotation.set(worldCur.rotX, worldCur.rotY, 0);
        renderFrame();
        return;
      }

      mkSectionTrigger("hero");
      mkSectionTrigger("terminal");
      mkSectionTrigger("log");
      mkLogSpinTrigger();
      mkSectionTrigger("onchain");
      mkFooterTrigger();

      scheduleBlink();
      addTicker();
      ScrollTrigger.refresh();
    }

    async function init() {
      resize();
      window.addEventListener("resize", resize);

      try {
        modelData = await loadModel(MODEL_URL);
      } catch (e) {
        console.error("[Mascot] GLB load failed", e);
        return;
      }
      if (disposed) return;

      const { root, voxels, moodMaterials, eyeMaterials, finalTransforms } = modelData;

      modelGroup = new THREE.Group();
      modelGroup.add(root);
      scene.add(modelGroup);

      const box = computeModelBounds(root);
      modelHeight = box.max.y - box.min.y;
      root.position.y = -(box.max.y + box.min.y) / 2;

      setMascotMoodInstant(moodMaterials, eyeMaterials, document.documentElement.dataset.theme ?? "thinking");

      const isBootPending = document.documentElement.dataset.boot === "pending";

      if (!isBootPending) {
        // repeat visit — resolve assembled, fade in at hero, go live
        resolveToFinals(voxels, finalTransforms);
        const hero = computeTarget("hero");
        modelGroup.position.set(hero.x, hero.y, 0);
        modelGroup.scale.setScalar(hero.scale);

        voxels.forEach((v) => {
          const mat = v.material as THREE.MeshStandardMaterial;
          mat.transparent = true;
          mat.opacity = 0;
          gsap.to(mat, { opacity: 1, duration: DUR.base, ease: EASE.out });
        });

        startChoreography();
      } else {
        // first visit — assemble in the boot slot, then fly into the page
        cvs.style.zIndex = "70";
        const bootRect = getSlotRect("[data-mascot-slot='boot']");
        if (bootRect) {
          const { vw, vh, halfH, halfW } = viewMetrics();
          const cx = bootRect.left + bootRect.width / 2;
          const cy = bootRect.top + bootRect.height / 2;
          modelGroup.position.set(
            ((cx / vw) * 2 - 1) * halfW,
            -((cy / vh) * 2 - 1) * halfH,
            0
          );
          modelGroup.scale.setScalar(((bootRect.height / vh) * 2 * halfH) / modelHeight);
        }

        const scatterRadius = modelHeight * 1.5;

        const onAssemblyStart = () => {
          if (disposed || !modelData) return;
          if (reduced()) {
            resolveToFinals(voxels, finalTransforms);
            renderFrame();
            return;
          }
          scatterVoxels(voxels, finalTransforms, scatterRadius);
          renderFrame();
          assemblyTl = buildAssemblyTimeline(voxels, finalTransforms);
          assemblyTl.eventCallback("onUpdate", renderFrame);
          assemblyTl.play();
        };

        const onBootComplete = () => {
          if (disposed) return;
          if (assemblyTl) assemblyTl.progress(1);
          else resolveToFinals(voxels, finalTransforms);
          startChoreography();
        };

        document.addEventListener("boot-assembly-start", onAssemblyStart, { once: true });
        document.addEventListener("boot-complete", onBootComplete, { once: true });
        addTicker(); // render the assembly while boot runs
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onVisibilityChange = () => {
      if (document.hidden) removeTicker();
      else if (heroAligned && !reduced()) addTicker();
    };
    window.addEventListener("pointermove", onPointerMove);
    document.addEventListener("visibilitychange", onVisibilityChange);

    init();

    return () => {
      disposed = true;
      removeTicker();
      if (blinkTimer !== null) window.clearTimeout(blinkTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      moodObserver?.disconnect();
      scrollTriggers.forEach((st) => st.kill());
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 70 }}
      aria-hidden="true"
    />
  );
}
