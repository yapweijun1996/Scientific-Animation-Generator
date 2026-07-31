# Changelog

## 0.7.0 — 2026-07-31 (Release candidate)

### Added

- On-screen frame-rate readout in the viewport header, colour-coded by health and showing `idle` when a paused scene has stopped rendering. Counting is driven by a new optional `onFrameRendered` template-context callback and sampled on an interval, so the meter never schedules an animation frame of its own — a self-driven meter would keep the page awake and defeat on-demand rendering.
- Earth-origin Travel Mode with an eight-planet destination catalogue.
- Robotic Fly-by and Orbiter mission types.
- Deterministic Hohmann transfer planner with launch window, flight duration, transfer path, phase residual and idealised Delta-v output.
- Mission state machine covering waiting, departure, cruise, correction, approach, insertion and completion.
- Follow and Free spacecraft cameras with Near, Standard and Far follow distances.
- Optional Advanced fuel simulation using a simplified Delta-v budget.
- Accelerated mission playback and optional key-event auto-pause.
- Shared WebGL spacecraft/trajectory visual and Canvas 2D equivalent.
- Travel state in project snapshots, standalone HTML and ZIP export contracts.
- Dedicated Travel browser and direct-file standalone QA gates.

### Changed

- Travel visual resources are created lazily only when a mission is planned or restored.
- Project saves are serialized so a stale autosave cannot overwrite a newer mission or camera state.
- Mission dashboards use a trailing update so paused time jumps cannot leave stale progress on screen.
- IndexedDB open, blocked, abort and error paths are bounded and fail into a usable application state.
- PWA cache advanced to `science-animator-v14-spacecraft-travel`.
- Application, template, standalone runtime and export metadata advanced to v0.7.0.
- **Rendering is now on demand in both the WebGL runtime and the Canvas 2D fallback.** The animation loop previously re-armed `requestAnimationFrame` unconditionally, so a paused, unattended scene still consumed a frame slot forever. It now schedules the next frame only while the simulation is playing or while OrbitControls damping is still settling, and a `requestRender()` helper wakes it from every state change (Worker state, parameters, quality, resize, focus, play, mission, mission camera, snapshot restore, and pointer drag/wheel in the Canvas fallback).
- Decorative motion — Sun rotation, Sun halo, starfield drift and the spacecraft pulse — advances only while the simulation is playing, so a paused scene can reach true idle.

### Fixed

- Preserved Free Camera and follow-distance selections across save and reload.
- Prevented concurrent autosave transactions from restoring older Follow Camera state.
- Updated Canvas and WebGL mission state before notifying the UI of Simulation Clock changes.
- Added a trailing dashboard refresh for paused deterministic time jumps.
- Preserved Explore startup performance by removing default Mars planning from the first render.
- Fixed invisible native `<select>` dropdown options: `:root` was missing `color-scheme: dark` and no `option` rule existed, so a translucent select background composited to white behind near-white text. Added `color-scheme: dark` and an explicit `option { background: var(--panel-raised); color: var(--text) }` rule covering Explore, Learn and Travel controls.
- Removed a `localhost`/`127.0.0.1` development gate that silently skipped all real planet photo textures (Earth, Mars, Jupiter, Saturn, etc.), leaving only procedural placeholder maps rendered — including at High detail quality. Real textures now load identically on local and published hosts. The previous silent `catch {}` around texture application also now logs the underlying error instead of failing invisibly.

- Eliminated per-frame forced synchronous layout in the celestial label pass. `updateLabels()` wrote label styles and then read `stage.clientWidth`/`clientHeight` on the following frame, forcing a full layout recalculation every frame; it now reads the cached viewport from `resizeState`. The same pattern in `SpacecraftMissionVisual.updateLabel()` (reading `labelLayer.clientWidth`/`clientHeight` every frame) was fixed the same way.
- Removed per-frame allocations from the label pass: both label routines reuse a scratch `THREE.Vector3` instead of allocating one per object per frame, the candidate and occupancy arrays are reused instead of rebuilt, and label styles are written only when a value actually changed rather than on every frame.
- **Fixed every planet rendering stacked on the Sun at the origin when the simulation Worker's first message was delayed or lost.** The orbital buffers were zero-filled until the Worker reported, and a Worker that never starts emits no `error` event, so the scene stayed collapsed silently with no recovery path. The runtime now seeds planet positions and rotations synchronously from the shared orbital model before the Worker replies, so the scene is correct from the first frame; the Worker remains authoritative once it reports.
- Added a Worker start watchdog. If no simulation state arrives within 4 s the runtime logs a warning and surfaces `Simulation Worker slow to start · using main-thread positions` instead of leaving the scene silently frozen.

