import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { LOGO_R, LOGO_TRIANGLE, LOGO_TRIANGLE_CENTER } from "./logoPaths";

/**
 * Home hero: the 3D Raypick logo (scene A) that, as the visitor scrolls,
 * moves to the center and releases the apps into an orbit (scene B).
 * Scroll progress 0..1 comes from the page via setProgress().
 */

export interface OrbitApp {
  slug: string;
  color: string;
  icon: string;
  soon: boolean;
}
export interface OrbitLabel {
  name: string;
  note: string;
}

interface Tile {
  app: OrbitApp;
  group: THREE.Group;
  mesh: THREE.Mesh;
  glow: THREE.Mesh;
  frameMat: THREE.MeshBasicMaterial;
  sheenMat: THREE.ShaderMaterial;
  label: HTMLDivElement;
  hover: number;
}

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 4);
const easeOutBack = (t: number) => {
  const x = clamp01(t) - 1;
  return 1 + 2.4 * x * x * x + 1.4 * x * x;
};

const LOGO_SCALE = 0.0128;

function radialTexture(stops: [number, string][]) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  stops.forEach(([o, col]) => gr.addColorStop(o, col));
  g.fillStyle = gr;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** flat rounded rectangle with 0..1 UVs */
function roundedPlane(w: number, h: number, r: number) {
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
  const g = new THREE.ShapeGeometry(s, 16), p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + 0.5, p.getY(i) / h + 0.5);
  return g;
}

const additive = (map: THREE.Texture, opacity = 1) =>
  new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity });

const shapesFrom = (d: string) =>
  new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`).paths.flatMap((p) => p.toShapes());

export class HeroScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  /** tiles in front of the logo are drawn here, after the glow, so they stay sharp */
  private front = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  private composer: EffectComposer;
  private bloom: UnrealBloomPass;

  private rig = new THREE.Group();
  private logo = new THREE.Group();
  private triMat: THREE.MeshPhysicalMaterial;
  private triLight: THREE.PointLight;
  private halo: THREE.Mesh;
  private rays: THREE.Mesh;
  private raysMat: THREE.ShaderMaterial;
  private particlesMat: THREE.ShaderMaterial;
  private ringGroup = new THREE.Group();
  private orbitMat: THREE.ShaderMaterial;
  private orbit: THREE.Points;
  private tiles: Tile[] = [];

  private reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  private small = false;
  private layoutA = { pos: new THREE.Vector3(), scale: 1 };
  private layoutB = { centerY: 1.1, scale: 0.66, radius: 4.7, camZ: 17, lookOff: 1.25, tile: 1, tilt: 0.26, base: 0.82, gain: 0.28 };

  private target = 0;
  private progress = 0;
  private ptr = { x: 0, y: 0 };
  private sm = { x: 0, y: 0 };
  private ndc = new THREE.Vector2(9, 9);
  private raycaster = new THREE.Raycaster();
  private angle = -Math.PI / 2 - 0.35;
  private vel = 0;
  private spinDir = 1; // keeps turning the way the visitor last spun it
  private dragging = false;
  private lastX = 0;
  private downAt = { x: 0, y: 0 };
  private hovered = -1;

  private t0 = performance.now();
  private last = performance.now();
  private raf = 0;
  private active = true;
  private started = false;
  private tmp = new THREE.Vector3();
  private look = new THREE.Vector3();
  private triLocal = new THREE.Vector3(LOGO_TRIANGLE_CENTER.x, LOGO_TRIANGLE_CENTER.y, 20);

  constructor(
    private canvas: HTMLCanvasElement,
    private labelsEl: HTMLElement,
    apps: OrbitApp[],
    private onTile: (slug: string) => void,
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.scene.background = new THREE.Color("#03050b");
    this.camera.position.set(0, 0, 20);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.32;
    pmrem.dispose();

    // ---- logo
    this.scene.add(this.rig);
    this.rig.add(this.logo);
    this.logo.scale.setScalar(LOGO_SCALE);
    const rGeo = new THREE.ExtrudeGeometry(shapesFrom(LOGO_R), { depth: 44, bevelEnabled: true, bevelThickness: 10, bevelSize: 6.5, bevelSegments: 10, curveSegments: 72 });
    rGeo.translate(0, 0, -22);
    this.logo.add(new THREE.Mesh(rGeo, new THREE.MeshPhysicalMaterial({ color: "#1a2b52", metalness: 0.92, roughness: 0.36, clearcoat: 0.7, clearcoatRoughness: 0.28 })));
    const tGeo = new THREE.ExtrudeGeometry(shapesFrom(LOGO_TRIANGLE), { depth: 34, bevelEnabled: true, bevelThickness: 16, bevelSize: 10, bevelSegments: 14, curveSegments: 48 });
    tGeo.translate(0, 0, -12);
    this.triMat = new THREE.MeshPhysicalMaterial({
      color: "#5d97ff", roughness: 0.08, transmission: 0.7, thickness: 70, ior: 1.5,
      attenuationColor: new THREE.Color("#1d5cff"), attenuationDistance: 1.2,
      emissive: new THREE.Color("#1f5cff"), emissiveIntensity: 0, clearcoat: 1, clearcoatRoughness: 0.05,
      iridescence: 0.35, iridescenceIOR: 1.3,
    });
    this.logo.add(new THREE.Mesh(tGeo, this.triMat));

    const triPos = new THREE.Vector3(LOGO_TRIANGLE_CENTER.x * LOGO_SCALE, LOGO_TRIANGLE_CENTER.y * LOGO_SCALE, 0);
    this.triLight = new THREE.PointLight("#3f7dff", 0, 9, 1.6);
    this.triLight.position.copy(triPos).setZ(0.9);
    this.rig.add(this.triLight);
    this.halo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), additive(radialTexture([[0, "rgba(110,170,255,1)"], [0.25, "rgba(50,110,255,.45)"], [1, "rgba(0,20,80,0)"]]), 0));
    this.halo.scale.setScalar(6);
    this.halo.position.copy(triPos).setZ(-1.2);
    this.rig.add(this.halo);

    // ---- god rays (one shader plane)
    this.raysMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uIntensity: { value: 0 }, uColor: { value: new THREE.Color("#2a5fe6") } },
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: `
        varying vec2 vUv; uniform float uTime; uniform float uIntensity; uniform vec3 uColor;
        float h(float n){ return fract(sin(n)*43758.5453); }
        float pn(float x, float K){ float i=floor(x), f=fract(x); return mix(h(mod(i,K)), h(mod(i+1.0,K)), smoothstep(0.,1.,f)); }
        void main(){
          vec2 p = vUv*2.0-1.0; float r = length(p); float a = atan(p.y,p.x)/6.2831853+0.5;
          float rays = pow(pn(a*18.0 + uTime*0.05, 18.0), 9.0)
                     + 0.8*pow(pn(a*41.0 - uTime*0.08 + 7.0, 41.0), 14.0)
                     + 0.6*pow(pn(a*97.0 + uTime*0.03 + 3.0, 97.0), 22.0);
          float fall = pow(smoothstep(1.0, 0.0, r), 2.2) * smoothstep(0.02, 0.16, r);
          float core = exp(-r*r*70.0);
          gl_FragColor = vec4(uColor * (rays*fall*0.75 + core*0.9) * uIntensity, 1.0);
        }`,
    });
    this.rays = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.raysMat);
    this.rays.scale.setScalar(26);
    this.rays.position.copy(triPos).setZ(-3);
    this.rig.add(this.rays);

    // ---- particles
    const N = window.innerWidth < 760 ? 700 : 1800;
    const pos = new Float32Array(N * 3);
    const seed = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 34;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = -12 + Math.random() * 16;
      seed[i] = Math.random();
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    this.particlesMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPR: { value: 1 }, uAlpha: { value: 0 } },
      vertexShader: `
        attribute float aSeed; uniform float uTime; uniform float uPR; varying float vA;
        void main(){
          vec3 p = position;
          p.y = mod(p.y + uTime*0.12*(0.3+aSeed) + 10.0, 20.0) - 10.0;
          p.x += sin(uTime*0.25 + aSeed*30.0)*0.25;
          vec4 mv = modelViewMatrix * vec4(p,1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (0.8 + aSeed*2.4) * uPR * (14.0 / -mv.z);
          vA = (0.25 + 0.75*(0.5+0.5*sin(uTime*1.3 + aSeed*60.0))) * (0.3 + aSeed*0.7);
        }`,
      fragmentShader: `
        varying float vA; uniform float uAlpha;
        void main(){ float d = length(gl_PointCoord-0.5); gl_FragColor = vec4(vec3(0.62,0.8,1.0)*smoothstep(0.5,0.0,d)*vA*uAlpha, 1.0); }`,
    });
    this.scene.add(new THREE.Points(pGeo, this.particlesMat));

    // ---- orbit: a ring of fine light dots with three comet streaks flowing the way the apps turn
    this.ringGroup.rotation.x = Math.PI / 2 + this.layoutB.tilt;
    this.scene.add(this.ringGroup);
    const M = window.innerWidth < 760 ? 420 : 760;
    const ang = new Float32Array(M);
    const opos = new Float32Array(M * 3);
    for (let i = 0; i < M; i++) {
      const a = (i / M) * Math.PI * 2 + (Math.random() - 0.5) * 0.004;
      ang[i] = a;
      opos[i * 3] = Math.cos(a);
      opos[i * 3 + 1] = Math.sin(a);
    }
    const oGeo = new THREE.BufferGeometry();
    oGeo.setAttribute("position", new THREE.BufferAttribute(opos, 3));
    oGeo.setAttribute("aAngle", new THREE.BufferAttribute(ang, 1));
    this.orbitMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uAngle: { value: 0 }, uDir: { value: 1 }, uOpacity: { value: 0 }, uPR: { value: 1 } },
      vertexShader: `
        attribute float aAngle; uniform float uTime; uniform float uAngle; uniform float uDir; uniform float uPR;
        varying float vStreak; varying float vFront;
        void main(){
          float x = (aAngle - uAngle) / 6.2831853 * 3.0;
          float s = fract(uDir * x - uTime * 0.12);
          vStreak = pow(s, 7.0);
          vFront = 0.5 + 0.5 * sin(aAngle);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (1.6 + vStreak * 3.2) * uPR * (16.0 / -mv.z);
        }`,
      fragmentShader: `
        uniform float uOpacity; varying float vStreak; varying float vFront;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d) * (0.32 + vStreak * 1.1) * mix(0.25, 1.0, vFront) * uOpacity;
          vec3 col = mix(vec3(0.36, 0.62, 1.0), vec3(0.92, 0.97, 1.0), vStreak);
          gl_FragColor = vec4(col * a, 1.0);
        }`,
    });
    this.orbit = new THREE.Points(oGeo, this.orbitMat);
    this.ringGroup.add(this.orbit);

    // ---- app tiles
    const loader = new THREE.TextureLoader();
    const tileGeo = new RoundedBoxGeometry(1.3, 1.3, 0.24, 5, 0.26);
    const frameGeo = roundedPlane(1.44, 1.44, 0.33);
    const faceGeo = roundedPlane(1.3, 1.3, 0.26);
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
    apps.forEach((app, i) => {
      const side = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(app.color).multiplyScalar(0.4), metalness: 0.6, roughness: 0.3, clearcoat: 0.8, envMapIntensity: 0.5 });
      // the icon is self-lit so it keeps its true colors at any angle (no washed-out highlights)
      const face = new THREE.MeshPhysicalMaterial({ color: "#000000", emissive: "#ffffff", emissiveIntensity: 0, roughness: 0.35, clearcoat: 0.45, clearcoatRoughness: 0.12, envMapIntensity: 0.2 });
      loader.load(app.icon, (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = maxAniso;
        face.emissiveMap = t;
        face.emissiveIntensity = 1.12;
        face.needsUpdate = true;
      });
      const mesh = new THREE.Mesh(tileGeo, [side, side, side, side, face, side]);
      mesh.userData.i = i;
      // neon edge in the app's color, shown when the tile comes to the front
      const frameMat = new THREE.MeshBasicMaterial({ color: app.color, transparent: true, opacity: 0, depthWrite: false });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      frame.position.z = -0.135;
      // a streak of light gliding across the glass face
      const sheenMat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: { uPos: { value: -1 }, uA: { value: 0 } },
        vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
        fragmentShader: "varying vec2 vUv; uniform float uPos; uniform float uA; void main(){ float d = vUv.x*0.8 + vUv.y*0.6; float b = smoothstep(0.09, 0.0, abs(d - uPos)) + 0.35*smoothstep(0.22, 0.0, abs(d - uPos - 0.12)); gl_FragColor = vec4(vec3(b*uA), 1.0); }",
      });
      const sheen = new THREE.Mesh(faceGeo, sheenMat);
      sheen.position.z = 0.126;
      mesh.add(frame, sheen);
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), additive(radialTexture([[0, app.color], [0.35, app.color + "55"], [1, app.color + "00"]]), 0));
      glow.scale.setScalar(2.6);
      const group = new THREE.Group();
      group.add(glow, mesh);
      group.visible = false;
      this.scene.add(group);
      const label = document.createElement("div");
      label.className = "orbit-label";
      label.dataset.soon = String(app.soon);
      label.style.setProperty("--c", app.color);
      label.innerHTML = "<b></b><span></span>";
      this.labelsEl.appendChild(label);
      this.tiles.push({ app, group, mesh, glow, frameMat, sheenMat, label, hover: 0 });
    });

    // ---- lights
    const key = new THREE.DirectionalLight("#ffffff", 1.3);
    key.position.set(-4, 7, 9);
    const rim = new THREE.DirectionalLight("#4d8dff", 2.6);
    rim.position.set(6, 2, -6);
    const under = new THREE.DirectionalLight("#1a3cff", 0.5);
    under.position.set(0, -6, 3);
    this.scene.add(key, rim, under);
    this.front.environment = this.scene.environment;
    this.front.environmentIntensity = this.scene.environmentIntensity;
    this.front.add(key.clone(), rim.clone());

    // ---- post
    // multisampled target: without it the thin edge highlights alias into crawling dotted lines
    const samples = Math.min(window.innerWidth < 760 ? 4 : 8, this.renderer.capabilities.maxSamples);
    const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples });
    this.composer = new EffectComposer(this.renderer, target);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.75, 0.6, 0.72);
    this.composer.addPass(this.bloom);
    const frontPass = new RenderPass(this.front, this.camera);
    frontPass.clear = false; // keep the glowing scene underneath
    frontPass.clearDepth = true; // front tiles are drawn on top
    this.composer.addPass(frontPass);
    this.composer.addPass(new OutputPass());

    this.resize();
    window.addEventListener("resize", this.resize);
    window.addEventListener("pointermove", this.onMove, { passive: true });
    window.addEventListener("pointerup", this.onUp);
    canvas.addEventListener("pointerdown", this.onDown);
    // compile shaders without freezing the page (parallel compile where the GPU supports it)
    this.renderer
      .compileAsync(this.scene, this.camera)
      .catch(() => {})
      .then(() => {
        this.started = true;
        this.t0 = this.last = performance.now();
        if (this.active) this.raf = requestAnimationFrame(this.frame);
      });
  }

  setProgress(p: number) {
    this.target = clamp01(p);
  }

  setLabels(items: OrbitLabel[]) {
    this.tiles.forEach((t, i) => {
      const it = items[i];
      if (!it) return;
      t.label.querySelector("b")!.textContent = it.name;
      t.label.querySelector("span")!.textContent = it.note;
    });
  }

  /** Stop drawing while the hero is off screen */
  setActive(on: boolean) {
    if (on === this.active) return;
    this.active = on;
    if (!this.started) return;
    if (on) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    } else cancelAnimationFrame(this.raf);
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("pointermove", this.onMove);
    window.removeEventListener("pointerup", this.onUp);
    this.canvas.removeEventListener("pointerdown", this.onDown);
    this.tiles.forEach((t) => t.label.remove());
    [this.scene, this.front].forEach((sc) => sc.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      mats.forEach((mat) => {
        const map = (mat as THREE.MeshBasicMaterial).map;
        if (map) map.dispose();
        mat.dispose();
      });
    }));
    this.composer.dispose();
    this.renderer.dispose();
  }

  private resize = () => {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.small = w < 760;
    const pr = Math.min(window.devicePixelRatio, this.small ? 1.5 : 1.75);
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(w, h, false);
    this.composer.setPixelRatio(pr);
    this.composer.setSize(w, h);
    this.particlesMat.uniforms.uPR.value = pr;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    const aspect = w / h;
    if (aspect > 1.1) {
      this.layoutA.pos.set(Math.min(4.2, 2.5 * aspect - 0.35), 0.2, 0);
      this.layoutA.scale = 1;
    } else {
      // portrait: a big logo in the upper half, text below
      this.layoutA.pos.set(0, 1.85, 0);
      this.layoutA.scale = this.small ? 0.54 : 0.5;
    }
    // phones: bigger tiles on a steeper orbit so front and back don't pile up
    this.layoutB = this.small
      ? { centerY: 1.7, scale: 0.5, radius: 1.75, camZ: 17.5, lookOff: 2.3, tile: 0.55, tilt: 0.45, base: 0.72, gain: 0.5 }
      : { centerY: 1.1, scale: 0.66 * Math.min(1, aspect), radius: Math.min(4.7, 2.9 * aspect), camZ: 17, lookOff: 1.25, tile: Math.min(1, (2.9 * aspect) / 4.3), tilt: 0.26, base: 0.82, gain: 0.28 };
    this.ringGroup.rotation.x = Math.PI / 2 + this.layoutB.tilt;
    this.bloom.strength = this.small ? 0.5 : 0.75;
    this.orbit.scale.setScalar(this.layoutB.radius);
    this.orbitMat.uniforms.uPR.value = pr;
    this.ringGroup.position.y = this.layoutB.centerY;
  };

  private onMove = (e: PointerEvent) => {
    const r = this.canvas.getBoundingClientRect();
    this.ptr.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    this.ptr.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    this.ndc.set(this.ptr.x, -this.ptr.y);
    if (this.dragging) {
      const dx = e.clientX - this.lastX;
      this.lastX = e.clientX;
      // front tiles follow the pointer: dragging right moves them right
      this.angle -= dx * 0.006;
      this.vel = -dx * 0.006 * 60;
    }
  };

  private onDown = (e: PointerEvent) => {
    if (this.progress < 0.42) return;
    this.dragging = true;
    this.lastX = e.clientX;
    this.downAt = { x: e.clientX, y: e.clientY };
    this.canvas.classList.add("dragging");
  };

  private onUp = (e: PointerEvent) => {
    if (!this.dragging) return;
    this.dragging = false;
    this.canvas.classList.remove("dragging");
    if (Math.abs(this.vel) > 0.05) this.spinDir = Math.sign(this.vel);
    const moved = Math.hypot(e.clientX - this.downAt.x, e.clientY - this.downAt.y);
    if (moved < 6 && this.hovered >= 0) this.onTile(this.tiles[this.hovered].app.slug);
  };

  private frame = (now: number) => {
    const t = (now - this.t0) / 1000;
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    this.progress += (this.target - this.progress) * Math.min(1, dt * 7);
    const p = this.progress;
    const idle = this.reduce ? 0 : 1;

    const intro = this.reduce ? 1 : easeOut(t / 2.6);
    const ign = this.reduce ? 1 : clamp01((t - 0.35) / 1.4);
    const flash = ign < 1 ? Math.sin(ign * Math.PI) * 1.8 : 0;
    const morph = smooth(0.18, 0.5, p);
    const orbitOn = smooth(0.34, 0.52, p);
    const labelsOn = smooth(0.42, 0.55, p) * (1 - smooth(0.86, 0.93, p));
    const A = this.layoutA, B = this.layoutB;

    this.sm.x += (this.ptr.x - this.sm.x) * 0.05;
    this.sm.y += (this.ptr.y - this.sm.y) * 0.05;

    // logo: right side (A) -> center (B)
    this.rig.position.set(
      lerp(A.pos.x, 0, morph),
      lerp(A.pos.y, B.centerY, morph) + Math.sin(t * 0.6) * 0.06 * idle,
      0,
    );
    this.rig.scale.setScalar(lerp(A.scale * (0.86 + 0.14 * intro), B.scale, morph));
    this.logo.rotation.y = -0.7 * (1 - intro) + this.sm.x * 0.4 + Math.sin(t * 0.45) * 0.1 * idle;
    this.logo.rotation.x = this.sm.y * 0.2 + Math.sin(t * 0.33) * 0.04 * idle;

    this.triMat.emissiveIntensity = ign * 0.55 + flash * 0.9 + Math.sin(t * 1.7) * 0.05 * idle;
    this.triLight.intensity = ign * 12 + flash * 14;
    (this.halo.material as THREE.MeshBasicMaterial).opacity = (ign * 0.32 + flash * 0.3) * (this.small ? 0.6 : 1);
    this.raysMat.uniforms.uIntensity.value = (ign * 0.42 + flash * 0.5) * lerp(1, 0.4, morph) * (this.small ? 0.35 : 1);
    this.raysMat.uniforms.uTime.value = t;
    this.particlesMat.uniforms.uTime.value = t;
    this.particlesMat.uniforms.uAlpha.value = intro;

    // camera
    const cam = this.camera.position;
    cam.set(
      lerp(this.sm.x * 0.6, this.sm.x * 0.8, morph),
      lerp(-this.sm.y * 0.35, 1.2 - this.sm.y * 0.5, morph),
      lerp(20 - 6 * intro, B.camZ, morph),
    );
    this.look.set(0, lerp(0, B.centerY - B.lookOff, morph), 0);
    this.camera.lookAt(this.look);

    // orbit
    this.orbitMat.uniforms.uOpacity.value = orbitOn;
    this.orbitMat.uniforms.uTime.value = t;
    this.orbitMat.uniforms.uAngle.value = this.angle + p * 1.2;
    this.orbitMat.uniforms.uDir.value = this.spinDir;
    if (!this.dragging) {
      const auto = this.reduce ? 0 : 0.11 * this.spinDir;
      this.vel += (auto - this.vel) * Math.min(dt * 1.6, 1);
      this.angle += this.vel * dt;
    }

    if (orbitOn > 0.5 && this.active) {
      this.raycaster.setFromCamera(this.ndc, this.camera);
      const hit = this.raycaster.intersectObjects(this.tiles.map((o) => o.mesh))[0];
      this.hovered = hit ? (hit.object.userData.i as number) : -1;
    } else this.hovered = -1;
    this.canvas.classList.toggle("hovering", this.hovered >= 0 && !this.dragging);

    const triWorld = this.logo.localToWorld(this.tmp.copy(this.triLocal)).clone();
    const R = B.radius;
    const n = this.tiles.length;
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    this.tiles.forEach((o, i) => {
      const k = this.reduce ? orbitOn : easeOutBack((p - (0.26 + i * 0.035)) / 0.2);
      o.group.visible = k > 0.001;
      o.label.style.opacity = "0";
      if (!o.group.visible) return;
      const th = this.angle + p * 1.2 + (i * Math.PI * 2) / n;
      const ox = R * Math.cos(th);
      const oy = B.centerY - R * Math.sin(th) * Math.sin(B.tilt) + Math.sin(t * 1.1 + i * 1.7) * 0.08 * idle;
      const oz = R * Math.sin(th) * Math.cos(B.tilt);
      const f = Math.min(k, 1);
      o.group.position.set(lerp(triWorld.x, ox, f), lerp(triWorld.y, oy, f), lerp(triWorld.z, oz, f));
      o.hover += ((this.hovered === i ? 1 : 0) - o.hover) * 0.12;
      const depth = (Math.sin(th) + 1) / 2;
      const focus = smooth(0.74, 1, depth); // 1 = right at the front center
      const s = (B.base + depth * B.gain + o.hover * 0.22 + focus * 0.08) * k * B.tile;
      o.group.scale.setScalar(Math.max(s, 0.001));
      o.group.lookAt(this.camera.position);
      // in front of the logo: draw after the glow so the icon stays crisp
      const layer = o.group.position.z > 0.3 ? this.front : this.scene;
      if (o.group.parent !== layer) layer.add(o.group);
      // settle square to the camera as it reaches the front
      const calm = 1 - 0.85 * focus;
      o.mesh.rotation.set(
        (Math.sin(t * 0.8 + i) * 0.12 * idle - this.sm.y * 0.2) * calm,
        (Math.cos(t * 0.7 + i) * 0.15 * idle + this.sm.x * 0.3) * calm,
        0,
      );
      (o.glow.material as THREE.MeshBasicMaterial).opacity = (0.1 + depth * 0.16 + o.hover * 0.3) * (o.app.soon ? 0.7 : 1) * f * (1 - 0.65 * focus);
      o.frameMat.opacity = Math.min(1, focus * 0.9 + o.hover * 0.6) * f;
      o.sheenMat.uniforms.uA.value = 0.3 * Math.max(focus, o.hover) * f;
      o.sheenMat.uniforms.uPos.value = ((t * 0.45 + i * 0.37) % 1.6) * 1.25 - 0.25;

      if (labelsOn > 0.01) {
        this.tmp.copy(o.group.position);
        this.tmp.y -= 0.95 * s;
        this.tmp.project(this.camera);
        const x = Math.min(Math.max((this.tmp.x * 0.5 + 0.5) * w, 70), w - 70); // keep labels on screen
        const y = (-this.tmp.y * 0.5 + 0.5) * h;
        o.label.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,0) scale(${(0.86 + depth * 0.14 + focus * 0.08 + o.hover * 0.1).toFixed(3)})`;
        o.label.style.opacity = ((smooth(0.3, 0.8, depth) + o.hover * 0.4) * labelsOn).toFixed(3);
        o.label.style.setProperty("--f", focus.toFixed(3));
        o.label.style.zIndex = String(Math.round(depth * 100));
      }
    });

    this.composer.render();
    if (this.active) this.raf = requestAnimationFrame(this.frame);
  };
}
