import * as THREE from 'three';
import { PLANET_TEXTURE_FILES } from './planet-texture-catalog';

export type PlanetTextureQuality = 'low' | 'auto' | 'high';

export interface RealTextureTargets {
  planetMaterials: Map<string, THREE.MeshStandardMaterial>;
  earthCloudMaterial: THREE.MeshStandardMaterial;
  saturnRingMaterial: THREE.MeshStandardMaterial;
}

interface MaterialSnapshot {
  map: THREE.Texture | null;
  bumpMap: THREE.Texture | null;
  normalMap: THREE.Texture | null;
  roughnessMap: THREE.Texture | null;
  metalnessMap: THREE.Texture | null;
  emissiveMap: THREE.Texture | null;
  alphaMap: THREE.Texture | null;
  color: THREE.Color;
  opacity: number;
  transparent: boolean;
  alphaTest: number;
  depthWrite: boolean;
  roughness: number;
  metalness: number;
  bumpScale: number;
  normalScale: THREE.Vector2;
  emissive: THREE.Color;
  emissiveIntensity: number;
  premultipliedAlpha: boolean;
  side: THREE.Side;
  blending: THREE.Blending;
}

const PLANET_FILES: Record<string, string> = {
  mercury: PLANET_TEXTURE_FILES.mercury,
  venus: PLANET_TEXTURE_FILES.venusAtmosphere,
  earth: PLANET_TEXTURE_FILES.earthDay,
  mars: PLANET_TEXTURE_FILES.mars,
  jupiter: PLANET_TEXTURE_FILES.jupiter,
  saturn: PLANET_TEXTURE_FILES.saturn,
  uranus: PLANET_TEXTURE_FILES.uranus,
  neptune: PLANET_TEXTURE_FILES.neptune,
};

const ALL_PLANET_IDS = Object.keys(PLANET_FILES);

function textureUrl(filename: string): string {
  return new URL(`assets/planets/high/${filename}`, document.baseURI).href;
}

