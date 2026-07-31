import * as THREE from 'three';

export type MoonQuality = 'low' | 'auto' | 'high';

type MoonMaterialTier = 'low' | 'auto' | 'high';

interface MoonTextureBundle {
  albedo: THREE.CanvasTexture;
  height: THREE.CanvasTexture;
  normal?: THREE.CanvasTexture;
}

const TAU = Math.PI * 2;

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function randomFactory(seedInput: number): () => number {
  let seed = seedInput >>> 0;
  return () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function lunarNoise(u: number, v: number): number {
  const a = Math.sin((u * 4.1 + Math.sin(v * 8.7) * 0.08) * TAU);
  const b = Math.sin((u * 11.8 - v * 5.4) * TAU) * 0.48;
  const c = Math.cos((u * 27.2 + v * 17.9) * TAU) * 0.23;
  const d = Math.sin((u * 61.3 - v * 39.1) * TAU) * 0.11;
  return (a + b + c + d) / 1.82;
}

function createCanvas(width: number, height: number): { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas 2D is unavailable for Moon texture generation.');
  return { canvas, context };
}

function drawWrappedCrater(
  context: CanvasRenderingContext2D,
  width: number,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  light: boolean,
): void {
  for (const offset of [-width, 0, width]) {
    context.save();
    context.translate(x + offset, y);
    context.scale(1, radiusY / Math.max(0.01, radiusX));
    const gradient = context.createRadialGradient(
      -radiusX * 0.2,
      -radiusX * 0.24,
      radiusX * 0.06,
      0,
      0,
      radiusX,
    );
    if (light) {
      gradient.addColorStop(0, 'rgba(250,248,238,0.34)');
      gradient.addColorStop(0.38, 'rgba(176,172,163,0.12)');
      gradient.addColorStop(0.66, 'rgba(30,29,28,0.42)');
      gradient.addColorStop(0.82, 'rgba(232,228,216,0.25)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
    } else {
      gradient.addColorStop(0, 'rgba(198,198,198,0.5)');
      gradient.addColorStop(0.5, 'rgba(72,72,72,0.44)');
      gradient.addColorStop(0.72, 'rgba(24,24,24,0.72)');
      gradient.addColorStop(0.86, 'rgba(222,222,222,0.64)');
      gradient.addColorStop(1, 'rgba(128,128,128,0)');
    }
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, 0, radiusX, 0, TAU);
    context.fill();
    context.restore();
  }
}

function createMoonTextures(width: number, height: number, craterCount: number, withNormal: boolean): MoonTextureBundle {
  const albedoCanvas = createCanvas(width, height);
  const heightCanvas = createCanvas(width, height);
  const albedoImage = albedoCanvas.context.createImageData(width, height);
  const heightImage = heightCanvas.context.createImageData(width, height);

  for (let y = 0; y < height; y += 1) {
    const v = y / Math.max(1, height - 1);
    const latitude = Math.abs(v - 0.5) * 2;
    for (let x = 0; x < width; x += 1) {
      const u = x / Math.max(1, width - 1);
      const noise = lunarNoise(u, v);
      const fine = Math.sin((u * 143.7 + v * 89.3) * TAU) * 0.035;
      const polarShade = latitude * 5;
      const base = 166 + noise * 20 + fine * 255 - polarShade;
      const warm = Math.max(0, noise) * 4;
      const offset = (y * width + x) * 4;
      albedoImage.data[offset] = clampByte(base + 7 + warm);
      albedoImage.data[offset + 1] = clampByte(base + 5 + warm * 0.6);
      albedoImage.data[offset + 2] = clampByte(base + 1);
      albedoImage.data[offset + 3] = 255;
      const heightValue = clampByte(130 + noise * 34 + fine * 215);
      heightImage.data[offset] = heightValue;
      heightImage.data[offset + 1] = heightValue;
      heightImage.data[offset + 2] = heightValue;
      heightImage.data[offset + 3] = 255;
    }
  }
  albedoCanvas.context.putImageData(albedoImage, 0, 0);
  heightCanvas.context.putImageData(heightImage, 0, 0);

  const maria = [
    [0.31, 0.43, 0.12, 0.065, -0.18],
    [0.39, 0.55, 0.1, 0.078, 0.14],
    [0.48, 0.39, 0.085, 0.058, -0.08],
    [0.58, 0.52, 0.11, 0.07, 0.18],
    [0.67, 0.42, 0.075, 0.052, -0.22],
  ] as const;
  for (const [u, v, radiusU, radiusV, rotation] of maria) {
    albedoCanvas.context.save();
    albedoCanvas.context.translate(u * width, v * height);
    albedoCanvas.context.rotate(rotation);
    const gradient = albedoCanvas.context.createRadialGradient(0, 0, 0, 0, 0, radiusU * width);
    gradient.addColorStop(0, 'rgba(50,51,51,0.32)');
    gradient.addColorStop(0.7, 'rgba(63,64,64,0.25)');
    gradient.addColorStop(1, 'rgba(82,82,82,0)');
    albedoCanvas.context.fillStyle = gradient;
    albedoCanvas.context.scale(1, (radiusV * height) / Math.max(1, radiusU * width));
    albedoCanvas.context.beginPath();
    albedoCanvas.context.arc(0, 0, radiusU * width, 0, TAU);
    albedoCanvas.context.fill();
    albedoCanvas.context.restore();
  }

  const random = randomFactory(0x4d4f4f4e + width);
  for (let index = 0; index < craterCount; index += 1) {
    const u = random();
    const v = 0.035 + random() * 0.93;
    const latitudeScale = Math.max(0.28, Math.cos((v - 0.5) * Math.PI));
    const large = index < Math.max(7, Math.round(craterCount * 0.055));
    const radius = large ? width * (0.018 + random() * 0.026) : width * (0.0024 + Math.pow(random(), 2.4) * 0.015);
    const radiusY = radius * latitudeScale;
    drawWrappedCrater(albedoCanvas.context, width, u * width, v * height, radius, radiusY, true);
    drawWrappedCrater(heightCanvas.context, width, u * width, v * height, radius, radiusY, false);
  }

  const createTexture = (canvas: HTMLCanvasElement, colorSpace: THREE.ColorSpace): THREE.CanvasTexture => {
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = colorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
    return texture;
  };

  const albedo = createTexture(albedoCanvas.canvas, THREE.SRGBColorSpace);
  const heightTexture = createTexture(heightCanvas.canvas, THREE.NoColorSpace);
  const bundle: MoonTextureBundle = { albedo, height: heightTexture };

  if (withNormal) {
    const normalCanvas = createCanvas(width, height);
    const source = heightCanvas.context.getImageData(0, 0, width, height);
    const normal = normalCanvas.context.createImageData(width, height);
    const luminance = (x: number, y: number): number => {
      const wrappedX = (x + width) % width;
      const clampedY = Math.max(0, Math.min(height - 1, y));
      return source.data[(clampedY * width + wrappedX) * 4] / 255;
    };
    const strength = 2.45;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        let nx = (luminance(x - 1, y) - luminance(x + 1, y)) * strength;
        let ny = (luminance(x, y - 1) - luminance(x, y + 1)) * strength;
        let nz = 1;
        const length = Math.hypot(nx, ny, nz) || 1;
        nx /= length;
        ny /= length;
        nz /= length;
        const offset = (y * width + x) * 4;
        normal.data[offset] = clampByte((nx * 0.5 + 0.5) * 255);
        normal.data[offset + 1] = clampByte((ny * 0.5 + 0.5) * 255);
        normal.data[offset + 2] = clampByte((nz * 0.5 + 0.5) * 255);
        normal.data[offset + 3] = 255;
      }
    }
    normalCanvas.context.putImageData(normal, 0, 0);
    bundle.normal = createTexture(normalCanvas.canvas, THREE.NoColorSpace);
  }

  return bundle;
}

