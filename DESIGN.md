# DESIGN.md — Scientific Animation Generator

**Document status:** Synced with codebase on 2026-07-31 (workspace v0.7.0 release candidate)
**Source of truth:** `workspace/` source code. Where this document and the code disagree, the code wins.
**Related documents:** [SPEC.md](SPEC.md) · [EPIC.md](EPIC.md) · [ROADMAP.md](ROADMAP.md) · [TASK.md](TASK.md) · [workspace/docs/solar-system-explorer-vnext-master-spec.md](workspace/docs/solar-system-explorer-vnext-master-spec.md)

---

## 1. System overview

Scientific Animation Generator (Solar System Explorer) is an offline-first, mobile-first educational web application for exploring the Solar System, learning astronomy and simulating simplified Earth-origin robotic spacecraft missions.

Three experiences share one deterministic simulation core:

| Experience | Purpose | Since |
|---|---|---|
| Explore | Free exploration of Sun, eight planets, Earth's Moon, time and scale | v0.4.x |
| Learn | Guided Moon-phase, eclipse-geometry, seasons and event modules | v0.6.0 |
| Travel | Earth-origin robotic Fly-by/Orbiter mission simulation (Hohmann) | v0.7.0 (candidate) |

## 2. Repository layout

```
Scientific-Animation-Generator/
├── workspace/    # Active development tree (v0.7.0 release candidate)
│   ├── src/          # Application source (TypeScript, no framework)
│   ├── public/       # Static assets, textures, PWA manifest, release evidence
│   ├── qa/           # Playwright browser gates, domain tests, build validation
│   ├── qa-evidence/  # Recorded QA run artifacts (screenshots, JSON results)
│   ├── qa-dist/      # QA build output copy
│   ├── docs/         # Master specification
│   ├── scripts/      # build-standalone-runtime.js generator
│   ├── release(s)/   # Compare, rollback and release JSON records
│   ├── review/       # QA reports and release notes per version
│   └── memory/       # Durable per-release architecture decision records
└── published/    # Snapshot of the stable public deployment (v0.6.0)
```

## 3. Technology stack

| Concern | Choice | Version (pinned) |
|---|---|---|
| Language | TypeScript (strict, `tsc --noEmit` as lint) | 7.0.2 |
| Build | Vite | 7.3.6 |
| 3D renderer | Three.js (WebGL primary) | 0.185.1 |
| 2D fallback | Hand-written Canvas 2D renderer | in-repo |
| ZIP export | fflate | 0.8.3 |
| Browser QA | Playwright (Chromium / Firefox / WebKit) | 1.61.0 |
| Storage | IndexedDB (projects, snapshots), localStorage (presets/preferences) | native |
| Offline | Service Worker PWA, cache `science-animator-v14-spacecraft-travel` | native |

No runtime CDN dependency. No analytics, account system or telemetry in application source.

## 4. Module architecture (`workspace/src/`)

```
src/
├── core/         # SimulationClock, template protocol, project store, app config
├── astronomy/    # AstronomyEngine boundary, baseline Kepler provider,
│                 # event engine, observer location service, object facts,
│                 # learning content, scientific accuracy reporting
├── travel/       # TrajectoryEngine, MissionStateMachine, Travel contracts,
│                 # WebGL spacecraft mission visual
├── editor/       # Editor shell, Control Center, learning controller,
│                 # spacecraft travel controller
├── templates/solar-system/
│                 # Celestial catalog, orbital math, Three.js runtime,
│                 # Canvas fallback, planet visuals/textures, parameter readers
├── standalone/   # Generated offline runtime, standalone UI/bootstrap/types
├── workers/      # Deterministic simulation Worker + factory
└── export/       # Standalone HTML builder, ZIP export, texture export
```

### 4.1 Key domain services (implemented)

- `SimulationClock` (`core/simulation-clock.ts`) — single authoritative time source (epoch 2026-01-01 UTC). All celestial, learning and mission state derives from it. Reverse time recomputes state; it never replays frames.
- `AstronomyEngine` (`astronomy/astronomy-engine.ts` + `baseline-astronomy-engine.ts`) — provider boundary. Installed provider: `project-kepler-educational-v1` (rounded fixed orbital elements, deterministic Kepler solver, Educational Accuracy classification).
- `AstronomicalEventEngine` — new/full/quarter moons, eclipse candidates, conjunction, opposition, perihelion, aphelion; event-time jumping.
- `ObserverLocationService` — named locations, lat/long entry, altitude/azimuth, horizon visibility, local-time comparison. No GPS request on first launch.
- `TrajectoryEngine` (`travel/trajectory-engine.ts`) — Hohmann minimum-energy transfer solving: launch window, duration, transfer path samples, phase residual, idealised impulsive Delta-v plus correction reserve.
- `MissionStateMachine` (`travel/mission-state-machine.ts`) — waiting → departure burn → cruise → correction → approach → insertion/arrival → complete; key-event crossing and optional auto-pause.
- `ProjectStore` (`core/project-store.ts`) — IndexedDB snapshots (`.scienceproject`), **serialized writes** so a stale autosave can never overwrite a newer mission/camera state; bounded open/blocked/abort/error paths that fail into a usable app state.

