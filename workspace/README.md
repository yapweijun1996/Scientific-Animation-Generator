# Scientific Animation Generator

Scientific Animation Generator is an offline-first educational web application for exploring the Solar System, learning astronomy and simulating simplified robotic spacecraft missions.

Active workspace version: **v0.7.0 — Spacecraft Travel**, including the post-candidate rendering, responsive UI, assisted-pilot and bilingual-runtime improvements developed on 2026-08-01.

The current production PWA is published through GitHub Pages; see [Deployment](#deployment).

## Main capabilities

- Interactive Sun, eight planets and Earth’s Moon.
- Three.js/WebGL renderer with an interactive Canvas 2D fallback.
- Explore, Learn and Travel experiences using one authoritative Simulation Clock.
- English and Simplified Chinese (`en`, `zh-CN`) UI with English as the fixed first-launch default.
- Moon phases, eclipse geometry, seasons and astronomical-event learning modules.
- Observer locations, altitude/azimuth, horizon visibility and local-time comparison.
- Learning Scale, Real Distance and Real Scale presentation modes.
- Minute-to-year playback, exact date/time jumps and deterministic reverse time.
- Offline PWA installation, cached reload and no application CDN dependency.
- Single-file standalone HTML and source ZIP exports.
- IndexedDB project snapshots with serialized saves.
- Responsive wide, compact-drawer and immersive layouts for desktop, tablet and mobile.
- Track, Inspect and Overview camera modes with drag-safe object selection.
- Adaptive WebGL quality tiers, capped Canvas rendering and on-demand paused rendering.

## Spacecraft Travel v0.7

Travel Mode is an Earth-origin educational robotic mission simulator.

- Eight-planet destination catalogue, including an Earth-orbit rehearsal.
- Fly-by and orbiter mission types.
- Automatic minimum-energy Hohmann transfer planning.
- Solved launch window, duration, transfer distance, phase residual and simplified Delta-v budget.
- Follow, Assisted Pilot and Free spacecraft cameras with Near, Standard and Far follow distances.
- Keyboard and touch assisted-pilot controls that move only the training visual; authoritative route, fuel, Delta-v and mission progress remain unchanged.
- Screen-space spacecraft sizing so the probe remains readable without approaching planet scale.
- Mission states for waiting, departure burn, cruise, correction, approach and arrival.
- Accelerated mission time and optional key-event auto-pause.
- Optional Advanced fuel realism using a normalized Delta-v budget.
- WebGL and Canvas mission-state parity.
- Mission state included in `.scienceproject`, standalone HTML and ZIP exports.
- Environment tracking keeps nearby planets, orbits and the asteroid belt visible; close-up inspection remains a separate action.
- Quality-tiered irregular asteroid sprites and instanced rocks replace square point rendering.

Direct transfer is deliberately unavailable without a Lambert boundary-value solver. Gravity-assist routes are deliberately unavailable without patched-conic or N-body encounter solving. The application does not draw invented trajectories for unsupported models.

## Development

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
npm test
```

`npm test` is intended to run the complete v0.7 release matrix after the shared Playwright QA host is healthy. The matrix combines the established v0.6 regression coverage with Travel-specific WebGL, Canvas, snapshot, camera, fuel-rejection and direct-file standalone gates.

`src/standalone/generated-runtime.ts` is a generated artifact. Never edit it manually. Change the shared source modules and run `npm run generate:standalone` (also run automatically by `dev`, `typecheck` and `build`).

## Runtime architecture

- `src/astronomy/` — provider boundary, event engine, observer calculations, object science and scientific reporting.
- `src/core/` — Simulation Clock, template protocol, project storage and snapshot model.
- `src/editor/` — editor shell, Control Center, learning controller and Travel controller.
- `src/travel/` — trajectory planning, mission state machine, Travel contracts and WebGL spacecraft visual.
- `src/templates/solar-system/` — orbital math, Three.js runtime, Canvas fallback and visual rules.
- `src/i18n/` — type-safe built-in English and Simplified Chinese dictionaries and formatters.
- `src/standalone/` — generated offline runtime and standalone control UI.
- `src/workers/` — deterministic simulation Worker.
- `src/export/` — standalone HTML and ZIP packaging.
- `qa/` — domain, export, Travel, standalone and browser release gates.

## Interaction and rendering contracts

- Object clicks and object selectors use `trackObject()` so the selected body is followed without hiding the Solar System context.
- `inspectObject()` provides the isolated close-up view; legacy `focusObject()` remains a compatibility alias.
- A pointer gesture becomes a click only when it stays below the mouse, pen or touch movement threshold. Dragging, cancellation, wheel gestures and multi-touch never trigger object tracking.
- `showLabels=false` must hide every existing planet and Moon label immediately in both playing and paused states. Label visibility is committed through one authoritative path that synchronizes `hidden` and `display`.
- WebGL Auto quality may move through Normal, Low and Safe tiers. Manual High and Low do not auto-switch.
- Canvas fallback caps continuous rendering at 30 FPS, and both renderers stop producing frames when playback and visual interactions are idle.
- Real textures are cached. Playback, camera drag and focus changes must not create repeated planet-texture requests.

## Responsive and localisation contracts

- `>=1200px`: wide three-column editor layout with separately persisted side-panel preferences.
- `901–1199px`: full-size canvas with mutually exclusive Templates and Inspector overlay drawers.
- `<=900px`, or portrait layouts up to 1100px wide: immersive canvas with the Control Center as the primary UI.
- The editor language selector is in the desktop top bar; immersive editor and standalone surfaces keep it in the Control Center header.
- Locale is an editor preference, not project science data, and is therefore not written into `TemplateSnapshot`. Exported standalone HTML embeds its selected initial locale.
- Scientific calculations, IDs, event types, mission routes and snapshot values remain language-independent.

## Travel scientific model

The installed Travel baseline uses an idealised heliocentric two-body Hohmann transfer. Launch windows are solved against the installed educational astronomy provider. Reported Delta-v values are ideal impulsive heliocentric changes plus a small correction reserve.

The model intentionally omits:

- planetary perturbations and N-body dynamics;
- plane-change optimisation;
- finite burn duration;
- launch-site and atmospheric ascent geometry;
- parking-orbit escape and real launch vehicles;
- propulsion mass, staging, thermal, radiation, communication and power systems.

Travel output is classified as **Educational Accuracy**. It is suitable for teaching and deterministic simulation, not operational mission design or navigation.

## Scientific accuracy

The astronomy baseline remains `project-kepler-educational-v1`, using rounded fixed orbital elements and a deterministic Kepler solver. It is intended for education, not navigation or authoritative civil eclipse prediction.

Principal Moon phases use geocentric Moon–Sun ecliptic longitude difference at 0°, 90°, 180° and 270°. True three-dimensional elongation remains a separate displayed measurement. Eclipse entries are teaching candidates, not authoritative local eclipse contacts.

## Privacy

Observer presets, manually entered coordinates, mission plans and project snapshots remain on the current device. Application source contains no analytics, advertising tracker, account system, automatic GPS request or telemetry integration. Standalone HTML has no CDN or telemetry dependency.

The public share host may inject a Cloudflare Insights performance beacon outside project source. That hosting-layer behaviour is disclosed in `public/PRIVACY.md`; observer coordinates and saved project state are not sent by the application.

## Deployment

- Production URL: `https://yapweijun1996.github.io/Scientific-Animation-Generator/`
- Workflow: `.github/workflows/deploy-pages.yml`
- Trigger: every push to `main`, plus manual `workflow_dispatch`
- Build input: this `workspace/` directory
- Published artifact: `workspace/dist`

The deployment job uses GitHub Pages' OIDC-based Actions flow and does not require a repository deployment token. PWA source assets remain in `public/manifest.webmanifest`, `public/sw.js`, icons and the offline fallback.

## Project knowledge base

All user-visible project knowledge belongs in one canonical KB-MCP knowledge base:

- **Name:** `Scientific Animation Generator Project Knowledge`
- **KB ID:** `4ee95901-19ec-47cc-8fa3-cd81e2e68c2a`
- **KBID:** `scientific-animation-generator-project-knowledge`
- **Visibility / schema:** user / technical

Update this KB instead of creating another Scientific Animation Generator project KB. Keep items split by retrieval intent—product contract, architecture, rendering, UI/i18n, scientific model, QA/release and deployment status. Current source code and executable tests remain authoritative when KB content is stale.

## Licence and attribution

Project application code is proprietary and marked `UNLICENSED`; see `LICENSE.md`. Third-party planet textures remain under their own licences. Texture sources and CC BY 4.0 attribution are documented in `public/ATTRIBUTION.md` and `public/assets/planets/attribution-manifest.json`.

## Programme documentation

Repository-level planning and status documents live one directory above this workspace:

- `../DESIGN.md` — architecture and durable design decisions.
- `../SPEC.md` — requirement implementation status against the master specification.
- `../EPIC.md` — programme epics and delivery status.
- `../ROADMAP.md` — shipped, in-flight and planned releases.
- `../TASK.md` — active task board, blockers and next steps.

The approved product direction remains `docs/solar-system-explorer-vnext-master-spec.md`.

## Release evidence

v0.7 candidate documents:

- `public/review/v0.7.0-qa-report.md`
- `public/review/v0.7.0-release-notes.md`
- `public/review/v0.7.0-spacecraft-travel-scientific-report.md`
- `public/release/v0.7.0-compare.md`
- `public/release/v0.7.0-rollback.md`
- `public/releases/v0.7.0.json`

The stable public URL must not be updated until all required gates pass.