export type PlanetTextureSourceResolver = (filename: string) => string | undefined;

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = clamp01((value - edge0) / Math.max(0.00001, edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function materialSnapshot(material: THREE.MeshStandardMaterial): MaterialSnapshot {
  return {
    map: material.map,
    bumpMap: material.bumpMap,
    normalMap: material.normalMap,
    roughnessMap: material.roughnessMap,
    metalnessMap: material.metalnessMap,
    emissiveMap: material.emissiveMap,
    alphaMap: material.alphaMap,
    color: material.color.clone(),
    opacity: material.opacity,
    transparent: material.transparent,
    alphaTest: material.alphaTest,
    depthWrite: material.depthWrite,
    roughness: material.roughness,
    metalness: material.metalness,
    bumpScale: material.bumpScale,
    normalScale: material.normalScale.clone(),
    emissive: material.emissive.clone(),
    emissiveIntensity: material.emissiveIntensity,
    premultipliedAlpha: material.premultipliedAlpha,
    side: material.side,
    blending: material.blending,
  };
}

function restoreMaterial(material: THREE.MeshStandardMaterial, snapshot: MaterialSnapshot): void {
  material.map = snapshot.map;
  material.bumpMap = snapshot.bumpMap;
  material.normalMap = snapshot.normalMap;
  material.roughnessMap = snapshot.roughnessMap;
  material.metalnessMap = snapshot.metalnessMap;
  material.emissiveMap = snapshot.emissiveMap;
  material.alphaMap = snapshot.alphaMap;
  material.color.copy(snapshot.color);
  material.opacity = snapshot.opacity;
  material.transparent = snapshot.transparent;
  material.alphaTest = snapshot.alphaTest;
  material.depthWrite = snapshot.depthWrite;
  material.roughness = snapshot.roughness;
  material.metalness = snapshot.metalness;
  material.bumpScale = snapshot.bumpScale;
  material.normalScale.copy(snapshot.normalScale);
  material.emissive.copy(snapshot.emissive);
  material.emissiveIntensity = snapshot.emissiveIntensity;
  material.premultipliedAlpha = snapshot.premultipliedAlpha;
  material.side = snapshot.side;
  material.blending = snapshot.blending;
  material.needsUpdate = true;
}

function configureColorTexture(texture: THREE.Texture, anisotropy: number): THREE.Texture {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = anisotropy;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

function configureDataTexture(texture: THREE.Texture, anisotropy: number): THREE.Texture {
  texture.colorSpace = THREE.NoColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = anisotropy;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

function imageCanvas(image: CanvasImageSource, maxWidth = 1024): HTMLCanvasElement {
  const sourceWidth =
    image instanceof HTMLImageElement
      ? image.naturalWidth
      : image instanceof HTMLVideoElement
        ? image.videoWidth
        : Number((image as { width?: number }).width ?? 1);
  const sourceHeight =
    image instanceof HTMLImageElement
      ? image.naturalHeight
      : image instanceof HTMLVideoElement
        ? image.videoHeight
        : Number((image as { height?: number }).height ?? 1);
  const scale = Math.min(1, maxWidth / Math.max(1, sourceWidth));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(2, Math.round(sourceWidth * scale));
  canvas.height = Math.max(2, Math.round(sourceHeight * scale));
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas 2D is unavailable for texture derivation.');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function tunePixel(
  red: number,
  green: number,
  blue: number,
  contrast: number,
  saturation: number,
  brightness: number,
): [number, number, number] {
  const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
  let r = luminance + (red - luminance) * saturation;
  let g = luminance + (green - luminance) * saturation;
  let b = luminance + (blue - luminance) * saturation;
  r = (r - 128) * contrast + 128;
  g = (g - 128) * contrast + 128;
  b = (b - 128) * contrast + 128;
  return [clampByte(r * brightness), clampByte(g * brightness), clampByte(b * brightness)];
}

function enhancePlanetTexture(source: THREE.Texture, id: string, anisotropy: number): THREE.CanvasTexture {
  const maxWidth = id === 'jupiter' || id === 'saturn' ? 1536 : 1280;
  const canvas = imageCanvas(source.image as CanvasImageSource, maxWidth);
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error(`Unable to enhance ${id} texture.`);
  const image = context.getImageData(0, 0, canvas.width, canvas.height);

  const profiles: Record<string, { contrast: number; saturation: number; brightness: number }> = {
    mercury: { contrast: 1.28, saturation: 0.76, brightness: 1.03 },
    venus: { contrast: 1.13, saturation: 1.1, brightness: 1.08 },
    mars: { contrast: 1.22, saturation: 1.16, brightness: 1.06 },
    jupiter: { contrast: 1.2, saturation: 1.12, brightness: 1.04 },
    saturn: { contrast: 1.17, saturation: 1.08, brightness: 1.05 },
    uranus: { contrast: 1.11, saturation: 1.08, brightness: 1.035 },
    neptune: { contrast: 1.2, saturation: 1.22, brightness: 1.045 },
  };
  const profile = profiles[id] ?? { contrast: 1.08, saturation: 1.06, brightness: 1.02 };

  for (let y = 0; y < canvas.height; y += 1) {
    const v = y / Math.max(1, canvas.height - 1);
    const latitude = Math.abs(v - 0.5) * 2;
    for (let x = 0; x < canvas.width; x += 1) {
      const offset = (y * canvas.width + x) * 4;
      let [red, green, blue] = tunePixel(
        image.data[offset],
        image.data[offset + 1],
        image.data[offset + 2],
        profile.contrast,
        profile.saturation,
        profile.brightness,
      );

      if (id === 'jupiter') {
        const broad = Math.sin(v * Math.PI * 34);
        const fine = Math.sin(v * Math.PI * 82);
        const modulation = 0.96 + broad * 0.045 + fine * 0.018;
        red = clampByte(red * modulation + Math.max(0, broad) * 5);
        green = clampByte(green * modulation);
        blue = clampByte(blue * (0.975 + broad * 0.025));
      } else if (id === 'saturn') {
        const broad = Math.sin(v * Math.PI * 46);
        const fine = Math.sin(v * Math.PI * 116);
        const modulation = 0.975 + broad * 0.032 + fine * 0.012;
        red = clampByte(red * modulation + Math.max(0, broad) * 4);
        green = clampByte(green * modulation + Math.max(0, broad) * 2);
        blue = clampByte(blue * (0.98 + broad * 0.02));
      } else if (id === 'mars') {
        const polar = smoothstep(0.86, 0.985, latitude);
        red = clampByte(red + polar * (242 - red) * 0.72);
        green = clampByte(green + polar * (232 - green) * 0.78);
        blue = clampByte(blue + polar * (220 - blue) * 0.82);
      } else if (id === 'uranus') {
        const band = Math.sin(v * Math.PI * 25);
        const modulation = 0.985 + band * 0.022;
        red = clampByte(red * modulation);
        green = clampByte(green * modulation + Math.max(0, band) * 2);
        blue = clampByte(blue * modulation + Math.max(0, band) * 2);
      } else if (id === 'neptune') {
        const band = Math.sin(v * Math.PI * 33);
        const modulation = 0.97 + band * 0.045;
        red = clampByte(red * modulation);
        green = clampByte(green * modulation + Math.max(0, band) * 3);
        blue = clampByte(blue * (0.99 + band * 0.025) + 3);
      } else if (id === 'venus') {
        const swirl = Math.sin((v * 22 + x / canvas.width * 1.4) * Math.PI);
        const modulation = 0.985 + swirl * 0.025;
        red = clampByte(red * modulation + Math.max(0, swirl) * 4);
        green = clampByte(green * modulation + Math.max(0, swirl) * 3);
        blue = clampByte(blue * modulation + Math.max(0, swirl) * 2);
      }

      image.data[offset] = red;
      image.data[offset + 1] = green;
      image.data[offset + 2] = blue;
      image.data[offset + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);

  if (id === 'jupiter') {
    context.save();
    context.translate(canvas.width * 0.72, canvas.height * 0.625);
    context.rotate(-0.07);
    context.scale(1.85, 0.72);
    const radius = canvas.height * 0.075;
    const gradient = context.createRadialGradient(-radius * 0.15, -radius * 0.12, radius * 0.08, 0, 0, radius);
    gradient.addColorStop(0, 'rgba(232,139,103,0.48)');
    gradient.addColorStop(0.45, 'rgba(184,70,48,0.58)');
    gradient.addColorStop(0.78, 'rgba(132,56,45,0.34)');
    gradient.addColorStop(1, 'rgba(110,58,53,0)');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
  } else if (id === 'neptune') {
    context.save();
    context.translate(canvas.width * 0.68, canvas.height * 0.57);
    context.rotate(-0.12);
    context.scale(2.25, 0.78);
    const radius = canvas.height * 0.052;
    const gradient = context.createRadialGradient(-radius * 0.2, -radius * 0.12, radius * 0.08, 0, 0, radius);
    gradient.addColorStop(0, 'rgba(4,14,66,0.6)');
    gradient.addColorStop(0.68, 'rgba(12,31,103,0.42)');
    gradient.addColorStop(1, 'rgba(18,51,142,0)');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  configureColorTexture(texture, anisotropy);
  return texture;
}

function deriveEarthRoughness(source: THREE.Texture, anisotropy: number): THREE.CanvasTexture {
  const canvas = imageCanvas(source.image as CanvasImageSource, 1024);
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Unable to derive Earth roughness map.');
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  for (let index = 0; index < image.data.length; index += 4) {
    const red = image.data[index];
    const green = image.data[index + 1];
    const blue = image.data[index + 2];
    const ocean = blue > red * 1.08 && blue > green * 1.02 && blue > 72;
    const ice = red > 205 && green > 215 && blue > 220;
    const value = ice ? 205 : ocean ? 48 : 218;
    image.data[index] = value;
    image.data[index + 1] = value;
    image.data[index + 2] = value;
    image.data[index + 3] = 255;
  }
  context.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  configureDataTexture(texture, anisotropy);
  return texture;
}

function deriveNormalMap(
  source: THREE.Texture,
  strength: number,
  anisotropy: number,
  maxWidth = 768,
): THREE.CanvasTexture {
  const canvas = imageCanvas(source.image as CanvasImageSource, maxWidth);
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Unable to derive normal map.');
  const sourceData = context.getImageData(0, 0, canvas.width, canvas.height);
  const output = context.createImageData(canvas.width, canvas.height);
  const luminance = (x: number, y: number): number => {
    const wrappedX = (x + canvas.width) % canvas.width;
    const clampedY = Math.max(0, Math.min(canvas.height - 1, y));
    const offset = (clampedY * canvas.width + wrappedX) * 4;
    return (
      sourceData.data[offset] * 0.2126 +
      sourceData.data[offset + 1] * 0.7152 +
      sourceData.data[offset + 2] * 0.0722
    ) / 255;
  };

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const left = luminance(x - 1, y);
      const right = luminance(x + 1, y);
      const up = luminance(x, y - 1);
      const down = luminance(x, y + 1);
      let nx = (left - right) * strength;
      let ny = (up - down) * strength;
      let nz = 1;
      const length = Math.hypot(nx, ny, nz) || 1;
      nx /= length;
      ny /= length;
      nz /= length;
      const offset = (y * canvas.width + x) * 4;
      output.data[offset] = Math.round((nx * 0.5 + 0.5) * 255);
      output.data[offset + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      output.data[offset + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      output.data[offset + 3] = 255;
    }
  }

  context.putImageData(output, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  configureDataTexture(texture, anisotropy);
  return texture;
}

function radialSaturnRing(source: THREE.Texture, anisotropy: number): THREE.CanvasTexture {
  const sourceCanvas = imageCanvas(source.image as CanvasImageSource, 2048);
  const sourceContext = sourceCanvas.getContext('2d', { willReadFrequently: true });
  if (!sourceContext) throw new Error('Unable to read Saturn ring texture.');
  const sourceData = sourceContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to create Saturn ring texture.');
  const output = context.createImageData(size, size);
  const center = size / 2;
  const inner = 0.49;
  const outer = 0.96;
  const sampleRows = [0.42, 0.47, 0.5, 0.53, 0.58];

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = (x - center) / center;
      const dy = (y - center) / center;
      const radius = Math.hypot(dx, dy);
      const destinationOffset = (y * size + x) * 4;
      if (radius < inner || radius > outer) continue;
      const normalized = (radius - inner) / (outer - inner);
      const sourceX = Math.min(sourceCanvas.width - 1, Math.floor(normalized * sourceCanvas.width));
      let red = 0;
      let green = 0;
      let blue = 0;
      sampleRows.forEach((row) => {
        const sourceY = Math.min(sourceCanvas.height - 1, Math.floor(sourceCanvas.height * row));
        const sourceOffset = (sourceY * sourceCanvas.width + sourceX) * 4;
        red += sourceData.data[sourceOffset];
        green += sourceData.data[sourceOffset + 1];
        blue += sourceData.data[sourceOffset + 2];
      });
      red /= sampleRows.length;
      green /= sampleRows.length;
      blue /= sampleRows.length;
      const luminance = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255;
      const fineBands = 0.86 + Math.sin(normalized * Math.PI * 154) * 0.08;
      const broadBands = 0.9 + Math.sin(normalized * Math.PI * 23) * 0.09;
      const cassini = 1 - smoothstep(0.525, 0.555, normalized) * (1 - smoothstep(0.61, 0.635, normalized)) * 0.91;
      const encke = 1 - smoothstep(0.828, 0.838, normalized) * (1 - smoothstep(0.852, 0.862, normalized)) * 0.62;
      const innerFeather = smoothstep(0, 0.018, normalized);
      const outerFeather = 1 - smoothstep(0.975, 1, normalized);
      const alpha = clamp01(Math.pow(luminance, 0.66) * fineBands * broadBands * cassini * encke * innerFeather * outerFeather);
      output.data[destinationOffset] = clampByte((red - 128) * 1.1 + 132);
      output.data[destinationOffset + 1] = clampByte((green - 128) * 1.08 + 130);
      output.data[destinationOffset + 2] = clampByte((blue - 128) * 1.05 + 126);
      output.data[destinationOffset + 3] = clampByte(alpha * 248);
    }
  }

  context.putImageData(output, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  configureColorTexture(texture, anisotropy);
  return texture;
}

export class RealPlanetTextureManager {
  private readonly loader = new THREE.TextureLoader();
  private readonly anisotropy: number;
  private readonly originals = new Map<string, MaterialSnapshot>();
  private readonly loaded = new Map<string, THREE.Texture>();
  private readonly derived = new Map<string, THREE.Texture>();
  private readonly inFlight = new Map<string, Promise<THREE.Texture>>();
  private quality: PlanetTextureQuality = 'low';
  private focusedId = 'sun';
  private requestToken = 0;
  private appliedSignature = '';
  private applyingSignature = '';
  private disposed = false;

  constructor(
    private readonly renderer: THREE.WebGLRenderer,
    private readonly targets: RealTextureTargets,
    private readonly onStatus?: (message: string) => void,
    private readonly textureSource: PlanetTextureSourceResolver = textureUrl,
  ) {
    this.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    targets.planetMaterials.forEach((material, id) => this.originals.set(id, materialSnapshot(material)));
    this.originals.set('earth-clouds', materialSnapshot(targets.earthCloudMaterial));
    this.originals.set('saturn-ring', materialSnapshot(targets.saturnRingMaterial));
  }

  async applyQuality(quality: PlanetTextureQuality, focusedId: string): Promise<void> {
    if (this.disposed) return;
    const target = focusedId === 'sun' ? 'earth' : focusedId;
    const signature = quality === 'auto' ? `auto:${target}` : quality;
    this.quality = quality;
    this.focusedId = focusedId;
    if (signature === this.appliedSignature || signature === this.applyingSignature) return;

    this.applyingSignature = signature;
    const token = ++this.requestToken;
    this.restoreProcedural();

    if (quality === 'low') {
      if (this.isCurrent(token)) this.appliedSignature = signature;
      this.applyingSignature = '';
      return;
    }

    if (quality === 'auto') {
      await this.ensurePlanet(target, token);
      if (this.isCurrent(token, 'auto')) this.appliedSignature = signature;
      if (this.applyingSignature === signature) this.applyingSignature = '';
      return;
    }

    this.onStatus?.('Loading v0.4.1 high-detail planet polish…');
    await Promise.allSettled(ALL_PLANET_IDS.map((id) => this.ensurePlanet(id, token)));
    if (this.isCurrent(token, 'high')) {
      this.appliedSignature = signature;
      this.onStatus?.('v0.4.1 planet polish ready · Offline cached');
    }
    if (this.applyingSignature === signature) this.applyingSignature = '';
  }

  async focus(id: string): Promise<void> {
    this.focusedId = id;
    if (this.quality !== 'auto') return;
    await this.applyQuality('auto', id);
  }

  private isCurrent(token: number, quality?: PlanetTextureQuality): boolean {
    return !this.disposed && token === this.requestToken && (!quality || quality === this.quality);
  }

  private restoreProcedural(): void {
    this.targets.planetMaterials.forEach((material, id) => {
      const snapshot = this.originals.get(id);
      if (snapshot) restoreMaterial(material, snapshot);
      delete material.userData.realTextureApplied;
    });
    const cloudSnapshot = this.originals.get('earth-clouds');
    if (cloudSnapshot) restoreMaterial(this.targets.earthCloudMaterial, cloudSnapshot);
    const ringSnapshot = this.originals.get('saturn-ring');
    if (ringSnapshot) restoreMaterial(this.targets.saturnRingMaterial, ringSnapshot);
    delete this.targets.saturnRingMaterial.userData.realTextureApplied;
  }

  private async load(filename: string): Promise<THREE.Texture> {
    const existing = this.loaded.get(filename);
    if (existing) return existing;
    const pending = this.inFlight.get(filename);
    if (pending) return pending;

    const source = this.textureSource(filename);
    if (!source) throw new Error(`Texture source is unavailable for ${filename}.`);

    const promise = this.loader
      .loadAsync(source)
      .then((texture) => {
        configureColorTexture(texture, this.anisotropy);
        this.loaded.set(filename, texture);
        this.inFlight.delete(filename);
        return texture;
      })
      .catch((error) => {
        this.inFlight.delete(filename);
        throw error;
      });
    this.inFlight.set(filename, promise);
    return promise;
  }

  private derivedTexture(key: string, factory: () => THREE.Texture): THREE.Texture {
    const existing = this.derived.get(key);
    if (existing) return existing;
    const texture = factory();
    this.derived.set(key, texture);
    return texture;
  }

  private async ensurePlanet(id: string, token: number): Promise<void> {
    if (!this.isCurrent(token) || !PLANET_FILES[id]) return;
    const material = this.targets.planetMaterials.get(id);
    if (!material) return;

    try {
      if (id === 'earth') {
        await this.applyEarth(material, token);
      } else if (id === 'venus') {
        await this.applyVenus(material, token);
      } else {
        const source = await this.load(PLANET_FILES[id]);
        if (!this.isCurrent(token)) return;
        const enhanced = this.derivedTexture(`${id}-enhanced`, () => enhancePlanetTexture(source, id, this.anisotropy));
        const snapshot = this.originals.get(id);
        if (snapshot) restoreMaterial(material, snapshot);
        material.map = enhanced;
        material.emissiveMap = null;
        material.metalness = 0;
        this.applyPlanetMaterialTuning(id, material, enhanced);
        if (id === 'saturn') await this.applySaturnRing(token);
      }
      if (!this.isCurrent(token)) return;
      material.userData.realTextureApplied = true;
      material.needsUpdate = true;
      const label = id.charAt(0).toUpperCase() + id.slice(1);
      this.onStatus?.(`${label} polished real map ready`);
    } catch (error) {
      if (!this.isCurrent(token)) return;
      console.warn(`Real texture for ${id} failed; procedural fallback retained.`, error);
      const snapshot = this.originals.get(id);
      if (snapshot) restoreMaterial(material, snapshot);
      this.onStatus?.(`${id} map unavailable · Procedural fallback retained`);
    }
  }

  private applyPlanetMaterialTuning(
    id: string,
    material: THREE.MeshStandardMaterial,
    enhanced: THREE.Texture,
  ): void {
    if (id === 'mercury') {
      const normal = this.derivedTexture('mercury-normal', () => deriveNormalMap(enhanced, 2.35, this.anisotropy, 768));
      material.bumpMap = enhanced;
      material.bumpScale = 0.105;
      material.normalMap = normal;
      material.normalScale.set(0.68, 0.68);
      material.roughness = 0.98;
      material.emissive.setHex(0x080604);
      material.emissiveIntensity = 0.025;
    } else if (id === 'mars') {
      const normal = this.derivedTexture('mars-normal', () => deriveNormalMap(enhanced, 1.85, this.anisotropy, 768));
      material.bumpMap = enhanced;
      material.bumpScale = 0.078;
      material.normalMap = normal;
      material.normalScale.set(0.54, 0.54);
      material.roughness = 0.96;
      material.emissive.setHex(0x160604);
      material.emissiveIntensity = 0.035;
    } else if (id === 'jupiter') {
      const normal = this.derivedTexture('jupiter-normal', () => deriveNormalMap(enhanced, 0.92, this.anisotropy, 640));
      material.normalMap = normal;
      material.normalScale.set(0.2, 0.2);
      material.roughness = 0.94;
      material.emissive.setHex(0x160d08);
      material.emissiveIntensity = 0.045;
    } else if (id === 'saturn') {
      const normal = this.derivedTexture('saturn-normal', () => deriveNormalMap(enhanced, 0.68, this.anisotropy, 640));
      material.normalMap = normal;
      material.normalScale.set(0.14, 0.14);
      material.roughness = 0.96;
      material.emissive.setHex(0x130e08);
      material.emissiveIntensity = 0.038;
    } else if (id === 'uranus') {
      const normal = this.derivedTexture('uranus-normal', () => deriveNormalMap(enhanced, 0.34, this.anisotropy, 512));
      material.normalMap = normal;
      material.normalScale.set(0.07, 0.07);
      material.roughness = 0.91;
      material.emissive.setHex(0x071519);
      material.emissiveIntensity = 0.055;
    } else if (id === 'neptune') {
      const normal = this.derivedTexture('neptune-normal', () => deriveNormalMap(enhanced, 0.62, this.anisotropy, 640));
      material.normalMap = normal;
      material.normalScale.set(0.12, 0.12);
      material.roughness = 0.89;
      material.emissive.setHex(0x030a25);
      material.emissiveIntensity = 0.075;
    }
  }

  private async applyVenus(material: THREE.MeshStandardMaterial, token: number): Promise<void> {
    const [atmosphere, surface] = await Promise.all([
      this.load('venus-atmosphere.jpg'),
      this.load('venus-surface.jpg'),
    ]);
    if (!this.isCurrent(token)) return;
    const enhanced = this.derivedTexture('venus-enhanced', () => enhancePlanetTexture(atmosphere, 'venus', this.anisotropy));
    const surfaceBump = this.derivedTexture('venus-surface-bump', () => {
      const texture = surface.clone();
      configureDataTexture(texture, this.anisotropy);
      return texture;
    });
    const cloudNormal = this.derivedTexture('venus-cloud-normal', () =>
      deriveNormalMap(enhanced, 0.78, this.anisotropy, 640),
    );
    const snapshot = this.originals.get('venus');
    if (snapshot) restoreMaterial(material, snapshot);
    material.map = enhanced;
    material.bumpMap = surfaceBump;
    material.bumpScale = 0.018;
    material.normalMap = cloudNormal;
    material.normalScale.set(0.22, 0.22);
    material.roughness = 0.985;
    material.metalness = 0;
    material.emissive.setHex(0x2b1608);
    material.emissiveIntensity = 0.105;
  }

  private async applyEarth(material: THREE.MeshStandardMaterial, token: number): Promise<void> {
    const [day, night, clouds] = await Promise.all([
      this.load('earth-day.jpg'),
      this.load('earth-night.jpg'),
      this.load('earth-clouds.jpg'),
    ]);
    if (!this.isCurrent(token)) return;
    const roughness = this.derivedTexture('earth-roughness', () => deriveEarthRoughness(day, this.anisotropy));
    const normal = this.derivedTexture('earth-normal', () => deriveNormalMap(day, 1.45, this.anisotropy, 1024));
    const snapshot = this.originals.get('earth');
    if (snapshot) restoreMaterial(material, snapshot);

    material.map = day;
    material.emissiveMap = night;
    material.emissive.setHex(0xffd38a);
    material.emissiveIntensity = 0.56;
    material.roughnessMap = roughness;
    material.roughness = 0.92;
    material.normalMap = normal;
    material.normalScale.set(0.48, 0.48);
    material.metalness = 0.02;

    const cloudSnapshot = this.originals.get('earth-clouds');
    const cloudMaterial = this.targets.earthCloudMaterial;
    if (cloudSnapshot) restoreMaterial(cloudMaterial, cloudSnapshot);
    cloudMaterial.map = clouds;
    cloudMaterial.alphaMap = clouds;
    cloudMaterial.color.setHex(0xffffff);
    cloudMaterial.opacity = 0.84;
    cloudMaterial.alphaTest = 0.08;
    cloudMaterial.transparent = true;
    cloudMaterial.depthWrite = false;
    cloudMaterial.needsUpdate = true;
  }

  private async applySaturnRing(token: number): Promise<void> {
    const strip = await this.load('saturn-ring.png');
    if (!this.isCurrent(token)) return;
    const radial = this.derivedTexture('saturn-ring-radial-v041', () => radialSaturnRing(strip, this.anisotropy));
    const snapshot = this.originals.get('saturn-ring');
    const material = this.targets.saturnRingMaterial;
    if (snapshot) restoreMaterial(material, snapshot);
    material.map = radial;
    material.alphaMap = radial;
    material.color.setHex(0xffffff);
    material.opacity = 0.97;
    material.alphaTest = 0.006;
    material.transparent = true;
    material.premultipliedAlpha = true;
    material.depthWrite = false;
    material.roughness = 0.78;
    material.metalness = 0;
    material.side = THREE.DoubleSide;
    material.needsUpdate = true;
    material.userData.realTextureApplied = true;
  }

  dispose(): void {
    this.disposed = true;
    this.requestToken += 1;
    this.loaded.forEach((texture) => texture.dispose());
    this.derived.forEach((texture) => texture.dispose());
    this.loaded.clear();
    this.derived.clear();
    this.inFlight.clear();
  }
}
