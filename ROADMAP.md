# ROADMAP.md — Release Roadmap

**Document status:** Synced with codebase on 2026-07-31
**Stable public version:** v0.6.0 · **Workspace candidate:** v0.7.0 (blocked)
**Related documents:** [DESIGN.md](DESIGN.md) · [SPEC.md](SPEC.md) · [EPIC.md](EPIC.md) · [TASK.md](TASK.md)

```
v0.4.2 ── v0.4.3 ── v0.4.4 ── v0.5.0 ── v0.6.0 ── v0.7.0 ── v0.8 ── (backlog)
  Moon    Arch.    Shared    Mobile+   Learn+    Travel   Mission
  pass    refactor runtime   Time      Observe   (RC ⛔)   Systems
  ✅ 07-28 ✅ 07-28  ✅ 07-29  ✅ 07-29  ✅ 07-30   🟡 now    ⬜ next
```

---

## Shipped

| Version | Date | Theme | Highlights |
|---|---|---|---|
| v0.4.2 | 2026-07-28 | Moon pass | Earth-child Moon, tidal locking, generated lunar maps, Canvas parity |
| v0.4.3 | 2026-07-28 | Architecture refactor | Shared orbital domain, typed celestial catalog, deterministic domain tests, pinned deps |
| v0.4.4 | 2026-07-29 | Standalone runtime | Generated standalone bundle, texture packaging fix, asset-size validation, 3-browser QA matrix, post-publish HTTPS gate |
| v0.5.0 | 2026-07-29 | Mobile Immersion & Time Foundation | Full-canvas mobile UI, floating Control button, Control Center, SimulationClock, presets/reverse time, asteroid belt |
| v0.6.0 | 2026-07-30 | Scientific Learning & Observation | Learn modules, event catalogue, object science, observer locations, 3 scale modes, provenance/accuracy UI, privacy+licence. **Current stable public release.** |

## In flight — v0.7.0 "Spacecraft Travel" (release candidate)

**Implementation complete; publication blocked.**

- All static/package gates pass: lint 0 errors, typecheck 0 errors, production build, asset validation, scientific regression 13/13, Travel domain regression, PWA 19/19.
- Targeted browser gates pass: Chromium WebGL, WebKit WebGL, Firefox forced-Canvas, Firefox direct-file standalone — all with zero console/page/request/HTTP errors.
- ⛔ **Blocker:** one clean consolidated 22-shard matrix is mandatory before overwriting the stable URL, and the shared QA host is currently unstable (delayed duplicate Playwright commands, Chromium page crashes, WebKit navigation timeouts — failures occur before application assertions).

**Path to publish (in order):**
1. Clear shared Playwright queue/process state on the QA host.
2. Start exactly **one** consolidated matrix (`npm test`, 22 shards).
3. All shards complete with evidence; zero console/page/request/HTTP errors.
4. Rebuild final docs/package; create and verify candidate backup.
5. Publish to stable URL; run post-publish HTTPS asset/browser checks.
6. Create verified online v0.7 recovery point; update KB-MCP; close `task_010`.

**Rollback safety:** v0.6.0 backup `backup_2206707b-dc7_ms7fomwl`; procedure in `workspace/public/release/v0.7.0-rollback.md`.

## Next — v0.8 "Advanced Mission Systems" (planned, not started)

Prerequisite: v0.7.0 published and verified.

Scope (master spec §16, §23): selectable instruments; deterministic mission science dashboard; communication delay, command queue, data downlink; energy management; thermal control; radiation & space weather (offline historical/teaching scenarios, optional live updates); condition-based failures and risk; raw-data and teaching-report export.

## Backlog (specified, unscheduled)

Ordered roughly by dependency, not commitment:

1. High-precision ephemeris provider behind existing `AstronomyEngine` interface (Worker/WASM) + advanced corrections.
2. Offline data packages: OfflinePackageManager, checksum/schema validation, storage UI, recoverable previous versions.
3. Full Ground Observer View: draggable sky, atmospheric scattering & light-pollution toggles (visibility-only effects).
4. Advanced time standards (UTC/TT/TDB/JD), Julian/Gregorian + BCE/CE calendar support.
5. Sound system (ambient/UI/spacecraft/narration), muted by default, per-category volume.
6. Localisation: Simplified Chinese first; locale-aware units/dates.
7. Travel extensions: Lambert solver → Direct transfer; patched-conic/N-body → Gravity assist; lander/rover/probe/sample-return; cockpit camera; non-Earth origins.
8. Role profiles (Student/Teacher/Explorer).

## Standing constraints for every future release

- Preserve: PWA offline, zero-CDN standalone HTML, ZIP export, `.scienceproject` compatibility or documented migration, WebGL + Canvas parity, responsive 3-browser support (master spec §20, §25).
- Scientific regression beyond threshold **blocks release**.
- Stable URL is only overwritten after a clean consolidated matrix + post-publish verification.