**Release-process note:** because the removed gate only ever skipped real textures on `localhost`, every prior browser QA run (which executes against a localhost server) validated the procedural placeholder rendering path, not the real-photo texture pipeline users see in production. The consolidated v0.7 matrix must be re-run after this fix so real textures are covered by QA evidence for the first time.

**Measured rendering result** (Chrome DevTools performance traces, before vs after): forced reflow during playback fell from 102 ms with `updateLabels` as the top offender to the ForcedReflow insight no longer being raised at all; a paused scene went from still running `animate` with 72 ms of forced reflow to a trace with no main-thread activity. DevTools `evaluate_script` calls changed from consistently timing out at 30 s to returning immediately.

**QA-harness note:** while the simulation is *playing* the page still renders continuously by design, so it never reaches a CPU-idle window. Tools that wait for a quiet page — Lighthouse (which previously reported `PAGE_HUNG`), Playwright idle waits, screenshot and script-evaluation calls — can still time out against a playing scene even though the page is responsive. Browser QA should pause the simulation before asserting.

### Scientific boundaries

- Direct transfer remains unavailable until a Lambert boundary-value solver is installed.
- Gravity-assist routes remain unavailable until patched-conic or N-body encounter solving is installed.
- Delta-v is an educational impulsive budget, not propellant mass, staging or launch-vehicle performance.
- Travel output is educational and must not be used for operational mission design or navigation.

### Testing

- Domain regression passed for eight destinations, Mars Hohmann interception, Earth-orbit rehearsal, fuel rejection, unsupported-route rejection and mission-state boundaries.
- Mars baseline: about 244.13 days, 4.90 km/s simplified Delta-v and approximately 0.000351 AU intercept residual.
- Chromium and WebKit Travel WebGL gates passed with Follow/Free cameras, deterministic progress, snapshot restore and zero runtime/network errors.
- Firefox forced-Canvas Travel gate passed, including low-fuel rejection.
- Direct-file standalone Travel gate passed with no HTTP requests, Mars restore, Venus Fly-by replanning and an exact 25% paused time jump.
- Lint, typecheck, production build and PWA 19/19 audit passed.
- Consolidated release matrix remains pending because the shared QA host is currently producing delayed duplicate Playwright commands and browser target crashes/timeouts. v0.7 must not be published until one clean matrix completes.

## 0.6.0 — 2026-07-30

### Added

- Explore and Learn modes with Basic and Advanced scientific layers.
- Guided Moon-phase, eclipse-geometry and seasons learning modules.
- Astronomical event catalogue with event-time jumping.
- Object science profiles for the Sun, all eight planets and Earth’s Moon.
- Astronomy provider metadata, verified-range disclosure and scientific accuracy reporting.
- Observer locations, altitude/azimuth, horizon visibility, local time and multi-location comparison.
- Learning Scale, Real Distance and Real Scale presentation modes.
- Deterministic visual diagnostics for camera-frustum and visible-body overlap testing.
- Privacy and proprietary project-code licence notices.

### Changed

- Principal Moon phases now use geocentric Moon–Sun ecliptic longitude difference at 0°, 90°, 180° and 270°.
- True three-dimensional elongation remains a separate displayed measurement.
- Legacy v0.5 scientific-distance snapshots migrate to Real Distance.
- Focus Sun in Real Distance and Real Scale now opens the full Solar System overview.
- Real Distance preserves linear AU spacing while applying overlap-safe visible sizes, locator labels and automatic outer-system camera framing.
- WebGL and Canvas fallback share the same distance and size safety rules.
- PWA cache advanced to `science-animator-v13-scientific-learning`.

### Fixed

- Prevented Mercury and other inner objects from appearing inside the oversized visible Sun envelope in Linear AU mode.
- Prevented Earth and Moon visible-body overlap in Real Distance.
- Prevented Jupiter, Saturn, Uranus and Neptune from being cropped after distance-mode and focus changes.
- Corrected Moon-phase scientific residuals that previously treated true 3D elongation as the principal phase definition.
- Rejected malformed custom time presets from browser storage and escaped custom preset markup.

