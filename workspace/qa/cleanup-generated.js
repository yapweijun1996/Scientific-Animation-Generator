import { existsSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
for (const directory of ['qa-dist', 'qa-domain-dist']) {
  rmSync(join(root, directory), { recursive: true, force: true });
}

const qaDirectory = join(root, 'qa');
if (existsSync(qaDirectory)) {
  for (const filename of readdirSync(qaDirectory)) {
    if (/^standalone(?:-travel)?-v\d+\.\d+\.\d+-(?:runtime\.js|smoke\.html)$/.test(filename)) {
      rmSync(join(qaDirectory, filename), { force: true });
    }
    if (/^(?:debug|apply|add|fix|patch|cleanup-orphan)-v07-.*\.js$/.test(filename)) {
      rmSync(join(qaDirectory, filename), { force: true });
    }
  }
}
