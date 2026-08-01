import * as THREE from 'three';

export type PlanetPolishQuality = 'low' | 'auto' | 'high';

interface OverlayProfile {
  id: string;
  scale: number;
  opacity: number;
  driftPerDay: number;
}

interface OverlayLayer {
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
  profile: OverlayProfile;
}

const TAU = Math.PI * 2;

// The previous runtime-generated overlay shells produced moire/z-fighting at
// focus distances and duplicated detail already present in the shipped maps.
// Keep the atmosphere pass, but bind only build-time planet textures.
const OVERLAY_PROFILES: OverlayProfile[] = [];

const ATMOSPHERE_SCALES: Record<string, number> = {
  venus: 1.09,
  earth: 1.105,
  mars: 1.075,
  jupiter: 1.062,
  saturn: 1.058,
  uranus: 1.085,
  neptune: 1.09,
};

const ATMOSPHERE_STRENGTHS: Record<string, number> = {
  venus: 0.78,
  earth: 0.86,
  mars: 0.48,
  jupiter: 0.43,
  saturn: 0.36,
  uranus: 0.5,
  neptune: 0.62,
};

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function hashSeed(text: string): number {
  let seed = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    seed ^= text.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }
  return seed >>> 0;
}

function waveNoise(u: number, v: number, seed: number): number {
  const phase = (seed % 997) / 997;
  const a = Math.sin((u * 3 + phase) * TAU + Math.sin(v * TAU * 2.1) * 1.7);
  const b = Math.sin((u * 8 - phase * 2) * TAU + v * TAU * 5.3) * 0.5;
  const c = Math.cos((u * 17 + phase * 4) * TAU - v * TAU * 11.7) * 0.25;
  return (a + b + c) / 1.75;
}

function overlayTexture(id: string, anisotropy: number): THREE.CanvasTexture {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas 2D is unavailable for planet polish overlays.');
  const image = context.createImageData(width, height);
  const seed = hashSeed(`${id}-polish`);

  for (let y = 0; y < height; y += 1) {
    const v = y / Math.max(1, height - 1);
    for (let x = 0; x < width; x += 1) {
      const u = x / Math.max(1, width - 1);
      const noise = waveNoise(u, v, seed);
      const offset = (y * width + x) * 4;
      let red = 255;
      let green = 255;
      let blue = 255;
      let alpha = 0;

      if (id === 'jupiter') {
        const broad = Math.sin((v * 31 + noise * 0.09) * Math.PI);
        const fine = Math.sin((v * 77 - noise * 0.12) * Math.PI);
        const warm = broad > 0 ? broad : 0;
        red = 226 + warm * 25;
        green = 181 + warm * 22;
        blue = 139 + warm * 14;
        alpha = 14 + Math.abs(broad) * 22 + Math.abs(fine) * 9;
      } else if (id === 'saturn') {
        const band = Math.sin((v * 58 + noise * 0.035) * Math.PI);
        red = 238;
        green = 216;
        blue = 165;
        alpha = 8 + Math.abs(band) * 17;
      } else if (id === 'venus') {
        const swirl = Math.sin((v * 24 + noise * 0.8 + u * 1.5) * Math.PI);
        red = 255;
        green = 229;
        blue = 165;
        alpha = 12 + Math.max(0, swirl) * 34 + Math.max(0, noise) * 16;
      } else if (id === 'uranus') {
        const band = Math.sin((v * 27 + noise * 0.03) * Math.PI);
        red = 210;
        green = 247;
        blue = 244;
        alpha = 5 + Math.max(0, band) * 14;
      } else if (id === 'neptune') {
        const band = Math.sin((v * 36 + noise * 0.12) * Math.PI);
        red = band > 0 ? 125 : 15;
        green = band > 0 ? 177 : 42;
        blue = band > 0 ? 255 : 124;
        alpha = 8 + Math.abs(band) * 18 + Math.max(0, noise) * 10;
      }

      image.data[offset] = clampByte(red);
      image.data[offset + 1] = clampByte(green);
      image.data[offset + 2] = clampByte(blue);
      image.data[offset + 3] = clampByte(alpha);
    }
  }
  context.putImageData(image, 0, 0);

  if (id === 'jupiter') {
    context.save();
    context.translate(width * 0.72, height * 0.625);
    context.rotate(-0.07);
    context.scale(1.8, 0.72);
    const gradient = context.createRadialGradient(-5, -4, 2, 0, 0, 32);
    gradient.addColorStop(0, 'rgba(243,155,116,0.76)');
    gradient.addColorStop(0.42, 'rgba(190,73,50,0.84)');
    gradient.addColorStop(0.78, 'rgba(137,55,44,0.58)');
    gradient.addColorStop(1, 'rgba(117,62,55,0)');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, 0, 31, 0, TAU);
    context.fill();
    context.restore();
  } else if (id === 'neptune') {
    context.save();
    context.translate(width * 0.68, height * 0.57);
    context.rotate(-0.12);
    context.scale(2.2, 0.78);
    const gradient = context.createRadialGradient(-4, -2, 2, 0, 0, 22);
    gradient.addColorStop(0, 'rgba(7,19,77,0.72)');
    gradient.addColorStop(0.68, 'rgba(15,34,108,0.56)');
    gradient.addColorStop(1, 'rgba(20,53,143,0)');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, 0, 22, 0, TAU);
    context.fill();
    context.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = anisotropy;
  texture.needsUpdate = true;
  return texture;
}

