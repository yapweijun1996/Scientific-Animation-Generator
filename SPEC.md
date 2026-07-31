# SPEC.md — Requirements Specification Status

**Document status:** Synced with codebase on 2026-07-31 (workspace v0.7.0 release candidate, stable public v0.6.0)
**Authoritative full specification:** [workspace/docs/solar-system-explorer-vnext-master-spec.md](workspace/docs/solar-system-explorer-vnext-master-spec.md) (approved 2026-07-29). This file tracks *implementation status* against that spec; the code is the source of truth for what is actually built.
**Related documents:** [DESIGN.md](DESIGN.md) · [EPIC.md](EPIC.md) · [ROADMAP.md](ROADMAP.md) · [TASK.md](TASK.md)

Requirement language: **MUST** (required for release) / **SHOULD** (strongly recommended) / **MAY** (optional or deferred).

---

## 1. Invariant platform requirements (MUST — verified every release)

| Requirement | Status |
|---|---|
| Offline-first PWA, installable, cached reload | ✅ Implemented; PWA audit 19/19 (v0.7 candidate) |
| Zero-CDN single-file standalone HTML export | ✅ Implemented; direct `file://` QA-gated, zero HTTP requests |
| Source ZIP export | ✅ Implemented (fflate) |
| Three.js WebGL primary renderer | ✅ Implemented |
| Interactive Canvas 2D fallback with scientific-state parity | ✅ Implemented; parity QA-gated |
| `.scienceproject` save/load compatibility or documented migration | ✅ v0.5 → Real Distance migration documented; v0.6 snapshots open in v0.7 |
| Desktop / tablet / mobile responsive | ✅ 9 browser/viewport combinations QA-gated |
| Deterministic, testable simulation | ✅ Deterministic Worker + domain regression suites |
| No analytics / account / telemetry in app source | ✅ Verified by privacy audit (hosting-layer beacon disclosed separately) |
| No fake scientific data; no random values as measurements | ✅ Enforced; fail-closed unsupported routes |

## 2. Product-mode model

| Requirement | Status |
|---|---|
| Basic / Advanced complexity levels, persisted, default Basic | ✅ v0.5+ |
| Explore / Learn / Travel experience modes, persisted, default Explore | ✅ Explore+Learn v0.6; Travel v0.7 candidate |
| Future Student/Teacher/Explorer role profiles | ⏸ Deferred by spec (architecture allowance only) |
| Learning Scale / Real Distance / Real Scale, calculations independent of scale | ✅ v0.6 |
| Default first launch: Explore + Basic + Learning Scale + Auto Quality | ✅ |

## 3. Time system

| Requirement | Status |
|---|---|
| Single authoritative SimulationClock consumed by all subsystems | ✅ v0.5 (epoch 2026-01-01 UTC) |
| Reverse time recomputes state (never replays frames) | ✅ v0.5, Advanced Mode only |
| Presets 1 min → 1 year + custom local presets (create/name/order/pin/delete) | ✅ v0.5; malformed stored presets rejected + markup escaped (v0.6 security fix) |
| Exact date/time jump, fine speed, event jump | ✅ |
| Advanced timeline with mission markers | ✅ mission dashboard (v0.7); Learn event phases ✅ |
| TT / TDB / Julian Date / calendar conversion (Advanced SHOULD) | ❌ Not yet implemented |

## 4. Astronomy engine and data

| Requirement | Status |
|---|---|
| Provider boundary; Basic/Advanced share one public interface | ✅ `AstronomyEngine` |
| Installed baseline provider | ✅ `project-kepler-educational-v1` — Educational Accuracy |
| Provenance metadata (source, version, licence, range, limitations) | ✅ Provider metadata + verified-range disclosure UI |
| Sources & Accuracy UI with accuracy labels | ✅ v0.6 |
| High-precision ephemeris provider (Worker/WASM) | ❌ Framework present; no high-precision provider installed |
| Offline data packages / OfflinePackageManager / update process | ❌ Not implemented (spec §10 — future phase) |
| Coordinate systems beyond heliocentric/geocentric (Advanced SHOULD) | ❌ Not yet implemented |
| Corrections: perturbations, precession, nutation, light-time, aberration, refraction | ❌ Not implemented (MAY) |

