# TASK.md — Task Status Board

**Document status:** Synced with codebase on 2026-07-31 (post dropdown / texture-gate / render-loop fixes)
**Active task:** `task_010 — v0.7 Spacecraft Travel` (blocked at publication gate)
**Related documents:** [DESIGN.md](DESIGN.md) · [SPEC.md](SPEC.md) · [EPIC.md](EPIC.md) · [ROADMAP.md](ROADMAP.md)

---

## 🟡 Active — task_010: v0.7 Spacecraft Travel

**Status:** Release candidate complete · **Publication BLOCKED** · Stable URL remains v0.6.0

### Completed work

- [x] Travel Mode: Earth origin, 8 destinations + Earth-orbit rehearsal, Fly-by/Orbiter types
- [x] `TrajectoryEngine`: deterministic Hohmann planner (launch window, duration, path, phase residual, Delta-v)
- [x] `MissionStateMachine`: waiting/departure/cruise/correction/approach/insertion/complete + key-event auto-pause
- [x] Follow (Near/Standard/Far) + Free cameras, persisted across save/reload
- [x] Optional Advanced fuel realism, infeasible-budget rejection
- [x] Fail-closed Direct/Gravity-assist rejection with scientific explanation
- [x] WebGL spacecraft visual + Canvas 2D parity
- [x] Mission state in `.scienceproject`, standalone HTML, ZIP exports
- [x] PWA cache advanced to `science-animator-v14-spacecraft-travel`
- [x] QA-driven fixes (all verified):
  - lazy Travel resource creation (Explore startup protected)
  - serialized project saves (stale-autosave overwrite prevented)
  - visibility-aware throttled dashboard + trailing refresh (no stale paused progress)
  - bounded IndexedDB open/blocked/abort/error paths
  - headless Chromium QA stabilisation flags
- [x] Static gates: lint 0 / typecheck 0 / production build / asset validation / PWA 19/19
- [x] Scientific regression inherited from v0.6: 13/13
- [x] Travel domain regression (Mars baseline ~244.13 d, ~4.90 km/s, ~0.000351 AU)
- [x] Targeted browser gates with evidence (all zero-error):
  - Chromium WebGL: `qa-evidence/travel-browser/2026-07-31T00-12-50-712Z-chromium-auto-92768/`
  - WebKit WebGL: `qa-evidence/travel-browser/2026-07-31T00-05-39-105Z-webkit-auto-92290/`
  - Firefox forced-Canvas: `qa-evidence/travel-browser/2026-07-30T23-36-03-457Z-firefox-canvas-89343/`
  - Firefox direct-file standalone: `qa-evidence/travel-standalone/2026-07-31T00-58-01-307Z-firefox-canvas-99468/`
- [x] Release documents: QA report, release notes, scientific report, compare, rollback (`workspace/public/review/`, `workspace/public/release/`)

### Post-QA-report fixes (2026-07-31, after the v0.7.0 QA report above was written)

- [x] Fixed invisible native `<select>` dropdown options (Render quality, Focus, Unit-per-second, Travel controls, etc.): added `color-scheme: dark` to `:root` and an explicit `option { background: var(--panel-raised); color: var(--text) }` rule in `workspace/src/style.css`. Verified in Chrome DevTools MCP — computed `option` background `rgb(16,36,58)` / text `rgb(237,246,255)`.
- [x] Removed a `localhost`/`127.0.0.1` development gate in `real-planet-textures.ts` that silently skipped **all** real planet photo textures (Earth, Mars, Jupiter, Saturn, etc.) and rendered only procedural placeholder maps, even at High detail quality. Real textures now load the same way locally and on the published host. The `catch {}` that swallowed texture-load failures now logs via `console.warn`.

- [x] Converted both renderers to on-demand rendering. `animate()` in `runtime.ts` and `canvas-fallback.ts` re-armed `requestAnimationFrame` unconditionally, so a paused scene never stopped drawing; it now re-arms only while playing or while OrbitControls damping settles, with a `requestRender()` helper wired to every state-changing entry point. Decorative motion (Sun rotation, halo, starfield, spacecraft pulse) advances only while playing.
- [x] Removed per-frame forced synchronous layout from both label passes (`updateLabels()` in `runtime.ts`, `updateLabel()` in `spacecraft-mission-visual.ts`): they wrote styles then read `clientWidth`/`clientHeight` the next frame. Now they read cached viewport sizes, reuse a scratch `THREE.Vector3` and reusable arrays instead of allocating per frame, and write label styles only when a value changed.
- Measured (Chrome DevTools traces): forced reflow while playing 102 ms → ForcedReflow insight no longer raised; paused scene went from `animate` still running with 72 ms reflow → trace with no main-thread activity.
- [x] **Fixed planets rendering collapsed on the Sun at the origin.** The orbital buffers stayed zero-filled until the simulation Worker's first message; a Worker that never starts fires no `error` event, so the scene silently stayed collapsed forever. The runtime now seeds positions/rotations synchronously from the shared orbital model at mount (Worker still authoritative once it reports) and a 4 s watchdog surfaces `Simulation Worker slow to start · using main-thread positions`. Verified: eight planets at correct increasing heliocentric distances (Mercury 2.72 → Neptune 26.26) even with the Worker stalled.
- [x] Added the on-screen FPS meter (viewport header, colour-coded, shows `idle` when a paused scene stops rendering) via a new optional `onFrameRendered` context callback — deliberately not self-driven by `requestAnimationFrame`, which would defeat on-demand rendering.
- ⏳ **Not yet verified:** camera drag feel, full Travel mission run, and Canvas-fallback interaction after the render-loop change. Needs a manual pass before the matrix run.

