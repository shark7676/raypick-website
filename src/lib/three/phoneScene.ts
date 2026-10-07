import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Light "studio" with 3D phones showing real app screens.
 * The active phone comes to the front and cycles through its screens.
 */

export interface PhoneApp {
  screens: string[];
  frame: string;
}

interface Phone {
  group: THREE.Group;
  a: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
  b: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
  textures: THREE.Texture[];
  idx: number;
  phase: number;
  shadow: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
  slot: { x: number; y: number; z: number; ry: number; s: number };
}

const SW = 0.92, SH = 1.84, BW = 1.0, BH = 1.94, DEPTH = 0.07;
const SLOTS = [
  { x: 0, y: 0.12, z: 0.35, ry: -0.06, s: 1 }, // front
  { x: 1.38, y: -0.14, z: -0.6, ry: -0.42, s: 0.84 }, // right
  { x: -1.38, y: -0.1, z: -0.6, ry: 0.42, s: 0.84 }, // left
];

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** flat rounded rectangle with 0..1 UVs */
function roundedPlane(w: number, h: number, r: number) {
  const g = new THREE.ShapeGeometry(roundedRect(w, h, r), 24);
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + 0.5, p.getY(i) / h + 0.5);
  return g;
}

function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class PhoneScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  private rig = new THREE.Group();
  private phones: Phone[] = [];
  private active = 0;
  private spin = 0; // 1 -> 0 after switching app
  private running = true;
  private raf = 0;
  private t0 = performance.now();
  private last = performance.now();
  private ptr = { x: 0, y: 0 };
  private sm = { x: 0, y: 0 };
  private reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  private layout = { x: 0, y: 0, s: 1 };
  private tmp = new THREE.Vector3();

  /** mode "single": one phone filling its own box (app pages) */
  constructor(private canvas: HTMLCanvasElement, apps: PhoneApp[], private mode: "stage" | "single" = "stage") {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.camera.position.set(0, 0.3, 11);
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.02).texture;
    pmrem.dispose();
    this.scene.add(new THREE.HemisphereLight("#ffffff", "#c3cde0", 1.2));
    const key = new THREE.DirectionalLight("#ffffff", 2);
    key.position.set(4, 6, 6);
    this.scene.add(key, this.rig);

    const loader = new THREE.TextureLoader();
    const bodyGeo = new THREE.ExtrudeGeometry(roundedRect(BW, BH, 0.17), { depth: DEPTH, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.022, bevelSegments: 6, curveSegments: 28 });
    bodyGeo.translate(0, 0, -DEPTH / 2);
    const screenGeo = roundedPlane(SW, SH, 0.13);
    const islandGeo = roundedPlane(0.26, 0.075, 0.0375);
    const glare = canvasTexture(256, 512, (g) => {
      const gr = g.createLinearGradient(0, 0, 256, 512);
      gr.addColorStop(0, "rgba(255,255,255,.22)");
      gr.addColorStop(0.35, "rgba(255,255,255,.05)");
      gr.addColorStop(0.36, "rgba(255,255,255,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, 256, 512);
    });
    const shadowTex = canvasTexture(256, 256, (g) => {
      const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
      gr.addColorStop(0, "rgba(15,25,60,.5)");
      gr.addColorStop(0.5, "rgba(15,25,60,.16)");
      gr.addColorStop(1, "rgba(15,25,60,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, 256, 256);
    });
    const glass = new THREE.MeshPhysicalMaterial({ color: "#05070c", metalness: 0.2, roughness: 0.12, clearcoat: 1 });
    const z = DEPTH / 2 + 0.026;

    apps.forEach((app, i) => {
      const group = new THREE.Group();
      const frame = new THREE.MeshPhysicalMaterial({ color: app.frame, metalness: 1, roughness: 0.28, clearcoat: 0.4 });
      group.add(new THREE.Mesh(bodyGeo, [glass, frame]));
      const textures = app.screens.map((src) => {
        const t = loader.load(src);
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 8;
        return t;
      });
      const a = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ map: textures[0], toneMapped: false }));
      const b = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ map: textures[1 % textures.length], toneMapped: false, transparent: true, opacity: 0 }));
      a.position.z = z;
      b.position.z = z + 0.001;
      const island = new THREE.Mesh(islandGeo, new THREE.MeshBasicMaterial({ color: "#000" }));
      island.position.set(0, SH / 2 - 0.085, z + 0.002);
      const shine = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ map: glare, transparent: true, depthWrite: false }));
      shine.position.z = z + 0.003;
      group.add(a, b, island, shine);
      this.rig.add(group);
      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
      shadow.rotation.x = -Math.PI / 2;
      this.scene.add(shadow);
      const slot = { ...SLOTS[(i - this.active + apps.length) % apps.length] };
      this.phones.push({ group, a, b, textures, idx: 0, phase: 0, shadow, slot });
    });

    this.resize();
    window.addEventListener("resize", this.resize);
    window.addEventListener("pointermove", this.onMove, { passive: true });
    this.raf = requestAnimationFrame(this.frame);
  }

  setActive(i: number) {
    if (i === this.active) return;
    this.active = i;
    this.spin = this.reduce ? 0 : 1;
    const front = this.phones[i];
    front.idx = 0;
    front.a.material.map = front.textures[0];
    front.b.material.opacity = 0;
  }

  setRunning(on: boolean) {
    if (on === this.running) return;
    this.running = on;
    if (on) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    } else cancelAnimationFrame(this.raf);
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("pointermove", this.onMove);
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      mats.forEach((mat) => mat.dispose());
    });
    this.phones.forEach((p) => p.textures.forEach((t) => t.dispose()));
    this.renderer.dispose();
  }

  private resize = () => {
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, w < 760 ? 1.5 : 2));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.mode === "single") this.layout = { x: 0, y: 0.2, s: 1.85 };
    // phones sit in the upper half on narrow screens (text overlays the lower half)
    else this.layout = w / h < 0.8 ? { x: 0, y: 1.4, s: 0.6 } : { x: 0, y: 0.05, s: Math.min(1.25, 0.95 * (w / h) + 0.25) };
  };

  private onMove = (e: PointerEvent) => {
    this.ptr.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.ptr.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  private frame = (now: number) => {
    const t = (now - this.t0) / 1000;
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    const idle = this.reduce ? 0 : 1;
    this.sm.x += (this.ptr.x - this.sm.x) * 0.05;
    this.sm.y += (this.ptr.y - this.sm.y) * 0.05;
    this.spin = Math.max(0, this.spin - dt * 1.4);

    this.rig.position.set(this.layout.x, this.layout.y, 0);
    this.rig.scale.setScalar(this.layout.s);
    this.rig.rotation.y = this.sm.x * 0.22 * idle + Math.sin(t * 0.35) * 0.04 * idle;
    this.rig.rotation.x = this.sm.y * 0.1 * idle;
    this.rig.updateMatrixWorld();

    const n = this.phones.length;
    const k = Math.min(1, dt * 5);
    this.phones.forEach((p, i) => {
      const target = SLOTS[(i - this.active + n) % n];
      p.slot.x += (target.x - p.slot.x) * k;
      p.slot.y += (target.y - p.slot.y) * k;
      p.slot.z += (target.z - p.slot.z) * k;
      p.slot.ry += (target.ry - p.slot.ry) * k;
      p.slot.s += (target.s - p.slot.s) * k;
      const front = i === this.active;
      const bob = Math.sin(t * 0.9 + i * 1.9) * 0.06 * idle;
      // the phone that just came to the front makes one turn
      const turn = front ? this.spin * this.spin * (3 - 2 * this.spin) * Math.PI * 2 : 0;
      p.group.position.set(p.slot.x, p.slot.y + bob, p.slot.z);
      p.group.rotation.set(-0.04, p.slot.ry + turn, 0);
      p.group.scale.setScalar(p.slot.s);

      // cycle screens on the front phone
      if (front && p.textures.length > 1 && !this.reduce) {
        const cyc = t / 3.2, ci = Math.floor(cyc);
        const f = THREE.MathUtils.smoothstep(cyc - ci, 0.82, 1);
        if (ci !== p.phase) {
          p.phase = ci;
          p.idx = (p.idx + 1) % p.textures.length;
          p.a.material.map = p.textures[p.idx];
        }
        p.b.material.map = p.textures[(p.idx + 1) % p.textures.length];
        p.b.material.opacity = f;
      } else p.b.material.opacity = 0;

      // soft contact shadow on the floor
      this.tmp.set(p.slot.x, -1.35, p.slot.z).applyMatrix4(this.rig.matrixWorld);
      p.shadow.position.copy(this.tmp);
      const s = this.layout.s * p.slot.s;
      p.shadow.scale.set(1.75 * s, 0.5 * s, 1);
      p.shadow.material.opacity = 0.85 - bob * 2;
    });

    this.camera.lookAt(0, 0, 0);
    this.renderer.render(this.scene, this.camera);
    if (this.running) this.raf = requestAnimationFrame(this.frame);
  };
}