export class MoonVisualSystem {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
  private readonly materials = new Map<MoonMaterialTier, THREE.MeshStandardMaterial>();
  private readonly textureBundles = new Map<MoonMaterialTier, MoonTextureBundle>();

  constructor(renderer: THREE.WebGLRenderer, mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>) {
    this.renderer = renderer;
    this.mesh = mesh;
    this.applyQuality('auto', 'earth');
  }

  applyQuality(quality: MoonQuality, focusedObject: string): void {
    const tier: MoonMaterialTier = quality === 'high' || (quality === 'auto' && focusedObject === 'moon') ? 'high' : quality;
    const material = this.materialFor(tier);
    if (this.mesh.material !== material) this.mesh.material = material;
  }

  private materialFor(tier: MoonMaterialTier): THREE.MeshStandardMaterial {
    const cached = this.materials.get(tier);
    if (cached) return cached;

    const settings =
      tier === 'low'
        ? { width: 256, height: 128, craters: 48, normal: false, bumpScale: 0.026 }
        : tier === 'high'
          ? { width: 1024, height: 512, craters: 280, normal: true, bumpScale: 0.09 }
          : { width: 512, height: 256, craters: 132, normal: false, bumpScale: 0.06 };
    const textures = createMoonTextures(settings.width, settings.height, settings.craters, settings.normal);
    const anisotropy = Math.min(tier === 'high' ? 12 : 6, this.renderer.capabilities.getMaxAnisotropy());
    textures.albedo.anisotropy = anisotropy;
    textures.height.anisotropy = anisotropy;
    if (textures.normal) textures.normal.anisotropy = anisotropy;

    const material = new THREE.MeshStandardMaterial({
      map: textures.albedo,
      bumpMap: textures.height,
      bumpScale: settings.bumpScale,
      roughness: tier === 'high' ? 0.94 : 0.98,
      metalness: 0,
      color: 0xffffff,
    });
    material.userData.resourceOwner = 'moon-visual-system';
    if (textures.normal) {
      material.normalMap = textures.normal;
      material.normalScale.set(0.58, 0.58);
    }
    this.textureBundles.set(tier, textures);
    this.materials.set(tier, material);
    return material;
  }

  dispose(): void {
    this.materials.forEach((material) => material.dispose());
    this.textureBundles.forEach((bundle) => {
      bundle.albedo.dispose();
      bundle.height.dispose();
      bundle.normal?.dispose();
    });
    this.materials.clear();
    this.textureBundles.clear();
  }
}