**Harness note:** `python -m http.server` is unsuitable for previewing this app — it is single-threaded and stalls concurrent asset requests. Use the project's own `npm run dev` / `npm run preview` (Vite). Separately, an occluded Chrome window freezes the renderer hard enough to throttle `requestAnimationFrame` to 1 Hz **and prevent Web Workers from starting at all** (verified: a trivial inline `postMessage` worker also times out), while `document.hasFocus()` and `visibilityState` still report `true`/`visible`. Any browser QA that loads the app in a background or occluded window will observe a frozen simulation that is not an application defect.

**⚠️ QA-harness implication:** while the simulation is *playing* the page renders continuously by design and never reaches a CPU-idle window. Lighthouse previously returned `runtimeError: PAGE_HUNG` against it while `evaluate_script` succeeded moments later — the page was responsive, just never quiet. Playwright idle waits, screenshots and script evaluation can time out the same way. **Browser QA should pause the simulation before asserting.** This is a strong candidate explanation for the consolidated-matrix failures currently attributed to shared-host instability, and should be re-tested under that hypothesis rather than assumed to be the host.

**⚠️ QA-validity implication:** because the removed gate only skipped real textures on `localhost`, and every browser QA run (including the 4 targeted gates listed above and the entire v0.6/v0.7 release history) executes against a localhost server, **all prior QA evidence only ever exercised the procedural placeholder texture path** — never the real-photo pipeline end users see on the published site. This is a newly discovered gap, not a regression from today's fix. The 4 targeted Travel browser gates above must be treated as **stale pending re-run**; they did not previously renders real textures.

### ⛔ Blocker

Shared QA host is unstable: delayed duplicate `npm test` commands launch after cancellation, concurrent Playwright processes compete for memory/GPU, Chromium crashes before `DOMContentLoaded`, WebKit navigation timeouts — all **before application assertions**. Targeted gates pass, so evidence points to the QA execution environment, but the consolidated 22-shard matrix remains mandatory.

### Pending (in order — do not reorder)

- [ ] 1. Confirm shared Playwright queue/process state is clear
- [ ] 2. Run exactly **one** consolidated matrix (`npm test` → 22 shards) — this run is also the first to validate the real-texture pipeline now that the localhost gate is removed
- [ ] 3. Verify all shards pass with evidence; zero console/page/request/HTTP errors; confirm real planet textures (not procedural placeholders) render in the QA screenshots
- [ ] 4. Rebuild final docs/package; create and verify candidate backup
- [ ] 5. Publish to stable URL (overwrite `published/`)
- [ ] 6. Post-publish HTTPS asset/browser verification
- [ ] 7. Create verified online v0.7 recovery point
- [ ] 8. Update KB-MCP; close `task_010`

**Rollback if publication goes wrong:** v0.6.0 backup `backup_2206707b-dc7_ms7fomwl` · procedure: `workspace/public/release/v0.7.0-rollback.md`

---

## ✅ Completed tasks (release history)

| Task | Version | Published | Key evidence |
|---|---|---|---|
| v0.6 Scientific Learning & Observation | v0.6.0 | 2026-07-30 | Matrix 17/17 shards, 9/9 combos; scientific regression 13/13 (31 events); `workspace/public/review/v0.6.0-qa-report.md` |
| v0.5 Mobile Immersion & Time Foundation | v0.5.0 | 2026-07-29 | 3 browsers × 3 viewports; PWA 19/19; a11y zero violations; `workspace/public/review/v0.5.0-qa-report.md` |
| v0.4.4 Standalone runtime + packaging repair | v0.4.4 | 2026-07-29 | Post-404 texture repair rerun, all `httpErrors` empty; `workspace/public/review/v0.4.4-qa-report.md` |
| v0.4.3 Architecture refactor | v0.4.3 | 2026-07-28 | Deterministic domain tests; `workspace/public/review/v0.4.3-qa-report.md` |
| v0.4.2 Moon pass | v0.4.2 | 2026-07-28 | `workspace/public/review/v0.4.2-qa-report.md` |

## ⬜ Next task (not started)

**v0.8 Advanced Mission Systems** — blocked on v0.7.0 publication. Scope in [EPIC.md](EPIC.md) Epic 4 and [ROADMAP.md](ROADMAP.md).

## Standing rules for any task in this repo

1. `workspace/` is the development tree; `published/` is the stable public snapshot — never overwrite `published/` without a clean consolidated matrix + post-publish verification.
2. Every release needs: QA report, release notes, compare, rollback record, release JSON, memory record.
3. Scientific regression beyond threshold blocks release; no fake scientific data ever.
4. All 15 Definition-of-Done items (master spec §25) must pass before task closure.
