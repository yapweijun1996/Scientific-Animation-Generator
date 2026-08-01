import type { TemplateSnapshot } from '../core/template-protocol';
import { APP_NAME, APP_VERSION } from '../core/app-config';
import {
  GENERATED_STANDALONE_RUNTIME_SOURCE,
  GENERATED_STANDALONE_RUNTIME_VERSION,
} from '../standalone/generated-runtime';
import {
  STANDALONE_CONFIG_KEY,
  type StandaloneRuntimeConfig,
  type StandaloneTextureSources,
} from '../standalone/standalone-types';
import { loadTextureDataUrls } from './planet-texture-export';
import { createI18n, normalizeLocale, type AppLocale } from '../i18n';

export type { StandaloneTextureSources } from '../standalone/standalone-types';

function safeJson(value: unknown): string {
  return JSON.stringify(value)
    .replaceAll('<', '\\u003c')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029');
}

function safeScriptSource(source: string): string {
  return source
    .replace(/<\/script/gi, '<\\/script')
    .replaceAll('<!--', '<\\!--')
    .replaceAll('-->', '--\\>');
}

function assertGeneratedRuntime(): void {
  if (!GENERATED_STANDALONE_RUNTIME_SOURCE) {
    throw new Error('The generated standalone runtime bundle is missing. Run the documented build command.');
  }
  if (GENERATED_STANDALONE_RUNTIME_VERSION !== APP_VERSION) {
    throw new Error(
      `Generated standalone runtime v${GENERATED_STANDALONE_RUNTIME_VERSION} does not match application v${APP_VERSION}.`,
    );
  }
}

export function createStandaloneHtml(
  snapshot: TemplateSnapshot,
  textureSources: StandaloneTextureSources = {},
  localeInput: AppLocale = 'en',
): string {
  assertGeneratedRuntime();
  if (snapshot.templateVersion !== APP_VERSION) {
    throw new Error(`Snapshot v${snapshot.templateVersion} cannot be exported by application v${APP_VERSION}.`);
  }

  const locale = normalizeLocale(localeInput);
  const i18n = createI18n(locale);
  const config: StandaloneRuntimeConfig = {
    version: APP_VERSION,
    locale,
    snapshot,
    textures: textureSources,
  };
  const runtimeSource = safeScriptSource(GENERATED_STANDALONE_RUNTIME_SOURCE);

  return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#020610">
<meta name="application-name" content="${i18n.t('app.name')}">
<title>${i18n.t('app.explorer')} · v${APP_VERSION}</title>
</head>
<body>
<div id="app" aria-live="polite">${i18n.t('app.startingStandalone')}</div>
<noscript>${locale === 'zh-CN' ? '此独立动画需要 JavaScript，但不需要网络连接。' : 'This standalone animation requires JavaScript, but it does not require a network connection.'}</noscript>
<!-- Planet textures: Solar System Scope / INOVE, CC BY 4.0. Moon textures are generated locally and deterministically. -->
<script>
globalThis[${safeJson(STANDALONE_CONFIG_KEY)}]=${safeJson(config)};
${runtimeSource}
</script>
</body>
</html>`;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export async function downloadStandaloneHtml(snapshot: TemplateSnapshot, locale: AppLocale = 'en'): Promise<void> {
  const textures = await loadTextureDataUrls();
  const html = createStandaloneHtml(snapshot, textures, locale);
  const localeSuffix = locale === 'zh-CN' ? '-zh-CN' : '';
  downloadBlob(new Blob([html], { type: 'text/html' }), `solar-system-animation-v${APP_VERSION}${localeSuffix}.html`);
}
