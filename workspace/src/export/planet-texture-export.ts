import {
  PLANET_TEXTURE_FILES,
  type PlanetTextureKey,
} from '../templates/solar-system/planet-texture-catalog';

export { PLANET_TEXTURE_FILES };
export type { PlanetTextureKey };

function textureUrl(filename: string): string {
  return new URL(`assets/planets/high/${filename}`, document.baseURI).href;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('Unable to encode texture.'));
    reader.readAsDataURL(blob);
  });
}

async function fetchTexture(filename: string): Promise<Response> {
  const response = await fetch(textureUrl(filename), { cache: 'force-cache' });
  if (!response.ok) throw new Error(`Texture ${filename} returned ${response.status}.`);
  return response;
}

export async function loadTextureDataUrls(): Promise<Partial<Record<PlanetTextureKey, string>>> {
  const result: Partial<Record<PlanetTextureKey, string>> = {};
  await Promise.all(
    (Object.keys(PLANET_TEXTURE_FILES) as PlanetTextureKey[]).map(async (key) => {
      try {
        const response = await fetchTexture(PLANET_TEXTURE_FILES[key]);
        result[key] = await blobToDataUrl(await response.blob());
      } catch {
        // The shared standalone runtime keeps a procedural fallback for any missing texture.
      }
    }),
  );
  return result;
}

export async function loadTextureBytes(): Promise<Partial<Record<PlanetTextureKey, Uint8Array>>> {
  const result: Partial<Record<PlanetTextureKey, Uint8Array>> = {};
  await Promise.all(
    (Object.keys(PLANET_TEXTURE_FILES) as PlanetTextureKey[]).map(async (key) => {
      try {
        const response = await fetchTexture(PLANET_TEXTURE_FILES[key]);
        result[key] = new Uint8Array(await response.arrayBuffer());
      } catch {
        // ZIP export remains valid and uses procedural fallback for missing textures.
      }
    }),
  );
  return result;
}

export function textureFilename(key: PlanetTextureKey): string {
  return PLANET_TEXTURE_FILES[key];
}