### Security and Privacy

- Added browser regression fixtures that inject malicious local-storage preset content in Chromium, Firefox and WebKit.
- Added local-data and observer-location disclosure with no analytics, account, automatic GPS request or third-party telemetry.
- Marked project application code proprietary/UNLICENSED while retaining third-party texture attribution.

### Testing

- Final release matrix `v0.6.0-release-2026-07-30T11-09-29-804Z-54529`: 17/17 shards and 9/9 browser/viewport combinations passed.
- Scientific regression: 13/13 checks passed using 31 test events.
- Verified Chromium and WebKit WebGL across desktop/tablet/mobile.
- Verified expected Firefox headless Canvas fallback across desktop/tablet/mobile.
- Verified interactions and malformed-storage security coverage in Chromium, Firefox and WebKit.
- Verified direct-file standalone HTML in all three browsers with no network requests.
- Verified offline mobile reload and forced Canvas fallback.
- PWA audit passed 19 checks with zero warnings and zero errors.
- Every tested page had empty console-error, page-error, failed-request and HTTP-error arrays.

## 0.5.0 — 2026-07-29

### Added

- Mobile-first immersive canvas with no permanent mobile toolbar, timeline or side panels.
- Draggable corner-snapping floating Control button with persisted position in the main PWA.
- Full-screen fade Control Center organised with Tabs and Cards.
- Basic and Advanced complexity modes with local persistence.
- Authoritative SimulationClock using the 2026-01-01 UTC epoch.
- Minute, hour, day, week, month and year playback presets plus locally saved custom presets.
- Exact date/time jump, fine-speed control and Advanced reverse time.
- Signed Worker and Canvas playback that recomputes celestial positions from simulation time.
- Quality-tiered deterministic main asteroid belt rendering in WebGL and Canvas fallback.
- Collision-aware celestial labels and equivalent standalone v0.5 Control Center/time controls.

### Changed

- Default playback changed from 32 days per second to 1 day per second.
- Mobile and portrait tablets dedicate the full viewport to the Solar System scene while controls are closed.
- Focus state is synchronised between the scene, desktop selector, mobile Control Center and standalone runtime.
- Snapshots persist play state, signed playback rate, direction and complexity mode.
- PWA cache advanced to `science-animator-v12-mobile-time`.
- Application, generated runtime, standalone HTML and ZIP exports advanced to 0.5.0.

### Fixed

- Reverse time now recomputes deterministic state rather than replaying rendered frames.
- Inner-planet label overlap is reduced through priority-based collision placement.
- Mobile QA now uses real CSS viewport widths.
- The minimal mobile scene retains an accessible level-one heading.

### Testing

- Added deterministic Simulation Clock conversion, preset, signed-rate and reverse-time domain tests.
- Added browser QA for mobile full-canvas mode, floating control, Control Center, exact-date jump and reverse time.
- Verified Chromium, Firefox and WebKit on desktop, tablet and mobile with empty console, page, request and HTTP-error arrays.
- Verified direct-file standalone HTML in all three browsers with no HTTP requests.
- Verified offline mobile Control Center, Moon focus, asteroid belt and reverse time in forced Canvas fallback.
- PWA audit passed 19 checks with zero warnings and zero errors.
- Accessibility audit passed desktop and mobile with zero violations.

## 0.4.4 — 2026-07-29

### Refactored

- Replaced the manually duplicated standalone Solar System implementation with a generated bundle compiled from the shared application runtime.
- Added dedicated standalone entry, bootstrap, UI and type modules.
- Injected Worker creation and planet texture sources into the shared `SolarSystemRuntime`.
- Reused the shared celestial catalog, orbital math, parameter readers, Three.js runtime, Canvas fallback and texture catalog.
- Reduced `standalone-export.ts` to approximately 3.2 KB of export orchestration.
- Kept standalone HTML and ZIP export on the same authoritative HTML builder.

### Fixed

- Added all 12 planet texture binaries and the attribution manifest to `public/assets/planets/` so production builds no longer depend on files retained by an older published project.
- Resolved post-publish HTTP 404 responses for Earth day, night and cloud maps before final release.
- Added exact source/dist asset-size validation to prevent incomplete publication packages.
- Added browser QA rejection for every HTTP 4xx or 5xx response.

