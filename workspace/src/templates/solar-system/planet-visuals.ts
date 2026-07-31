import * as THREE from 'three';
import type { PlanetDefinition } from './planet-data';

interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface SolarVisualAssets {
  planetMaterials: Map<string, THREE.MeshStandardMaterial>;
  atmosphereMaterials: Map<string, THREE.ShaderMaterial>;
  earthCloudMaterial: THREE.MeshStandardMaterial;
  saturnRingMaterial: THREE.MeshStandardMaterial;
  sunMaterial: THREE.MeshBasicMaterial;
  sunHaloMaterial: THREE.SpriteMaterial;
  dispose(): void;
}

const TAU = Math.PI * 2;

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function mix(a: Rgb, b: Rgb, amount: number): Rgb {
  const t = Math.max(0, Math.min(1, amount));
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

function hashSeed(text: string): number {
  let seed = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    seed ^= text.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }
  return seed >>> 0;
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

function waveNoise(u: number, v: number, seed: number): number {
  const phase = (seed % 997) / 997;
  const a = Math.sin((u * 3 + phase) * TAU + Math.sin(v * TAU * 2.1) * 1.7);
  const b = Math.sin((u * 8 - phase * 2) * TAU + v * TAU * 5.3) * 0.5;
  const c = Math.cos((u * 17 + phase * 4) * TAU - v * TAU * 11.7) * 0.25;
  const d = Math.sin((u * 31 - phase) * TAU + v * TAU * 23.9) * 0.125;
  return (a + b + c + d) / 1.875;
}

function canvasTexture(
  width: number,
  height: number,
  draw: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void,
  colorSpace: THREE.ColorSpace = THREE.SRGBColorSpace,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas 2D is unavailable for procedural planet textures.');
  draw(context, canvas);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = colorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

function paintPixelTexture(
  width: number,
  height: number,
  painter: (u: number, v: number, x: number, y: number) => Rgb,
): THREE.CanvasTexture {
  return canvasTexture(width, height, (context) => {
    const image = context.createImageData(width, height);
    for (let y = 0; y < height; y += 1) {
      const v = y / Math.max(1, height - 1);
      for (let x = 0; x < width; x += 1) {
        const u = x / Math.max(1, width - 1);
        const color = painter(u, v, x, y);
        const offset = (y * width + x) * 4;
        image.data[offset] = clampByte(color.r);
        image.data[offset + 1] = clampByte(color.g);
        image.data[offset + 2] = clampByte(color.b);
        image.data[offset + 3] = 255;
      }
    }
    context.putImageData(image, 0, 0);
  });
}

function drawCraters(context: CanvasRenderingContext2D, width: number, height: number, seed: number, count: number): void {
  const random = randomFactory(seed);
  for (let index = 0; index < count; index += 1) {
    const x = random() * width;
    const y = random() * height;
    const radius = 1.5 + random() * Math.min(width, height) * 0.035;
    const gradient = context.createRadialGradient(x - radius * 0.25, y - radius * 0.25, radius * 0.1, x, y, radius);
    gradient.addColorStop(0, 'rgba(245,240,225,0.16)');
    gradient.addColorStop(0.45, 'rgba(25,22,20,0.16)');
    gradient.addColorStop(0.72, 'rgba(0,0,0,0.28)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, TAU);
    context.fill();
  }
}

function createMercuryTexture(): THREE.CanvasTexture {
  const seed = hashSeed('mercury');
  const texture = paintPixelTexture(768, 384, (u, v) => {
    const noise = waveNoise(u, v, seed);
    const lat = Math.abs(v - 0.5) * 2;
    const base = 134 + noise * 31 - lat * 8;
    return { r: base + 9, g: base + 6, b: base + 2 };
  });
  const canvas = texture.image as HTMLCanvasElement;
  const context = canvas.getContext('2d');
  if (context) drawCraters(context, canvas.width, canvas.height, seed, 115);
  texture.needsUpdate = true;
  return texture;
}

function createVenusTexture(): THREE.CanvasTexture {
  const seed = hashSeed('venus');
  return paintPixelTexture(768, 384, (u, v) => {
    const swirl = waveNoise((u + v * 0.18) % 1, v, seed);
    const bands = Math.sin((v * 19 + swirl * 0.9) * Math.PI) * 0.5 + 0.5;
    const color = mix({ r: 137, g: 78, b: 31 }, { r: 249, g: 211, b: 126 }, bands * 0.72 + 0.15);
    return mix(color, { r: 255, g: 238, b: 183 }, Math.max(0, swirl) * 0.23);
  });
}

function createEarthTexture(): THREE.CanvasTexture {
  const seed = hashSeed('earth');
  return paintPixelTexture(1024, 512, (u, v) => {
    const latitude = Math.abs(v - 0.5) * 2;
    const terrain = waveNoise(u, v, seed) + waveNoise((u * 2.1) % 1, v * 1.7, seed + 17) * 0.38;
    const polar = Math.max(0, (latitude - 0.82) / 0.18);
    if (polar > 0.08) return mix({ r: 188, g: 218, b: 229 }, { r: 250, g: 252, b: 248 }, polar);
    const continentThreshold = 0.16 + Math.sin(v * Math.PI) * 0.04;
    if (terrain > continentThreshold) {
      const high = Math.max(0, Math.min(1, (terrain - continentThreshold) * 2.3));
      const vegetation = mix({ r: 42, g: 104, b: 52 }, { r: 137, g: 117, b: 66 }, latitude * 0.75 + high * 0.25);
      return mix(vegetation, { r: 207, g: 194, b: 156 }, high * 0.42);
    }
    const depth = Math.max(0, Math.min(1, (continentThreshold - terrain) * 1.7));
    return mix({ r: 27, g: 107, b: 178 }, { r: 4, g: 31, b: 91 }, depth);
  });
}

function createMarsTexture(): THREE.CanvasTexture {
  const seed = hashSeed('mars');
  const texture = paintPixelTexture(768, 384, (u, v) => {
    const noise = waveNoise(u, v, seed);
    const latitude = Math.abs(v - 0.5) * 2;
    const base = mix({ r: 93, g: 37, b: 24 }, { r: 208, g: 105, b: 62 }, noise * 0.32 + 0.58);
    if (latitude > 0.9) return mix(base, { r: 235, g: 221, b: 205 }, (latitude - 0.9) * 7.5);
    return base;
  });
  const canvas = texture.image as HTMLCanvasElement;
  const context = canvas.getContext('2d');
  if (context) drawCraters(context, canvas.width, canvas.height, seed, 48);
  texture.needsUpdate = true;
  return texture;
}

function createJupiterTexture(): THREE.CanvasTexture {
  const seed = hashSeed('jupiter');
  const texture = paintPixelTexture(1024, 512, (u, v) => {
    const turbulence = waveNoise(u, v * 1.7, seed) * 0.13;
    const stripe = Math.sin((v * 34 + turbulence) * Math.PI);
    const narrow = Math.sin((v * 82 - turbulence * 2) * Math.PI) * 0.22;
    const value = stripe * 0.5 + narrow;
    const pale = { r: 222, g: 202, b: 170 };
    const warm = { r: 174, g: 112, b: 73 };
    const dark = { r: 103, g: 70, b: 58 };
    return value > 0.1 ? mix(pale, warm, Math.min(1, value * 0.74)) : mix(pale, dark, Math.min(0.62, -value * 0.55));
  });
  const canvas = texture.image as HTMLCanvasElement;
  const context = canvas.getContext('2d');
  if (context) {
    context.save();
    context.translate(canvas.width * 0.72, canvas.height * 0.63);
    context.rotate(-0.08);
    const gradient = context.createRadialGradient(0, 0, 4, 0, 0, 58);
    gradient.addColorStop(0, 'rgba(178,68,47,0.95)');
    gradient.addColorStop(0.55, 'rgba(174,78,53,0.85)');
    gradient.addColorStop(1, 'rgba(127,77,61,0)');
    context.fillStyle = gradient;
    context.scale(1.8, 0.72);
    context.beginPath();
    context.arc(0, 0, 52, 0, TAU);
    context.fill();
    context.restore();
  }
  texture.needsUpdate = true;
  return texture;
}

function createSaturnTexture(): THREE.CanvasTexture {
  const seed = hashSeed('saturn');
  return paintPixelTexture(1024, 512, (u, v) => {
    const turbulence = waveNoise(u, v * 1.25, seed) * 0.06;
    const band = Math.sin((v * 46 + turbulence) * Math.PI) * 0.5 + 0.5;
    const fine = Math.sin((v * 122 - turbulence) * Math.PI) * 0.5 + 0.5;
    const base = mix({ r: 188, g: 156, b: 104 }, { r: 239, g: 218, b: 163 }, band * 0.65 + 0.2);
    return mix(base, { r: 139, g: 112, b: 82 }, fine * 0.11);
  });
}

function createUranusTexture(): THREE.CanvasTexture {
  const seed = hashSeed('uranus');
  return paintPixelTexture(768, 384, (u, v) => {
    const band = Math.sin((v * 24 + waveNoise(u, v, seed) * 0.08) * Math.PI) * 0.5 + 0.5;
    return mix({ r: 91, g: 181, b: 194 }, { r: 187, g: 231, b: 224 }, band * 0.22 + 0.2);
  });
}

function createNeptuneTexture(): THREE.CanvasTexture {
  const seed = hashSeed('neptune');
  const texture = paintPixelTexture(768, 384, (u, v) => {
    const turbulence = waveNoise(u, v * 1.8, seed);
    const band = Math.sin((v * 31 + turbulence * 0.12) * Math.PI) * 0.5 + 0.5;
    return mix({ r: 22, g: 55, b: 145 }, { r: 66, g: 126, b: 221 }, band * 0.42 + 0.2);
  });
  const canvas = texture.image as HTMLCanvasElement;
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = 'rgba(19,31,89,0.72)';
    context.beginPath();
    context.ellipse(canvas.width * 0.68, canvas.height * 0.55, 42, 16, -0.12, 0, TAU);
    context.fill();
  }
  texture.needsUpdate = true;
  return texture;
}

function createPlanetTexture(id: string): THREE.CanvasTexture {
  switch (id) {
    case 'mercury':
      return createMercuryTexture();
    case 'venus':
      return createVenusTexture();
    case 'earth':
      return createEarthTexture();
    case 'mars':
      return createMarsTexture();
    case 'jupiter':
      return createJupiterTexture();
    case 'saturn':
      return createSaturnTexture();
    case 'uranus':
      return createUranusTexture();
    case 'neptune':
      return createNeptuneTexture();
    default:
      return paintPixelTexture(512, 256, () => ({ r: 180, g: 180, b: 180 }));
  }
}

function createBumpTexture(id: string): THREE.CanvasTexture {
  const seed = hashSeed(`${id}-bump`);
  return paintPixelTexture(512, 256, (u, v) => {
    const noise = waveNoise(u, v, seed) * 0.5 + 0.5;
    const contrast = id === 'mercury' || id === 'mars' ? 0.82 : id === 'earth' ? 0.58 : 0.3;
    const value = 128 + (noise - 0.5) * 255 * contrast;
    return { r: value, g: value, b: value };
  });
}

function createEarthCloudTexture(): THREE.CanvasTexture {
  const seed = hashSeed('earth-clouds');
  return canvasTexture(1024, 512, (context, canvas) => {
    const image = context.createImageData(canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y += 1) {
      const v = y / Math.max(1, canvas.height - 1);
      for (let x = 0; x < canvas.width; x += 1) {
        const u = x / Math.max(1, canvas.width - 1);
        const noise = waveNoise((u + v * 0.07) % 1, v * 1.3, seed) * 0.68 + waveNoise(u * 2, v * 2, seed + 31) * 0.32;
        const alpha = Math.max(0, Math.min(1, (noise - 0.18) * 2.15));
        const offset = (y * canvas.width + x) * 4;
        image.data[offset] = 246;
        image.data[offset + 1] = 250;
        image.data[offset + 2] = 255;
        image.data[offset + 3] = clampByte(alpha * 205);
      }
    }
    context.putImageData(image, 0, 0);
  });
}

function createSaturnRingTexture(): THREE.CanvasTexture {
  return canvasTexture(1024, 1024, (context, canvas) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const center = canvas.width / 2;
    const image = context.createImageData(canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y += 1) {
      for (let x = 0; x < canvas.width; x += 1) {
        const dx = (x - center) / center;
        const dy = (y - center) / center;
        const radius = Math.sqrt(dx * dx + dy * dy);
        const normalized = (radius - 0.49) / 0.43;
        const offset = (y * canvas.width + x) * 4;
        if (normalized < 0 || normalized > 1) continue;
        const bands = Math.sin(normalized * 118 * Math.PI) * 0.5 + 0.5;
        const broad = Math.sin(normalized * 17 * Math.PI) * 0.5 + 0.5;
        const cassini = normalized > 0.52 && normalized < 0.61 ? 0.18 : 1;
        const alpha = (0.32 + bands * 0.45 + broad * 0.18) * cassini;
        const color = mix({ r: 137, g: 113, b: 76 }, { r: 235, g: 214, b: 170 }, broad * 0.65 + bands * 0.22);
        image.data[offset] = clampByte(color.r);
        image.data[offset + 1] = clampByte(color.g);
        image.data[offset + 2] = clampByte(color.b);
        image.data[offset + 3] = clampByte(alpha * 255);
      }
    }
    context.putImageData(image, 0, 0);
  });
}

function createSunTexture(): THREE.CanvasTexture {
  const seed = hashSeed('sun-surface');
  return paintPixelTexture(768, 384, (u, v) => {
    const granulation = waveNoise(u, v, seed) * 0.5 + waveNoise(u * 2.8, v * 2.3, seed + 53) * 0.27;
    const latitude = Math.abs(v - 0.5) * 2;
    return mix(
      { r: 255, g: 119, b: 17 },
      { r: 255, g: 239, b: 117 },
      Math.max(0.12, Math.min(0.94, 0.66 + granulation * 0.28 - latitude * 0.05)),
    );
  });
}

function createSunHaloTexture(): THREE.CanvasTexture {
  return canvasTexture(512, 512, (context, canvas) => {
    const center = canvas.width / 2;
    const gradient = context.createRadialGradient(center, center, 0, center, center, center);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.12, 'rgba(255,244,190,0.92)');
    gradient.addColorStop(0.32, 'rgba(255,167,42,0.48)');
    gradient.addColorStop(0.62, 'rgba(255,101,18,0.12)');
    gradient.addColorStop(1, 'rgba(255,80,10,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
  });
}

function atmosphereMaterial(color: number, glowStrength = 0.7, rimPower = 2.35): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(color) },
      glowStrength: { value: glowStrength },
      rimPower: { value: rimPower },
    },
    vertexShader: `
      varying float vIntensity;
      uniform float rimPower;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vec3 transformedNormal = normalize(normalMatrix * normal);
        vec3 viewDirection = normalize(-mvPosition.xyz);
        vIntensity = pow(max(0.0, 1.0 - dot(transformedNormal, viewDirection)), rimPower);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      uniform float glowStrength;
      varying float vIntensity;
      void main() {
        gl_FragColor = vec4(glowColor, clamp(vIntensity * glowStrength, 0.0, 1.0));
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
}

export function createSolarVisualAssets(
  renderer: THREE.WebGLRenderer,
  planets: readonly PlanetDefinition[],
): SolarVisualAssets {
  const textures: THREE.Texture[] = [];
  const materials: THREE.Material[] = [];
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const planetMaterials = new Map<string, THREE.MeshStandardMaterial>();
  const atmosphereMaterials = new Map<string, THREE.ShaderMaterial>();

  planets.forEach((planet) => {
    const map = createPlanetTexture(planet.id);
    map.anisotropy = anisotropy;
    textures.push(map);
    const material = new THREE.MeshStandardMaterial({
      map,
      color: 0xffffff,
      roughness: planet.id === 'earth' ? 0.74 : planet.id === 'venus' ? 0.93 : planet.id === 'jupiter' || planet.id === 'saturn' ? 0.86 : 0.8,
      metalness: 0,
    });
    if (planet.id === 'mercury' || planet.id === 'earth' || planet.id === 'mars') {
      const bumpMap = createBumpTexture(planet.id);
      bumpMap.colorSpace = THREE.NoColorSpace;
      bumpMap.anisotropy = anisotropy;
      textures.push(bumpMap);
      material.bumpMap = bumpMap;
      material.bumpScale = planet.id === 'mercury' ? 0.085 : planet.id === 'mars' ? 0.055 : 0.025;
    }
    planetMaterials.set(planet.id, material);
    materials.push(material);
  });

  const cloudMap = createEarthCloudTexture();
  cloudMap.anisotropy = anisotropy;
  textures.push(cloudMap);
  const earthCloudMaterial = new THREE.MeshStandardMaterial({
    map: cloudMap,
    transparent: true,
    opacity: 0.83,
    depthWrite: false,
    roughness: 1,
    metalness: 0,
    alphaTest: 0.035,
  });
  materials.push(earthCloudMaterial);

  const ringMap = createSaturnRingTexture();
  ringMap.anisotropy = anisotropy;
  textures.push(ringMap);
  const saturnRingMaterial = new THREE.MeshStandardMaterial({
    map: ringMap,
    transparent: true,
    alphaTest: 0.025,
    opacity: 0.94,
    side: THREE.DoubleSide,
    roughness: 0.92,
    metalness: 0,
    depthWrite: false,
  });
  materials.push(saturnRingMaterial);

  const atmosphereProfiles: Record<string, { color: number; strength: number; power: number }> = {
    venus: { color: 0xffc36d, strength: 0.78, power: 2.2 },
    earth: { color: 0x48aaff, strength: 0.86, power: 2.35 },
    mars: { color: 0xe07945, strength: 0.48, power: 2.5 },
    jupiter: { color: 0xffc89d, strength: 0.43, power: 2.55 },
    saturn: { color: 0xf2d5a0, strength: 0.36, power: 2.65 },
    uranus: { color: 0x8cecff, strength: 0.5, power: 2.45 },
    neptune: { color: 0x397cff, strength: 0.62, power: 2.35 },
  };
  Object.entries(atmosphereProfiles).forEach(([id, profile]) => {
    const material = atmosphereMaterial(profile.color, profile.strength, profile.power);
    atmosphereMaterials.set(id, material);
    materials.push(material);
  });

  const sunMap = createSunTexture();
  sunMap.anisotropy = anisotropy;
  textures.push(sunMap);
  const sunMaterial = new THREE.MeshBasicMaterial({ map: sunMap, color: 0xffffff, toneMapped: false });
  materials.push(sunMaterial);

  const haloMap = createSunHaloTexture();
  textures.push(haloMap);
  const sunHaloMaterial = new THREE.SpriteMaterial({
    map: haloMap,
    color: 0xff9b2f,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  materials.push(sunHaloMaterial);

  materials.forEach((material) => {
    material.userData.resourceOwner = 'solar-visual-assets';
  });

  return {
    planetMaterials,
    atmosphereMaterials,
    earthCloudMaterial,
    saturnRingMaterial,
    sunMaterial,
    sunHaloMaterial,
    dispose() {
      textures.forEach((texture) => texture.dispose());
      materials.forEach((material) => material.dispose());
    },
  };
}
