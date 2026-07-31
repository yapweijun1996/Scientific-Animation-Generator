import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const appConfig = readFileSync(join(root, 'src/core/app-config.ts'), 'utf8');
const version = appConfig.match(/APP_VERSION\s*=\s*'([^']+)'/)?.[1];
if (!version) throw new Error('Unable to determine APP_VERSION.');

const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
if (packageJson.version !== version) {
  throw new Error(`package.json version ${packageJson.version} differs from APP_VERSION ${version}.`);
}

const generatedPath = join(root, 'src/standalone/generated-runtime.ts');
if (!existsSync(generatedPath)) throw new Error('Generated standalone runtime module is missing.');
const generated = readFileSync(generatedPath, 'utf8');
const generatedVersion = generated.match(/GENERATED_STANDALONE_RUNTIME_VERSION\s*=\s*['"]([^'"]+)['"]/)?.[1];
if (generatedVersion !== version) {
  throw new Error(
    `Generated standalone runtime version ${generatedVersion ?? 'missing'} differs from application version ${version}.`,
  );
}
const bytes = Number(generated.match(/GENERATED_STANDALONE_RUNTIME_BYTES = (\d+)/)?.[1] ?? 0);
if (bytes < 100_000) throw new Error(`Generated standalone runtime is unexpectedly small: ${bytes} bytes.`);

const exportSource = readFileSync(join(root, 'src/export/standalone-export.ts'), 'utf8');
if (Buffer.byteLength(exportSource) > 8_000) {
  throw new Error('standalone-export.ts exceeded the orchestration-only size guard.');
}
for (const forbidden of ['threeModuleSource', 'const PLANETS=', 'const MOON=', 'solveM(', 'moonTextureBundle']) {
  if (exportSource.includes(forbidden)) {
    throw new Error(`standalone-export.ts still contains duplicated runtime logic: ${forbidden}`);
  }
}

const dist = join(root, 'dist');
if (!existsSync(dist)) throw new Error('Production dist directory is missing.');
const files = [];
function walk(directory) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) walk(path);
    else files.push(path);
  }
}
walk(dist);

const requiredPlanetAssets = {
  'assets/planets/high/mercury.jpg': 872555,
  'assets/planets/high/venus-surface.jpg': 885075,
  'assets/planets/high/venus-atmosphere.jpg': 229696,
  'assets/planets/high/earth-day.jpg': 463087,
  'assets/planets/high/earth-night.jpg': 255287,
  'assets/planets/high/earth-clouds.jpg': 965676,
  'assets/planets/high/mars.jpg': 750547,
  'assets/planets/high/jupiter.jpg': 498976,
  'assets/planets/high/saturn.jpg': 199916,
  'assets/planets/high/saturn-ring.png': 12119,
  'assets/planets/high/uranus.jpg': 77751,
  'assets/planets/high/neptune.jpg': 241580,
  'assets/planets/attribution-manifest.json': 5604,
};
for (const [relativePath, expectedBytes] of Object.entries(requiredPlanetAssets)) {
  const sourcePath = join(root, 'public', relativePath);
  const outputPath = join(dist, relativePath);
  if (!existsSync(sourcePath)) throw new Error(`Source planet asset is missing: public/${relativePath}`);
  if (!existsSync(outputPath)) throw new Error(`Production planet asset is missing: dist/${relativePath}`);
  const sourceBytes = statSync(sourcePath).size;
  const outputBytes = statSync(outputPath).size;
  if (sourceBytes !== expectedBytes || outputBytes !== expectedBytes) {
    throw new Error(
      `${relativePath} size mismatch: source=${sourceBytes}, dist=${outputBytes}, expected=${expectedBytes}.`,
    );
  }
}

const javascript = files.filter((path) => path.endsWith('.js'));
const embeddedChunk = javascript.find((path) => {
  const source = readFileSync(path, 'utf8');
  return source.includes('__SCIENCE_STANDALONE_RUNTIME_VERSION__') && source.includes(version);
});
if (!embeddedChunk) {
  throw new Error('Production output does not contain the generated standalone runtime source.');
}

console.log(JSON.stringify({
  version,
  generatedRuntimeBytes: bytes,
  standaloneExportBytes: Buffer.byteLength(exportSource),
  embeddedChunk: embeddedChunk.slice(root.length + 1),
  productionFiles: files.length,
  verifiedPlanetAssets: Object.keys(requiredPlanetAssets).length,
}, null, 2));