### Testing

- Added repeatable Playwright QA for Chromium, Firefox and WebKit across desktop, tablet and mobile.
- Added real standalone HTML and ZIP download validation with filenames, contents and hashes.
- Added direct `file://` checks in all three browsers with no HTTP requests.
- Added offline cached reload, offline Moon focus and forced Canvas fallback checks.
- Verified focus, quality, playback and IndexedDB snapshot restoration in all three browsers.
- Reran the complete matrix after the asset packaging repair; all `httpErrors` arrays were empty.
- Accessibility audit passed with zero violations.

### Maintenance

- Added a generated standalone runtime version gate tied to `APP_VERSION`.
- Advanced the PWA cache to `science-animator-v11-standalone-runtime`.
- Pinned Playwright 1.61.0 for the project browser QA environment.
- Added v0.4.4 release notes, QA evidence, compare-before-release and rollback records.
- Added post-publish HTTPS inspection as a mandatory release gate.

### Compatibility

- Preserved all v0.4.3 editor, scientific scene, Moon, planet texture, Saturn ring, quality, save/load, PWA, standalone and ZIP behavior.
- Preserved the WebGL primary renderer and interactive Canvas 2D fallback.
- Added no celestial bodies, binary Moon assets, CDN dependencies, analytics or external runtime requests.

## 0.4.3 — 2026-07-28

### Refactored

- Converted `moon-data.ts` into a pure data module with no DOM mutation, CSS injection, polling or load-order dependency.
- Added centralized application version, protocol version and deterministic seed constants.
- Added a typed celestial catalog for Sun, all eight planets and Earth’s Moon.
- Centralized Kepler solving, planet positions, rotations, AU visual compression, body sizing and Moon orbit math.
- Reused the shared orbital domain in the simulation Worker, Three.js runtime and Canvas fallback.
- Separated Worker message parsing from scene-state application in the Three.js runtime.
- Made the editor render its Focus selector explicitly from the celestial catalog.
- Added explicit resource ownership for subsystem-managed Three.js materials.

### Performance

- Cached 1,288 Canvas fallback orbit samples instead of recalculating all eight orbital paths every animation frame.
- Canvas quality changes now immediately update the backing pixel ratio.

### Testing

- Added deterministic domain behavior tests for Kepler residuals, orbital period repetition, Moon period repetition, distance compression, visual radii and retrograde rotation.
- Added architecture regression assertions for pure data modules and shared Worker/WebGL/Canvas math.
- Preserved standalone HTML syntax, zero-CDN, texture, Moon, ZIP and PWA regression checks.

### Maintenance

- Pinned dependency versions for reproducible builds.
- Advanced the PWA cache to `science-animator-v10-architecture-refactor`.
- Advanced application, template, standalone and ZIP versions to 0.4.3.

### Compatibility

- Preserved all v0.4.2 visuals, Moon behavior, save/load, WebGL, Canvas fallback, quality tiers, offline PWA, standalone HTML and ZIP export behavior.
- Added no celestial bodies, binary Moon assets, CDN dependencies or external runtime requests.

## 0.4.2 — 2026-07-28

### Added

- Earth-child Moon hierarchy and readable Moon orbit.
- Deterministic 27.321661-day Moon motion with stable tidal locking.
- Locally generated lunar maria, crater albedo, height relief and High-tier normal detail.
- Natural Moon phases through existing scene lighting.
- Moon focus, label, pointer selection and mobile Focus access.
- Canvas fallback Moon body, orbit, focus, label and phase impression.
- Standalone HTML, source ZIP, save/load and PWA Moon compatibility.

### Changed

- Application and template version advanced to 0.4.2.
- Moon quality materials now use stable Low, Auto and High caches.
- PWA cache advanced to `science-animator-v8-moon-pass`.
- Standalone and ZIP filenames advanced to v0.4.2.

### Fixed

- Restored the Focus selector on mobile and increased it to a 44px touch target.
- Added Moon hierarchy validation to prevent silent detachment from Earth.

### Compatibility

- Preserved the v0.4.1 Earth visuals, Saturn ring hierarchy and all existing planet polish.
- Added no other moons, planets or online dependencies.
- Added no binary Moon texture assets; lunar maps are generated locally in code.
