import type { TemplateSnapshot } from './template-protocol';

const DATABASE_NAME = 'scientific-animation-generator';
const DATABASE_VERSION = 1;
const STORE_NAME = 'projects';
const LAST_PROJECT_KEY = 'last-project';
const DATABASE_OPEN_TIMEOUT_MS = 6_000;

export interface SavedProject {
  id: string;
  name: string;
  updatedAt: string;
  snapshot: TemplateSnapshot;
}

interface ScienceProjectFile {
  format: 'scienceproject';
  formatVersion: number;
  createdAt: string;
  snapshot: TemplateSnapshot;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function validateSnapshot(value: unknown): TemplateSnapshot {
  if (!isRecord(value)) throw new Error('Project snapshot is missing.');
  if (value.templateId !== 'solar-system-3d') throw new Error('This project uses an unsupported template.');
  if (!isRecord(value.parameters)) throw new Error('Project parameters are invalid.');
  if (typeof value.simulationDays !== 'number' || !Number.isFinite(value.simulationDays)) {
    throw new Error('Project simulation time is invalid.');
  }
  return value as unknown as TemplateSnapshot;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    let settled = false;
    const finish = (callback: () => void): void => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      callback();
    };
    const timeout = window.setTimeout(() => {
      finish(() => reject(new Error('Project storage did not become available within 6 seconds.')));
    }, DATABASE_OPEN_TIMEOUT_MS);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => {
      if (settled) {
        request.result.close();
        return;
      }
      finish(() => resolve(request.result));
    };
    request.onerror = () => {
      finish(() => reject(request.error ?? new Error('Unable to open project storage.')));
    };
    request.onblocked = () => {
      finish(() => reject(new Error('Project storage is temporarily blocked by another open session.')));
    };
  });
}

export async function saveProject(snapshot: TemplateSnapshot): Promise<void> {
  const database = await openDatabase();
  const project: SavedProject = {
    id: LAST_PROJECT_KEY,
    name: 'Solar System Project',
    updatedAt: new Date().toISOString(),
    snapshot,
  };

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).put(project);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error('Unable to save project.'));
      transaction.onabort = () => reject(transaction.error ?? new Error('Project save was aborted.'));
    });
  } finally {
    database.close();
  }
}

export async function loadProject(): Promise<SavedProject | null> {
  const database = await openDatabase();
  try {
    const result = await new Promise<SavedProject | undefined>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readonly');
      const request = transaction.objectStore(STORE_NAME).get(LAST_PROJECT_KEY);
      request.onsuccess = () => resolve(request.result as SavedProject | undefined);
      request.onerror = () => reject(request.error ?? new Error('Unable to load project.'));
      transaction.onabort = () => reject(transaction.error ?? new Error('Project load was aborted.'));
    });
    return result ?? null;
  } finally {
    database.close();
  }
}

export async function importProjectFile(file: File): Promise<TemplateSnapshot> {
  if (file.size > 2_000_000) throw new Error('Project file is larger than the 2 MB safety limit.');

  let parsed: unknown;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    throw new Error('Project file is not valid JSON.');
  }

  if (!isRecord(parsed) || parsed.format !== 'scienceproject' || parsed.formatVersion !== 1) {
    throw new Error('Unsupported .scienceproject format.');
  }

  const projectFile = parsed as unknown as ScienceProjectFile;
  const snapshot = validateSnapshot(projectFile.snapshot);
  await saveProject(snapshot);
  return snapshot;
}

export function downloadProject(snapshot: TemplateSnapshot): void {
  const payload = JSON.stringify(
    {
      format: 'scienceproject',
      formatVersion: 1,
      createdAt: new Date().toISOString(),
      snapshot,
    },
    null,
    2,
  );
  const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'solar-system.scienceproject';
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