## 5. Learn Mode

| Requirement | Status |
|---|---|
| Moon phases, eclipses, seasons guided modules | ✅ v0.6 |
| Event catalogue: moons ×4, eclipses ×2, conjunction, opposition, perihelion, aphelion | ✅ v0.6; calculated, not hard-coded |
| Moon-phase definition: geocentric ecliptic longitude difference 0°/90°/180°/270° | ✅ v0.6 (3D elongation shown separately) |
| Layered object information cards (summary / basic science / advanced) | ✅ v0.6 — Sun, 8 planets, Moon |
| Observer locations: city, lat/long, multiple named, multi-location comparison | ✅ v0.6; no first-launch GPS request |
| Ground Observer View (sky view, horizon, cardinal directions, paths…) | ⚠️ Partial: altitude/azimuth, horizon visibility, local time implemented; full draggable sky view with scattering/light-pollution toggles not yet built |
| No points, levels, rewards, campaigns | ✅ Honoured |

## 6. Travel Mode (v0.7 candidate scope)

| Requirement | Status |
|---|---|
| Earth-only origin; eight-planet destinations; complexity grouping | ✅ + Earth-orbit rehearsal destination |
| Robotic Fly-by and Orbiter mission types | ✅ (lander/rover/probe/sample-return deferred by spec) |
| Automatic Hohmann planning: launch window, duration, path, phase residual, Delta-v | ✅ deterministic; Mars baseline ~244.13 d / ~4.90 km/s / ~0.000351 AU residual |
| Direct / Gravity-assist route comparison "where supported" | ✅ Fail-closed: rejected with scientific explanation until Lambert / patched-conic solvers exist; no invented trajectories |
| Follow (Near/Standard/Far) + Free cameras; no cockpit (deferred) | ✅ persisted across save/reload |
| Simplified default fuel; optional Advanced fuel realism (normalized Delta-v budget) | ✅ incl. low-Delta-v rejection; Basic sessions never fuel-interrupted |
| Accelerated mission time; optional key-event auto-pause | ✅ |
| Mission state machine (waiting→departure→cruise→correction→approach→insertion→complete) | ✅ |
| WebGL + Canvas mission parity; mission state in snapshots/standalone/ZIP | ✅ QA-gated |
| Original spacecraft asset (no real-vehicle copying) | ✅ readable robotic probe visual |
| Entry points: Control Center + object info card, shared planning state | ✅ |

## 7. Accessibility, localisation, privacy

| Requirement | Status |
|---|---|
| Keyboard navigation, focus states, labels/roles, touch targets ≥44px | ✅ Accessibility audits pass, zero violations (desktop + mobile) |
| Reduced Motion support | ✅ |
| Localisation: English + Simplified Chinese | ❌ English only; architecture must avoid hard-coded text (future) |
| Location privacy: optional, purpose-specific, local by default | ✅ |
| Licence: proprietary UNLICENSED code; CC BY 4.0 texture attribution | ✅ `LICENSE.md`, `ATTRIBUTION.md`, attribution manifest |
| Privacy disclosure incl. hosting-layer Cloudflare Insights | ✅ `public/PRIVACY.md` |

## 8. Sound (spec §12.5)

❌ Not implemented in any release to date. Spec requires muted-by-default when added.

## 9. v0.8 Advanced Mission Systems (spec §16)

❌ All deferred: instruments, science dashboards, communication delay/command queue, energy, thermal, radiation/space weather, condition-based failures, raw-data export. See [ROADMAP.md](ROADMAP.md).

## 10. Release gate requirements (spec §25 Definition of Done)

All 15 DoD items are enforced by the release process. Current v0.7.0 status: items pass **except** the consolidated three-browser matrix (22 shards) which is blocked by shared QA-host instability — therefore the stable URL remains v0.6.0. Detail in [TASK.md](TASK.md).
