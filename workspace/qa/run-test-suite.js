import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { join, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const root = resolve(process.cwd());
const lockDirectory = join(root, 'qa-evidence');
const lockPath = join(lockDirectory, 'qa-test.lock');
const legacyLockPath = join(root, '.qa-test.lock');
const runId = `${new Date().toISOString().replace(/[:.]/g, '-')}-${process.pid}`;
const maximumLockAgeMs = 30 * 60 * 1000;
const originalParentPid = process.ppid;
const skipPrebuild = process.env.QA_SKIP_PREBUILD === '1';
let lockFd;
let released = false;
let activeChild;
let shuttingDown = false;
let parentWatch;

function readLock(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return undefined;
  }
}

function processExists(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    const state = readFileSync(`/proc/${pid}/status`, 'utf8').match(/^State:\s+(\w)/m)?.[1];
    return state !== 'Z';
  } catch {
    return false;
  }
}

function processIsQaSuite(pid) {
  if (!processExists(pid)) return false;
  try {
    const commandLine = readFileSync(`/proc/${pid}/cmdline`, 'utf8').replaceAll('\0', ' ');
    return commandLine.includes('qa/run-test-suite.js');
  } catch {
    return false;
  }
}

function lockIsActive(lock) {
  if (!lock || !processIsQaSuite(lock.pid)) return false;
  const startedAt = Date.parse(lock.startedAt ?? '');
  return Number.isFinite(startedAt) && Date.now() - startedAt < maximumLockAgeMs;
}

function clearStaleLock(path) {
  if (!existsSync(path)) return;
  const lock = readLock(path);
  if (lockIsActive(lock)) {
    throw new Error(`Another QA suite is already running (pid ${lock.pid}, run ${lock.runId ?? 'unknown'}).`);
  }
  rmSync(path, { force: true });
}

function acquireLock() {
  mkdirSync(lockDirectory, { recursive: true });
  clearStaleLock(legacyLockPath);
  clearStaleLock(lockPath);
  lockFd = openSync(lockPath, 'wx');
  writeFileSync(
    lockFd,
    JSON.stringify({ pid: process.pid, parentPid: originalParentPid, runId, startedAt: new Date().toISOString() }, null, 2),
    'utf8',
  );
}

function releaseLock() {
  if (released) return;
  released = true;
  if (parentWatch) {
    clearInterval(parentWatch);
    parentWatch = undefined;
  }
  if (lockFd !== undefined) {
    closeSync(lockFd);
    lockFd = undefined;
  }
  rmSync(lockPath, { force: true });
}

function signalExitCode(signal) {
  return signal === 'SIGINT' ? 130 : signal === 'SIGHUP' ? 129 : 143;
}

function killActiveProcessGroup(signal) {
  const child = activeChild;
  if (!child?.pid) return false;
  try {
    if (process.platform === 'win32') child.kill(signal);
    else process.kill(-child.pid, signal);
    return true;
  } catch {
    try {
      child.kill(signal);
      return true;
    } catch {
      return false;
    }
  }
}

async function shutdownFromSignal(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  const child = activeChild;
  killActiveProcessGroup(signal);
  if (child) {
    await Promise.race([once(child, 'exit').catch(() => undefined), delay(4_000)]);
    if (activeChild) {
      killActiveProcessGroup('SIGKILL');
      await Promise.race([once(child, 'exit').catch(() => undefined), delay(1_000)]);
    }
  }
  releaseLock();
  process.exit(signalExitCode(signal));
}

function run(command, args) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, {
      cwd: root,
      env: { ...process.env, QA_RUN_ID: runId },
      stdio: 'inherit',
      shell: false,
      detached: process.platform !== 'win32',
    });
    activeChild = child;
    child.once('error', (error) => {
      if (activeChild === child) activeChild = undefined;
      rejectRun(error);
    });
    child.once('exit', (code, signal) => {
      if (activeChild === child) activeChild = undefined;
      if (signal) {
        rejectRun(new Error(`${command} ${args.join(' ')} ended with signal ${signal}.`));
      } else if (code !== 0) {
        rejectRun(new Error(`${command} ${args.join(' ')} failed with exit code ${code ?? 'unknown'}.`));
      } else {
        resolveRun();
      }
    });
  });
}

for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.once(signal, () => void shutdownFromSignal(signal));
}

parentWatch = setInterval(() => {
  if (shuttingDown) return;
  if (process.ppid !== originalParentPid || !processExists(originalParentPid)) {
    void shutdownFromSignal('SIGTERM');
  }
}, 500);

acquireLock();
try {
  if (!skipPrebuild) {
    await run('npm', ['run', 'build']);
    await run(process.execPath, ['qa/cleanup-generated.js']);
    await run('npm', ['exec', '--', 'vite', 'build', '--config', 'qa/export-vite.config.js']);
    await run('npm', ['exec', '--', 'vite', 'build', '--config', 'qa/domain-vite.config.js']);
    await run(process.execPath, ['qa/export-smoke.js']);
    await run(process.execPath, ['qa/domain-smoke.js']);
  }
  await run(process.execPath, ['qa/browser-qa.js']);
  await run(process.execPath, ['qa/cleanup-generated.js']);
  console.log(`QA suite completed successfully · ${runId}`);
} catch (error) {
  if (!shuttingDown) {
    console.error(error instanceof Error ? error.stack ?? error.message : String(error));
    process.exitCode = 1;
  }
} finally {
  if (!shuttingDown) releaseLock();
}