export function atmosphereScaleFor(id: string): number {
  return ATMOSPHERE_SCALES[id] ?? 1.08;
}

export class PlanetPolishSystem {
  private readonly geometry = new THREE.SphereGeometry(1, 64, 48);
  private readonly layers = new Map<string, OverlayLayer>();
  private readonly textures: THREE.Texture[] = [];
  private readonly materials: THREE.Material[] = [];
  private focusedId = 'sun';
  private quality: PlanetPolishQuality = 'low';

  constructor(
    renderer: THREE.WebGLRenderer,
    axes: Map<string, THREE.Group>,
    private readonly planetMeshes: Map<string, THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>>,
    private readonly atmosphereMeshes: Map<string, THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial>>,
    private readonly atmosphereMaterials: Map<string, THREE.ShaderMaterial>,
  ) {
    const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    OVERLAY_PROFILES.forEach((profile) => {
      const axis = axes.get(profile.id);
      if (!axis) return;
      const map = overlayTexture(profile.id, anisotropy);
      const material = new THREE.MeshStandardMaterial({
        map,
        transparent: true,
        opacity: profile.opacity,
        alphaTest: 0.006,
        depthWrite: false,
        roughness: 1,
        metalness: 0,
        side: THREE.FrontSide,
      });
      material.userData.baseOpacity = profile.opacity;
      const mesh = new THREE.Mesh(this.geometry, material);
      mesh.name = `${profile.id}-polish-layer`;
      mesh.renderOrder = 2;
      mesh.visible = false;
      axis.add(mesh);
      this.textures.push(map);
      this.materials.push(material);
      this.layers.set(profile.id, { mesh, profile });
    });
  }

  setPlanetRadius(id: string, radius: number): void {
    const layer = this.layers.get(id);
    if (layer) layer.mesh.scale.setScalar(radius * layer.profile.scale);
    const atmosphere = this.atmosphereMeshes.get(id);
    if (atmosphere) atmosphere.scale.setScalar(radius * atmosphereScaleFor(id));
  }

  applyQuality(quality: PlanetPolishQuality, focusedId: string): void {
    this.quality = quality;
    this.focusedId = focusedId;
    const focusedPlanet = focusedId === 'sun' ? 'earth' : focusedId;

    this.layers.forEach(({ mesh, profile }, id) => {
      if (quality === 'low') {
        mesh.visible = false;
        return;
      }
      const overviewPriority = focusedId === 'sun' && (id === 'jupiter' || id === 'saturn');
      const active = quality === 'high' || id === focusedPlanet || overviewPriority;
      mesh.visible = active;
      mesh.material.opacity = profile.opacity * (quality === 'high' || id === focusedPlanet ? 1 : 0.58);
      mesh.material.needsUpdate = true;
    });

    this.atmosphereMeshes.forEach((mesh, id) => {
      const overviewPriority = focusedId === 'sun' && (id === 'jupiter' || id === 'saturn');
      const active =
        id === 'earth' ||
        id === focusedPlanet ||
        quality === 'high' ||
        (quality === 'auto' && overviewPriority);
      mesh.visible = active;
      const material = this.atmosphereMaterials.get(id);
      const strength = ATMOSPHERE_STRENGTHS[id] ?? 0.5;
      const qualityScale = quality === 'low' ? 0.58 : quality === 'auto' && id !== focusedPlanet ? 0.72 : 1;
      if (material?.uniforms.glowStrength) material.uniforms.glowStrength.value = strength * qualityScale;
    });
  }

  update(simulationDays: number): void {
    this.layers.forEach(({ mesh, profile }, id) => {
      const planet = this.planetMeshes.get(id);
      if (!planet) return;
      mesh.rotation.y = planet.rotation.y + simulationDays * profile.driftPerDay;
    });
  }

  dispose(): void {
    this.layers.forEach(({ mesh }) => mesh.removeFromParent());
    this.textures.forEach((texture) => texture.dispose());
    this.materials.forEach((material) => material.dispose());
    this.geometry.dispose();
    this.layers.clear();
  }
}
