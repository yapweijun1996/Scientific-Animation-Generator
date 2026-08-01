import { strToU8, zipSync } from 'fflate';
import type { TemplateSnapshot } from '../core/template-protocol';
import { APP_VERSION } from '../core/app-config';
import { createStandaloneHtml } from './standalone-export';
import {
  loadTextureBytes,
  loadTextureDataUrls,
  PLANET_TEXTURE_FILES,
  textureFilename,
  type PlanetTextureKey,
} from './planet-texture-export';

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export async function downloadSourceZip(snapshot: TemplateSnapshot): Promise<void> {
  // index.html embeds textures as data URLs (via textureSources) so it opens directly from
  // disk with no server: browsers block WebGL texImage2D reads from file:// image files as a
  // cross-origin security violation, which would otherwise silently drop every planet texture.
  const [textureBytes, textureSources] = await Promise.all([loadTextureBytes(), loadTextureDataUrls()]);
  const archive: Record<string, Uint8Array> = {};

  for (const key of Object.keys(PLANET_TEXTURE_FILES) as PlanetTextureKey[]) {
    const bytes = textureBytes[key];
    if (!bytes) continue;
    const filename = textureFilename(key);
    archive[`assets/planets/${filename}`] = bytes;
  }

  const html = createStandaloneHtml(snapshot, textureSources);
  const project = JSON.stringify(
    { format: 'scienceproject', formatVersion: 1, createdAt: new Date().toISOString(), snapshot },
    null,
    2,
  );
  const attribution = `# Planet Texture Attribution\n\nPlanet textures by Solar System Scope / INOVE, licensed under Creative Commons Attribution 4.0 International (CC BY 4.0).\nSource: https://www.solarsystemscope.com/textures/\nLicense: https://creativecommons.org/licenses/by/4.0/\n\nThe texture collection is based on NASA imagery and elevation data, with additional author modifications where documented by the source.\n\n## Moon\n\nThe v${APP_VERSION} Moon surface, maria, crater albedo, height and normal detail are generated locally and deterministically by this project. No third-party Moon texture asset is included.\n`;
  const readme = `# Scientific Animation Export v${APP_VERSION}\n\nOpen index.html directly in a modern browser. Planet textures are embedded inside index.html as data URLs, so it works fully offline, double-clicked straight from disk, with no local server required.\n\nFiles:\n- index.html: zero-CDN interactive animation with the Planet Polish and Moon Pass, textures embedded inline\n- assets/planets/: the same real planet texture maps as plain image files, provided for reference and reuse outside this export (not loaded by index.html)\n- project.scienceproject: editable project snapshot, including Moon focus state\n- ATTRIBUTION.md: planet texture source/license and Moon asset declaration\n\nMoon Pass features:\n- Earth-child Moon hierarchy and readable orbit\n- deterministic 27.3-day orbit and tidal locking\n- locally generated cratered lunar albedo and relief\n- natural Moon phases from scene lighting\n- Moon label and focus controls\n\nThe Moon surface is generated locally inside index.html. No Moon image file or online dependency is required. Existing planet maps, Earth layers, Saturn rings and attribution handling are preserved.\n\nThis educational visualization uses rounded orbital constants and compressed visual distances and is not suitable for navigation.\n`;

  archive['index.html'] = strToU8(html);
  archive['project.scienceproject'] = strToU8(project);
  archive['README.md'] = strToU8(readme);
  archive['ATTRIBUTION.md'] = strToU8(attribution);

  const zipped = zipSync(archive, { level: 6 });
  downloadBlob(new Blob([zipped], { type: 'application/zip' }), `solar-system-source-v${APP_VERSION}.zip`);
}
