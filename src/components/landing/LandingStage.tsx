"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { LANDING_SECTION_IDS } from "@/constants/landing.constants";

type StageState = "loading" | "ready" | "off";

// 3D 배경: 오뚜기 캐릭터와 31일 × 8명 근무 타일. 스크롤 위치에 따라 궤도 → 표 → 막대로 모인다.
// 히어로·문의 구간에서 화면을 누르면 오뚜기가 흔들린다. WebGL이 없으면 배경 그라데이션만 남는다.
export default function LandingStage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<StageState>("loading");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      // 렌더러를 만들 수 없는 환경(WebGL 미지원)을 알리는 상태 변경이라 effect 안에서 한 번만 바꾼다.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState("off");
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
    const TAN = Math.tan((38 * Math.PI) / 360);

    // 조명
    scene.add(new THREE.AmbientLight(0xffc2d4, 0.62));
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(4, 8, 7);
    scene.add(key);
    const accentLight = new THREE.PointLight(0xd2456f, 2.6, 40);
    accentLight.position.set(-6, 2, 5);
    scene.add(accentLight);
    const warmLight = new THREE.PointLight(0xffb48a, 1.1, 40);
    warmLight.position.set(7, -2, 6);
    scene.add(warmLight);
    const rim = new THREE.DirectionalLight(0xffd3e0, 1.0);
    rim.position.set(-4, 5, -5);
    scene.add(rim);

    function glowTex(hex: string) {
      const c = document.createElement("canvas");
      c.width = c.height = 256;
      const g = c.getContext("2d")!;
      const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
      gr.addColorStop(0, `${hex}cc`);
      gr.addColorStop(0.42, `${hex}33`);
      gr.addColorStop(1, `${hex}00`);
      g.fillStyle = gr;
      g.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(c);
    }

    // 오뚜기
    const tumbler = new THREE.Group();
    scene.add(tumbler);
    const pivot = new THREE.Group();
    tumbler.add(pivot);
    const H = 1.7;
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 44; i++) {
      const t = i / 44;
      pts.push(new THREE.Vector2(Math.max(Math.sin(Math.PI * Math.pow(t, 0.72)) * (1 - 0.22 * t), 0.0001), t * H));
    }
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0xa02a55,
      roughness: 0.26,
      metalness: 0.04,
      clearcoat: 1,
      clearcoatRoughness: 0.14,
    });
    pivot.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 72), bodyMat));
    const band: THREE.Vector2[] = [];
    for (let i = 10; i <= 26; i++) {
      const t = i / 44;
      band.push(new THREE.Vector2(Math.sin(Math.PI * Math.pow(t, 0.72)) * (1 - 0.22 * t) * 1.012, t * H));
    }
    pivot.add(
      new THREE.Mesh(
        new THREE.LatheGeometry(band, 72),
        new THREE.MeshStandardMaterial({ color: 0xf2f6ff, roughness: 0.5, side: THREE.DoubleSide }),
      ),
    );
    const head = new THREE.Group();
    head.position.y = 1.95;
    pivot.add(head);
    head.add(
      new THREE.Mesh(new THREE.SphereGeometry(0.66, 48, 32), new THREE.MeshStandardMaterial({ color: 0xffd8c0, roughness: 0.55 })),
    );
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x141b2d, roughness: 0.3 });
    [-1, 1].forEach((s) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.056, 16, 12), eyeMat);
      eye.position.set(0.21 * s, 0.04, 0.625);
      head.add(eye);
      const cheek = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 16, 12),
        new THREE.MeshStandardMaterial({ color: 0xff9fb0, roughness: 0.7 }),
      );
      cheek.scale.set(1, 0.66, 0.35);
      cheek.position.set(0.38 * s, -0.1, 0.5);
      head.add(cheek);
    });
    const smile = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.022, 10, 28, Math.PI), eyeMat);
    smile.rotation.z = Math.PI;
    smile.position.set(0, -0.1, 0.645);
    head.add(smile);
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.46, 0.5, 0.22, 40),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.45 }),
    );
    cap.position.set(0, 0.62, 0);
    cap.rotation.x = -0.18;
    head.add(cap);
    const crossMat = new THREE.MeshStandardMaterial({ color: 0x7a1f3d, roughness: 0.4 });
    const cr1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.058, 0.02), crossMat);
    const cr2 = new THREE.Mesh(new THREE.BoxGeometry(0.058, 0.2, 0.02), crossMat);
    [cr1, cr2].forEach((c) => {
      c.position.set(0, 0.615, 0.505);
      c.rotation.x = -0.18;
      head.add(c);
    });
    const floorGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 7),
      new THREE.MeshBasicMaterial({
        map: glowTex("#c23a68"),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    floorGlow.rotation.x = -Math.PI / 2;
    floorGlow.position.y = -0.02;
    tumbler.add(floorGlow);
    const backGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTex("#ff80a6"),
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    backGlow.scale.set(8, 8, 1);
    backGlow.position.set(0, 1.6, -1.4);
    tumbler.add(backGlow);

    // 별
    const starPos = new Float32Array(900 * 3);
    for (let i = 0; i < 900; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 80;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      starPos[i * 3 + 2] = -12 - Math.random() * 30;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xffc4d4, size: 0.09, transparent: true, opacity: 0.75, depthWrite: false }),
    );
    scene.add(stars);

    // 근무 타일 (31일 × 8명)
    const COLS = 31;
    const ROWS = 8;
    const N = COLS * ROWS;
    const PAL: Record<string, number> = { D: 0xffc94d, E: 0xff8a5b, N: 0x9a8cff, O: 0xb7a3ab };
    const PAT = ["DDOODDD", "EENNOOD", "OOEENND", "OODDEEN", "DEEOONN", "OONNDDE", "NNOOEED", "EDDOONN"];
    const tiles = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.42, 0.42, 0.16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.34, metalness: 0.14 }),
      N,
    );
    tiles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(tiles);
    const baseC: THREE.Color[] = [];
    for (let i = 0; i < N; i++) {
      const r = Math.floor(i / COLS);
      const c = i % COLS;
      baseC.push(new THREE.Color(PAL[PAT[r].charAt((c + r * 2) % 7)]));
      tiles.setColorAt(i, baseC[i]);
    }
    tiles.instanceColor!.needsUpdate = true;
    const VIO = [2 * 31 + 5, 2 * 31 + 6, 5 * 31 + 11, 5 * 31 + 12, 6 * 31 + 20, 1 * 31 + 24];
    const RED = new THREE.Color(0xff3b4e);
    const tmpC = new THREE.Color();
    let vioDirty = false;

    const ph: number[] = [];
    const rd: number[] = [];
    const el: number[] = [];
    const sp: number[] = [];
    const rt: number[] = [];
    const sc0: number[] = [];
    const spx: number[] = [];
    const spy: number[] = [];
    const spz: number[] = [];
    const px = new Float32Array(N);
    const py = new Float32Array(N);
    const pz = new Float32Array(N);
    const sx = new Float32Array(N);
    const sy = new Float32Array(N);
    const sz = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      ph.push(Math.random());
      rd.push(Math.random());
      el.push(Math.random());
      sp.push((0.05 + Math.random() * 0.09) * (Math.random() < 0.5 ? -1 : 1));
      rt.push(Math.random());
      sc0.push(0.55 + Math.random() * 0.7);
      spx.push((Math.random() - 0.5) * 1.2);
      spy.push((Math.random() - 0.5) * 1.2);
      spz.push((Math.random() - 0.5) * 1.2);
      px[i] = (Math.random() - 0.5) * 10;
      py[i] = (Math.random() - 0.5) * 8;
      pz[i] = -4 - Math.random() * 4;
      sx[i] = sy[i] = sz[i] = 0.001;
    }
    const BH = [24, 27, 22, 25, 31, 23, 26, 24];
    const dummy = new THREE.Object3D();

    // 상태·입력
    const secs = LANDING_SECTION_IDS.map((id) => document.getElementById(id));
    let W = [1, 0, 0, 0, 0, 0, 0];
    function weights() {
      const vh = window.innerHeight;
      const vc = vh / 2;
      let sum = 0;
      const out: number[] = [];
      for (const sec of secs) {
        if (!sec) {
          out.push(0);
          continue;
        }
        const rc = sec.getBoundingClientRect();
        const d = Math.abs(rc.top + rc.height / 2 - vc) / (Math.max(rc.height, vh) * 0.62);
        const x = Math.max(0, 1 - d);
        const w = x * x * (3 - 2 * x);
        out.push(w);
        sum += w;
      }
      if (sum < 1e-4) {
        out[0] = 1;
        sum = 1;
      }
      return out.map((w) => w / sum);
    }
    function layout(a: number) {
      if (a < 0.95)
        return {
          portrait: true, P: 0.5, Pp: 0.44, gridX: 0, gridY: -0.2, barX: 0, barY: -2.5, bs: 0.62, bp: 0.16,
          bsx: 1.0, bsy: 0.36, bsz: 1.6, hx: 0, hy: -3.7, hs: 0.95, cx: 0, cy: -3.4, cs: 0.9, orbitZ: 15,
        };
      const wide = a > 1.25;
      return {
        portrait: false, P: 0.5, Pp: 0.44, gridX: 0, gridY: -1.7, barX: wide ? 3.6 : 2.2, barY: -3.2, bs: 1.15,
        bp: 0.2, bsx: 1.9, bsy: 0.42, bsz: 2.6, hx: Math.min(3.5, a * 1.75), hy: -2.1, hs: 1.3, cx: 0, cy: -3.1,
        cs: 1.0, orbitZ: 11.5,
      };
    }
    const pointer = { x: 0, y: 0 };
    const tilt = { ax: 0, az: 0, vx: 0, vz: 0 };
    const camP = { x: 0, y: 0, z: 12 };
    const tPos = { x: 0, y: -2, s: 1 };
    function push(m: number) {
      const a = Math.random() * 6.2832;
      tilt.vx += Math.cos(a) * m;
      tilt.vz += Math.sin(a) * m;
    }
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest?.("a,button,input,form")) return;
      if (W[0] + W[6] > 0.45) push(reduce ? 1.4 : 3.4);
    };
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      tilt.vz += Math.max(-3, Math.min(3, (y - lastY) * 0.012));
      lastY = y;
    };
    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    resize();

    // 프레임
    let last = performance.now();
    let T = 0;
    let first = true;
    let kick = false;
    let raf = 0;
    const ease = (x: number) => x * x * (3 - 2 * x);
    function frame(now: number) {
      raf = window.requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      T += dt * (reduce ? 0.3 : 1);
      const a = window.innerWidth / window.innerHeight;
      const L = layout(a);
      W = weights();
      const wO = W[0] + W[6];
      const wG = W[1] + W[2] + W[3];
      const wB = W[4] + W[5];
      const wHero = W[0];
      const wCta = W[6];

      // 오뚜기 위치·크기
      const vis = Math.min(1, wO * 1.5);
      const den = Math.max(1e-4, wHero + wCta);
      const tx = (wHero * L.hx + wCta * L.cx) / den;
      const ty = (wHero * L.hy + wCta * L.cy) / den;
      const ts = (wHero * L.hs + wCta * L.cs) / den;
      const kt = 1 - Math.exp(-6 * dt);
      tPos.x += (tx - tPos.x) * kt;
      tPos.y += (ty - tPos.y) * kt;
      tPos.s += (ts * ease(vis) - tPos.s) * kt;
      tumbler.visible = tPos.s > 0.02;
      tumbler.position.set(tPos.x, tPos.y, 0);
      tumbler.scale.setScalar(Math.max(tPos.s, 0.001));
      // 오뚜기 흔들림: 스프링
      tilt.vx += (-32 * tilt.ax - 2.3 * tilt.vx) * dt;
      tilt.ax += tilt.vx * dt;
      tilt.vz += (-32 * tilt.az - 2.3 * tilt.vz) * dt;
      tilt.az += tilt.vz * dt;
      tilt.ax = Math.max(-0.9, Math.min(0.9, tilt.ax));
      tilt.az = Math.max(-0.9, Math.min(0.9, tilt.az));
      const idle = reduce ? 0 : 1;
      pivot.rotation.x = tilt.ax + Math.sin(T * 1.1) * 0.014 * idle;
      pivot.rotation.z = tilt.az + Math.cos(T * 0.9) * 0.014 * idle;
      tumbler.rotation.y += (pointer.x * 0.35 + Math.sin(T * 0.4) * 0.1 * idle - tumbler.rotation.y) * kt;
      head.rotation.y += (pointer.x * 0.4 - head.rotation.y) * kt;
      head.rotation.x += (pointer.y * 0.18 - head.rotation.x) * kt;
      if (!kick && T > 1.0 && !reduce) {
        kick = true;
        push(2.6);
      }

      // 카메라
      let zGrid: number;
      let zBars: number;
      if (L.portrait) {
        zGrid = Math.max(((COLS * L.Pp) / 2 + 0.9) / TAN, ((ROWS * L.Pp) / 2 + 0.7) / (TAN * a), 12);
        zBars = Math.max(((8 * L.bs) / 2 + 0.7) / (TAN * a), 12);
      } else {
        const halfW = (COLS * L.P) / 2 + 0.9;
        zGrid = Math.max(halfW / (TAN * a), 12);
        zBars = Math.max(((4.4 * L.bs) / 1.15 + L.barX + 0.8) / (TAN * a), 13);
      }
      const zT = wO * L.orbitZ + wG * zGrid + wB * zBars;
      const kc = 1 - Math.exp(-3.2 * dt);
      camP.z += (zT - camP.z) * kc;
      camP.x += (pointer.x * 0.9 - camP.x) * kc;
      camP.y += (-pointer.y * 0.5 - camP.y) * kc;
      camera.position.set(camP.x, camP.y, camP.z);
      camera.lookAt(0, 0, 0);
      stars.rotation.y = T * 0.006;
      stars.position.y = window.scrollY * 0.0009;

      // 타일
      const cx = tPos.x;
      const cy = tPos.y + 1.5 * Math.max(tPos.s, 0.6);
      const cz = -0.4;
      const kf = reduce ? 9 : 1;
      for (let j = 0; j < N; j++) {
        const cc = j % COLS;
        const rr = (j / COLS) | 0;
        const th = ph[j] * 6.2832 + T * sp[j];
        const rad = 3.6 + rd[j] * 3.8;
        const ox = cx + Math.cos(th) * rad;
        const oy = cy + (el[j] - 0.5) * 5.6 + Math.sin(T * 0.6 + ph[j] * 9) * 0.14 * idle;
        const oz = cz + Math.sin(th) * rad * 0.34 - 0.6;
        let gx: number;
        let gy: number;
        if (L.portrait) {
          gx = (rr - (ROWS - 1) / 2) * L.Pp + L.gridX;
          gy = ((COLS - 1) / 2 - cc) * L.Pp + L.gridY;
        } else {
          gx = (cc - (COLS - 1) / 2) * L.P + L.gridX;
          gy = ((ROWS - 1) / 2 - rr) * L.P + L.gridY;
        }
        const tw = j % 8;
        const lv = (j / 8) | 0;
        const show = lv < BH[tw];
        const bx = (tw - 3.5) * L.bs + L.barX;
        const by = L.barY + lv * L.bp;
        const tgx = wO * ox + wG * gx + wB * bx;
        const tgy = wO * oy + wG * gy + wB * by;
        const tgz = wO * oz;
        const rate = (2.0 + rt[j] * 3.4) * kf;
        const kk = 1 - Math.exp(-rate * dt);
        px[j] += (tgx - px[j]) * kk;
        py[j] += (tgy - py[j]) * kk;
        pz[j] += (tgz - pz[j]) * kk;
        const so = sc0[j];
        const tsx = wO * so + wG + wB * (show ? L.bsx : 0);
        const tsy = wO * so + wG + wB * (show ? L.bsy : 0);
        const tsz = wO * so + wG + wB * (show ? L.bsz : 0);
        const ks = 1 - Math.exp(-6 * kf * dt);
        sx[j] += (tsx - sx[j]) * ks;
        sy[j] += (tsy - sy[j]) * ks;
        sz[j] += (tsz - sz[j]) * ks;
        dummy.position.set(px[j], py[j], pz[j]);
        dummy.rotation.set(wO * (T * spx[j] + ph[j] * 6), wO * (T * spy[j] + rd[j] * 6), wO * (T * spz[j]));
        dummy.scale.set(Math.max(sx[j], 0.0001), Math.max(sy[j], 0.0001), Math.max(sz[j], 0.0001));
        dummy.updateMatrix();
        tiles.setMatrixAt(j, dummy.matrix);
      }
      tiles.instanceMatrix.needsUpdate = true;

      // 규칙 위반: 해당 칸이 빨갛게 깜빡임
      const wR = W[2];
      if (wR > 0.01) {
        const m = wR * (0.55 + 0.45 * Math.sin(T * 7));
        for (const v of VIO) {
          tmpC.copy(baseC[v]).lerp(RED, m);
          tiles.setColorAt(v, tmpC);
        }
        tiles.instanceColor!.needsUpdate = true;
        vioDirty = true;
      } else if (vioDirty) {
        for (const v of VIO) tiles.setColorAt(v, baseC[v]);
        tiles.instanceColor!.needsUpdate = true;
        vioDirty = false;
      }

      renderer.render(scene, camera);
      if (first) {
        first = false;
        setState("ready");
      }
    }
    raf = window.requestAnimationFrame(frame);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((m) => m.dispose());
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  if (state === "off") return null;
  return (
    <div
      ref={mountRef}
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-0 transition-opacity duration-[1400ms] ease-in-out motion-reduce:transition-none [&_canvas]:block [&_canvas]:size-full ${
        state === "ready" ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