### 4.2 Rendering design

- **WebGL primary** (Three.js) and **Canvas 2D fallback** share the same orbital math, celestial catalog, distance/size safety rules and mission snapshots — scientific state parity is a hard requirement and is QA-gated.
- Presentation scale (Learning Scale / Real Distance / Real Scale) is strictly separated from simulation state; scale modes never alter calculations.
- Labels use priority-based, collision-aware placement.
- Travel visuals (probe + trajectory) are **lazily created** only after a mission is planned or restored — Explore startup performance is protected.
- Mission dashboard rendering is visibility-aware, throttled, and has a trailing refresh so paused time jumps never leave stale progress on screen.

### 4.3 Standalone runtime generation

`scripts/build-standalone-runtime.js` compiles the shared application runtime into `src/standalone/generated-runtime.ts` before every dev/build/typecheck run. There is **no manually duplicated standalone implementation** (since v0.4.4). Standalone HTML and ZIP exports use the same authoritative HTML builder, embed Worker creation and texture sources, and carry a version gate tied to `APP_VERSION`.

### 4.4 Export contracts

- Single-file standalone HTML: zero CDN, zero HTTP requests when opened via `file://`, includes current Travel plan/camera/mission state (v0.7).
- Source ZIP: full source, data, assets and attribution.
- `.scienceproject` snapshots: play state, signed rate/direction, complexity mode, focus/camera, scale mode, and (v0.7) mission plan, mission type/destination, camera mode, follow distance, realism options.
- v0.6 snapshots without mission data remain valid and open in Explore without creating Travel resources.

## 5. Durable design decisions (from `memory/` records)

1. UI and renderers never own mission mathematics — only `TrajectoryEngine` / `MissionStateMachine` do.
2. Earth is the only mission origin in v0.7; the route engine avoids hard-coding Earth into domain types for future origins.
3. **Fail-closed scientific honesty:** Direct transfer is unavailable until a Lambert boundary-value solver exists; Gravity Assist is unavailable until patched-conic/N-body encounter solving exists. The app never draws invented trajectories.
4. Runtime mission state is authoritative when saving camera/active state.
5. One `MissionSnapshot` contract drives editor, WebGL, Canvas, IndexedDB, standalone HTML and ZIP export.
6. No fake scientific data: no random values presented as measurements, anywhere.
7. Provider upgrades must pass scientific regression before release.

## 6. Scientific model boundaries

- Astronomy baseline: educational Kepler model — for teaching, not navigation or authoritative civil eclipse prediction.
- Principal Moon phases: geocentric Moon–Sun ecliptic longitude difference at 0°/90°/180°/270°; true 3D elongation displayed separately.
- Travel: idealised heliocentric two-body Hohmann only. Intentionally omitted: perturbations/N-body, plane-change optimisation, finite burns, launch-site/ascent geometry, parking-orbit escape, propulsion mass/staging, thermal/radiation/comms/power. Classified **Educational Accuracy**.
- Mars reference baseline: ~244.13 days transfer, ~4.90 km/s simplified Delta-v, ~0.000351 AU intercept residual.

## 7. QA and release architecture

- `qa/` gates: domain regression (deterministic, no browser), production build validation (exact source/dist asset sizes), Travel browser gates (WebGL + forced-Canvas), direct-file standalone gates, PWA audit (19 checks), consolidated release matrix (`npm test` → `qa/run-release-matrix.js`, 22 shards for v0.7).
- Release acceptance requires empty console-error / page-error / failed-request / HTTP-error arrays on every tested page.
- Every release records: QA report, release notes, compare-before-release, rollback point, release JSON, and a memory (decision) record.
- Stable-URL policy: `published/` is only overwritten after one clean consolidated matrix plus post-publish HTTPS verification. Current safe rollback: v0.6.0 backup `backup_2206707b-dc7_ms7fomwl`.

## 8. Privacy, licence, attribution

- All observer presets, coordinates, mission plans and snapshots stay on-device. Hosting-layer Cloudflare Insights beacon is disclosed in `public/PRIVACY.md` (outside project source).
- Application code: proprietary, `UNLICENSED` (`LICENSE.md`).
- Planet textures: third-party, CC BY 4.0 attribution in `public/ATTRIBUTION.md` + `public/assets/planets/attribution-manifest.json`.
