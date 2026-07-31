# EPIC.md — Programme Epics

**Document status:** Synced with codebase on 2026-07-31
**Current state:** Stable public **v0.6.0** · Workspace release candidate **v0.7.0** (publication blocked — see [TASK.md](TASK.md))
**Related documents:** [DESIGN.md](DESIGN.md) · [SPEC.md](SPEC.md) · [ROADMAP.md](ROADMAP.md) · [TASK.md](TASK.md)

Programme decision (master spec §26): Solar System Explorer vNext is a **phased educational simulation platform**, not a one-release feature expansion. Each epic builds on the shared SimulationClock, AstronomyEngine interface and mobile interaction model.

---

## Epic 0 — Shared Runtime Foundation (v0.4.2 – v0.4.4) — ✅ DONE, published

Goal: a single authoritative runtime with verified offline/export parity.

- v0.4.2: Earth-child Moon hierarchy, deterministic 27.321661-day tidally locked Moon, locally generated lunar surface (no binary Moon textures).
- v0.4.3: pure-data modules, typed celestial catalog, centralized Kepler/orbital math shared by Worker + WebGL + Canvas, deterministic domain tests, pinned dependencies.
- v0.4.4: **generated standalone runtime** replacing manual duplication; 12 planet texture binaries + attribution packaged into the build; exact source/dist asset validation; three-browser QA matrix established; post-publish HTTPS inspection made a mandatory gate.

Outcome: the architectural baseline every later epic must preserve (master spec §17.3).

## Epic 1 — Mobile Immersion & Time Foundation (v0.5.0) — ✅ DONE, published 2026-07-29

Goal: genuinely immersive mobile use + authoritative time.

Delivered: minimal full-viewport mobile canvas; draggable corner-snapping floating Control button with persisted position; full-screen fade Control Center (Tabs + Cards); Basic/Advanced complexity modes; authoritative **SimulationClock** (2026-01-01 UTC epoch); minute→year presets + custom presets; exact date/time jump; deterministic Advanced reverse time; quality-tiered asteroid belt; collision-aware labels; focus-state sync across scene/desktop/mobile/standalone.

Evidence: `workspace/public/review/v0.5.0-qa-report.md` — 3 browsers × 3 viewports, PWA 19/19, accessibility zero violations.

## Epic 2 — Scientific Learning & Observation (v0.6.0) — ✅ DONE, published 2026-07-30

Goal: scientifically credible education simulator.

Delivered: Explore + Learn modes with Basic/Advanced layers; Moon-phase, eclipse-geometry and seasons guided modules; astronomical event catalogue with event jump; object science profiles (Sun, 8 planets, Moon); astronomy provider metadata + verified-range disclosure + Sources & Accuracy UI; observer locations with altitude/azimuth, horizon visibility, local time, multi-location comparison; Learning Scale / Real Distance / Real Scale; corrected principal Moon-phase definition (geocentric ecliptic longitude difference); malformed-storage security hardening; privacy + UNLICENSED licence notices.

Evidence: final matrix 17/17 shards, 9/9 browser/viewport combos; scientific regression 13/13 over 31 test events. Safe rollback backup: `backup_2206707b-dc7_ms7fomwl`.

## Epic 3 — Spacecraft Travel (v0.7.0) — 🟡 RELEASE CANDIDATE, publication blocked

Goal: realistic but approachable Earth-origin interplanetary travel.

Delivered in workspace (all implementation + targeted gates passing):
- Travel Mode: Earth origin, eight destinations + Earth-orbit rehearsal, Fly-by/Orbiter robotic missions.
- Deterministic Hohmann planner (launch window, duration, path, phase residual, idealised Delta-v). Mars baseline ~244.13 d / ~4.90 km/s / ~0.000351 AU.
- Mission state machine with key-event auto-pause; accelerated mission time.
- Follow (Near/Standard/Far) + Free cameras, persisted.
- Optional Advanced fuel realism with rejection of infeasible budgets.
- **Fail-closed** Direct/Gravity-assist (no invented trajectories).
- WebGL + Canvas mission parity; mission state in `.scienceproject`, standalone HTML, ZIP.
- Hardening from QA: lazy Travel resources, serialized project saves, visibility-aware dashboards, bounded IndexedDB paths.

**Blocker:** shared QA host instability (delayed duplicate Playwright commands, target crashes/timeouts) prevents one clean 22-shard consolidated matrix. Stable URL stays v0.6.0 until it passes plus post-publish HTTPS verification. Task: `task_010` — see [TASK.md](TASK.md).

## Epic 4 — Advanced Mission Systems (v0.8) — ⬜ PLANNED, not started

Goal (master spec §16 & §23): deepen robotic-science and mission-control education.

Scope: selectable instruments (camera, spectrometer, magnetometer, particle detector, radar/altimeter); NASA-style mission science dashboard with deterministic data; communication delay + command queue + downlink; energy management; thermal control; radiation and space weather (historical/teaching scenarios offline, optional live update); condition-based failures and risk; raw-data and teaching-report export (CSV/JSON/image).

Constraint: failures must derive from modelled conditions; no random values as sensor data.

## Backlog beyond v0.8 (spec'd, unscheduled)

- High-precision ephemeris provider (Worker/WASM) + advanced corrections (§9).
- Offline data packages + OfflinePackageManager + update process (§10).
- Full Ground Observer View (draggable sky, scattering/light-pollution toggles) (§11.5).
- Sound system, muted by default (§12.5).
- Advanced time standards (TT/TDB/JD) and calendar support (§8.6–8.7).
- Localisation: Simplified Chinese (§18.2).
- Student/Teacher/Explorer role profiles (§5.3).
- Lander / rover / atmospheric probe / sample return; cockpit view; non-Earth origins.

## Explicit non-goals (master spec §24)

No game points/levels/rewards, combat, fictional narratives, multiplayer, mandatory cloud, automatic sound, or unverified scientific claims.
