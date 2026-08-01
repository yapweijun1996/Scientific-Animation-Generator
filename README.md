# Scientific Animation Generator

Scientific Animation Generator, also presented as **Solar System Explorer**, is an offline-first educational web application for exploring the Solar System, learning astronomy and simulating simplified robotic spacecraft missions.

The active application is in [`workspace/`](workspace/). Current workspace version: **v0.7.0 — Spacecraft Travel**.

## Highlights

- Sun, eight planets and Earth's Moon with WebGL and Canvas 2D parity.
- Explore, Learn and Travel experiences driven by one deterministic Simulation Clock.
- English and Simplified Chinese (`en`, `zh-CN`) built into the runtime.
- Track, Inspect, Overview and Free camera workflows with drag-safe object picking.
- Assisted spacecraft pilot controls that do not modify the authoritative mission trajectory.
- Adaptive rendering, cached textures, irregular asteroid rendering and zero continuous frames while idle.
- Responsive wide, compact-drawer and immersive mobile layouts.
- Offline PWA, local project snapshots, standalone HTML and ZIP exports.

## Development

```bash
cd workspace
npm install
npm run dev
npm run typecheck
npm run build
npm test
```

`workspace/src/standalone/generated-runtime.ts` is generated. Modify shared source files and run `npm run generate:standalone`; never edit the generated file manually.

See [`workspace/README.md`](workspace/README.md) for the full architecture, scientific limitations, interaction contracts, responsive behavior, QA gates, privacy and attribution details.

## Deployment

The production PWA is published at [GitHub Pages](https://yapweijun1996.github.io/Scientific-Animation-Generator/).

`.github/workflows/deploy-pages.yml` automatically installs dependencies, builds the application in `workspace/`, uploads `workspace/dist` and deploys it whenever `main` is updated. The workflow can also be started manually from GitHub Actions.

## Canonical project knowledge base

All user-visible project knowledge belongs to one KB-MCP knowledge base:

- **Name:** `Scientific Animation Generator Project Knowledge`
- **KB ID:** `4ee95901-19ec-47cc-8fa3-cd81e2e68c2a`
- **KBID:** `scientific-animation-generator-project-knowledge`
- **Visibility / schema:** user / technical

Future agents must update this KB instead of creating another project KB. Repository source and executable tests remain authoritative if KB content becomes stale.

## Scientific scope

The installed astronomy provider and mission planner are classified **Educational Accuracy**. The application is not suitable for navigation, authoritative civil eclipse prediction or operational mission design. Unsupported Direct and Gravity Assist routes fail closed rather than drawing invented trajectories.

## Licence and attribution

Application code is proprietary and marked `UNLICENSED`; see [`workspace/LICENSE.md`](workspace/LICENSE.md). Third-party texture attribution is documented in [`workspace/public/ATTRIBUTION.md`](workspace/public/ATTRIBUTION.md).
