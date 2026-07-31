# Solar System Explorer vNext Master Specification

**Project:** Scientific Animation Generator / Solar System Explorer  
**Project ID:** `project_2206707b-dc70-4db8-be41-19c2b1020d52`  
**Baseline:** Published and verified v0.4.4  
**Document status:** Approved product direction; ready for phased implementation  
**Date:** 2026-07-29  
**Primary audience:** Product, engineering, UI/UX, QA, education-content and scientific-validation teams

---

## 1. Purpose

This document defines the vNext product direction for Solar System Explorer. It converts the current solar-system animation into a scientifically grounded, mobile-first and immersive educational simulation platform.

The product must not become a conventional game. It should use strong interaction, cinematic presentation and optional spacecraft simulation to motivate students and general users to explore scientific concepts.

The product must remain:

- offline-first;
- mobile and iPad friendly;
- usable as a PWA;
- exportable as a zero-CDN standalone HTML file;
- exportable as a source ZIP;
- compatible with the existing Three.js renderer and Canvas fallback;
- deterministic and testable;
- scalable to future teaching, observation and mission-simulation modules.

---

## 2. Product vision

> Build a scientifically grounded, immersive and mobile-friendly Solar System simulator that helps students understand astronomy through exploration, observation and realistic simulation.

The core positioning is:

1. **Educational** — users learn astronomy through accurate models, explanations and visual demonstrations.
2. **Immersive Exploration** — the interface should make users feel that they are observing and navigating through space rather than operating a crowded editor.
3. **Simulation** — time, orbits, astronomical events and spacecraft routes must be computed from explicit models rather than presented as disconnected animations.

The visual direction is **NASA-inspired scientific presentation combined with restrained cinematic immersion**. The product must not copy NASA, SpaceX or any other organisation's branding, logos, vehicle silhouettes or protected visual identity.

---

## 3. Product principles

### 3.1 Scientific calculation first

Scientific state, time, orbit, distance and event calculations must remain authoritative. Visual presentation may be enhanced for teaching, but it must never silently alter the underlying scientific result.

### 3.2 Immersion without permanent clutter

The main simulation canvas is the product. Controls must appear only when needed, especially on mobile.

### 3.3 Mobile-first interaction

All major features must be designed for touch, safe areas, small screens and one-handed access before desktop enhancements are added.

### 3.4 Realistic but approachable

The system should expose real concepts without forcing every user to understand advanced orbital mechanics. Basic Mode should assist automatically; Advanced Mode should reveal the underlying calculations and controls.

### 3.5 Offline-first, online-enhanced

The core simulation must work without a network. Online connectivity may update datasets, perform cross-validation or load current space-weather information, but it must not be required for normal operation.

### 3.6 Scalable architecture

Explore, Learn and Travel must consume shared domain services instead of implementing separate simulation logic.

### 3.7 No fake scientific data

Scientific measurements, charts and discoveries must come from explicit formulas, deterministic simulations or verified datasets. Random values must never be presented as scientific measurements.

---

## 4. Requirement language

- **MUST** — required for release.
- **SHOULD** — strongly recommended; omission requires a documented reason.
- **MAY** — optional or deferred.

---

## 5. Product-mode model

The product uses two independent dimensions.

### 5.1 Complexity level

#### Basic Mode

Designed for students, first-time users and casual exploration.

- simplified controls;
- automatic assistance;
- readable explanations;
- minimal scientific notation;
- no reverse-time control;
- no persistent timeline;
- no fuel or failure interruption by default;
- educational accuracy and clear visual enhancement labels.

#### Advanced Mode

Designed for teachers, advanced students and technical users.

- complete timeline and reverse-time controls;
- precise date, time and coordinate systems;
- detailed source and accuracy information;
- high-precision ephemeris calculations where available;
- spacecraft Delta-v, launch-window and trajectory controls;
- optional energy, communication, thermal and risk simulation;
- raw data and scientific exports.

The system MUST remember the user's last selected complexity level. First launch MUST default to **Basic**.

### 5.2 Experience mode

#### Explore

Free exploration of the Solar System, planets, the Moon, orbital paths, visual scale and time.

#### Learn

Guided explanations and visual demonstrations of astronomical concepts. It is not a game campaign and does not use points, levels or reward systems.

#### Travel

Spacecraft and robotic-probe simulation, initially launched from Earth, with calculated interplanetary routes.

The system MUST remember the last experience mode. First launch MUST default to **Explore**.

### 5.3 Future role profiles

The architecture SHOULD allow future `Student`, `Teacher` and `Explorer` profiles, but vNext initially implements only `Basic` and `Advanced` complexity levels.

---

## 6. Visual-scale modes

The simulation state must be independent from presentation scale.

### 6.1 Learning Scale — default

- planet sizes may be enlarged;
- orbital distances may be compressed;
- spacecraft and trajectory widths may be enlarged;
- small objects may be made easier to select;
- the interface MUST display a concise visual-enhancement notice.

### 6.2 Real Distance

- orbital distances should approximate real ratios;
- planets may remain visually enlarged enough to locate;
- the interface MUST state that object sizes remain enhanced.

### 6.3 Real Scale

- both distance and object size use real ratios as far as technically practical;
- locator markers MAY be used because planets and spacecraft may be almost invisible;
- scientific calculations must remain identical to the other scale modes.

Default first-launch state:

> `Explore + Basic + Learning Scale + Auto Quality`

---

## 7. Mobile-first UI/UX specification

### 7.1 Main mobile canvas

The mobile main view MUST be visually minimal.

- The simulation canvas occupies the available viewport.
- No permanent top toolbar, timeline, focus selector, speed slider or play controls.
- The only persistent control is one floating control button.
- Temporary status messages MAY appear after focus, time, scale or quality changes and must dismiss automatically.
- The interface MUST support safe-area insets and avoid camera/notch/home-indicator collisions.

### 7.2 Floating control button

- Default position: bottom-right.
- The button MUST be draggable.
- It MUST snap to one of four safe corners.
- It MUST remember the last selected corner and offset.
- It MUST remain keyboard accessible and expose an accessible name.
- Dragging must not accidentally trigger the panel.
- The button must not create a second permanent Travel or Education button.

### 7.3 Full-screen Control Center

Tapping the floating button opens a full-screen control panel.

- Transition: full-screen fade in and fade out.
- Recommended duration: 200–300 ms.
- The panel MUST preserve the current camera, focus and simulation state.
- Simulation continues while the panel is open unless the user explicitly pauses it.
- `Apply`, `Save` and `Close` behaviours must be explicit.
- Closing the panel restores the unobstructed simulation.

### 7.4 Information architecture

The Control Center uses **Tabs + Cards**.

Recommended top-level tabs:

1. Time
2. View & Camera
3. Objects & Focus
4. Learn
5. Travel
6. Quality & Audio
7. Data, Accuracy & Export

Each tab uses modular cards. Long ungrouped forms are not permitted.

### 7.5 Desktop and tablet behaviour

- Desktop MAY use side panels or compact overlays.
- Tablet should prefer the mobile full-screen panel when horizontal space is limited.
- Behaviour and labels must remain consistent across device classes.
- Desktop-only features must not make mobile functionality incomplete.

### 7.6 Gesture requirements

- one-finger drag: rotate/orbit camera;
- pinch: zoom;
- double-tap selected object: focus;
- long press: open concise object actions;
- gestures must not conflict with page scrolling or browser navigation;
- Reduced Motion must disable unnecessary camera flourish and long cinematic transitions.

---

## 8. Time and simulation-clock system

### 8.1 Unified Simulation Clock

All planets, the Moon, educational events, observer calculations and spacecraft missions MUST consume one authoritative Simulation Clock.

The system must not implement reverse time by playing rendered frames backwards. It must recompute state from the requested simulation time.

### 8.2 Basic time controls

- Play / Pause.
- Fine speed slider.
- Quick presets.
- Date and time picker.
- Common astronomical-event jump.
- Positive time progression only.

### 8.3 Advanced time controls

- Complete timeline.
- Forward and reverse time.
- Precise step controls.
- Exact date and time input.
- Event search and jump.
- Current local time, UTC and simulation-time comparison.

### 8.4 Default presets

The default preset library SHOULD include:

- 1 minute;
- 10 minutes;
- 1 hour;
- 6 hours;
- 1 day;
- 1 week;
- 1 month;
- 1 year.

Users MUST be able to create, name, order, pin and delete custom presets. Presets are stored locally.

### 8.5 Timeline

- Hidden in Basic Mode.
- Available inside the Advanced Time tab.
- Must show current simulation date, direction and multiplier.
- Travel missions must show departure, corrections, fly-bys, arrival and remaining duration.
- Learn events must show event phases and explanatory markers.

### 8.6 Time standards

Basic Mode:

- observer local time;
- UTC switch;
- automatic time-zone and daylight-saving conversion.

Advanced Mode SHOULD support:

- UTC;
- TT;
- TDB;
- Julian Date;
- leap-second explanation;
- explicit internal calculation time standard.

### 8.7 Calendar support

Basic Mode uses the modern Gregorian calendar.

Advanced Mode SHOULD support:

- Gregorian and Julian calendars;
- BCE / CE;
- astronomical year numbering;
- calendar conversion;
- exported documents recording the selected calendar.

---

## 9. Scientific astronomy engine

### 9.1 Layered precision

Basic Mode uses a validated, efficient orbital model suitable for continuous interaction on mobile.

Advanced Mode may load a higher-precision ephemeris provider, preferably inside a Web Worker and optionally using WebAssembly.

Both modes MUST use the same public astronomy-engine interface.

### 9.2 Data and algorithm provenance

Each dataset or calculation provider MUST record:

- source organisation or publication;
- version;
- licence;
- supported date range;
- coordinate system and epoch;
- known limitations;
- expected error range;
- last validation date.

### 9.3 Sources & Accuracy UI

Default views remain concise. An expandable `Sources & Accuracy` section shows:

- adopted source;
- alternative sources when relevant;
- dataset version;
- calculation model;
- verified date range;
- expected error;
- current visual-scale enhancement;
- whether the result is calculated, dataset-verified or visually approximated.

Suggested user-facing accuracy labels:

- Educational Accuracy;
- High Precision;
- Outside Verified Range;
- Visual Enhancement Active;
- Source Conflict.

### 9.4 Date-range policy

The application should expose a verified high-precision range based on the actual installed data package. A practical initial target is 1900–2100, but release documentation must use the range proven by tests rather than an assumed range.

Advanced Mode MAY permit dates outside the verified range, but it MUST display reduced confidence, estimated error and suitability limitations.

### 9.5 Coordinate and reference systems

Basic Mode:

- heliocentric view;
- geocentric view.

Advanced Mode SHOULD support:

- ecliptic coordinates;
- equatorial coordinates;
- horizontal coordinates;
- Solar System barycentric reference;
- explicit epoch such as J2000 when applicable.

### 9.6 Advanced corrections

Advanced providers MAY support:

- major-body perturbations;
- precession;
- nutation;
- light-time correction;
- aberration;
- atmospheric refraction for ground observation.

Each correction must show whether it is active and must not silently apply ground-observer corrections to the space-view state.

---

## 10. Astronomy data layer and offline data packages

### 10.1 Unified data layer

Explore, Learn and Travel must not directly read vendor-specific datasets. They consume standardised domain records from a unified Astronomy Data Layer.

The layer is responsible for:

- unit normalisation;
- time and coordinate conversion;
- provider selection;
- primary and fallback sources;
- version metadata;
- cross-validation;
- conflict reporting;
- cache compatibility.

### 10.2 Offline baseline

The app MUST include a validated, versioned offline baseline sufficient for:

- planetary and lunar motion;
- basic moon phases;
- basic seasons;
- core event demonstrations;
- existing Explore functionality.

### 10.3 Optional update packages

Users MAY download packages by:

- year range;
- observer location;
- learning topic;
- advanced ephemeris provider.

Each package must show size, source, version, supported range, licence and compatibility.

### 10.4 Storage

- IndexedDB is the preferred browser store.
- Common results may be cached automatically.
- User-downloaded packages must not be silently deleted.
- The UI must show storage usage and allow selective cleanup.
- Failed updates must preserve the previous working package.

### 10.5 Update process

- No forced background replacement.
- User sees release notes and accuracy changes.
- Packages require checksum and schema validation.
- At least one previous stable version should be recoverable.
- Core offline use continues when update checking fails.

---

## 11. Learn Mode

### 11.1 Learning style

Learn Mode provides guided observations and explanations, not quests, points, achievements or levels.

The first teaching modules are:

1. Moon phases.
2. Solar and lunar eclipses.
3. Seasons and Earth's axial tilt.

### 11.2 Event jump catalogue

The initial event catalogue should include:

- new moon;
- first quarter;
- full moon;
- last quarter;
- solar eclipse;
- lunar eclipse;
- conjunction;
- opposition;
- perihelion;
- aphelion.

Event times and positions must be calculated or loaded from a verified dataset. They must not be hard-coded as a purely visual animation.

### 11.3 Object information cards

When an object is focused, the information experience is layered.

Summary:

- name;
- object type;
- one-sentence description.

Basic science:

- radius;
- mass;
- surface gravity where applicable;
- rotation period;
- orbital period;
- mean temperature where meaningful;
- distance from the Sun.

Advanced information:

- orbital parameters;
- atmospheric composition;
- axial tilt;
- perihelion and aphelion;
- exploration history;
- sources and accuracy.

Desktop uses an expandable side card. Mobile uses a full-screen fade panel. Closing it preserves camera and time state.

### 11.4 Observer-location mode

Users may:

- manually select a city;
- enter latitude and longitude;
- optionally grant device location;
- save multiple named locations;
- compare the same event at different locations.

The application must not request location on first launch. Precise location remains local unless the user explicitly exports or syncs it.

### 11.5 Ground Observer View

The complete observer view SHOULD include:

- draggable sky view;
- horizon;
- cardinal directions;
- local date, time and time zone;
- altitude and azimuth;
- object paths;
- eclipse phases;
- atmospheric scattering toggle;
- light-pollution toggle;
- Real Sky and Enhanced Learning presentation.

Atmospheric and light-pollution effects alter visibility only. They must not alter the calculated celestial position.

---

## 12. Immersive visual system

### 12.1 Art direction

- scientifically credible;
- dark, restrained NASA-inspired interface;
- cinematic depth without exaggerated science-fiction effects;
- planets remain the visual priority;
- no decorative overlay that obscures teaching or interaction.

### 12.2 Starfield and background

- multi-depth starfield;
- subtle parallax;
- restrained dust or nebula ambience;
- quality-tier scaling;
- no excessive bloom or colourful fog that reduces scientific readability.

### 12.3 Camera

- smooth overview-to-focus transition;
- reduced-motion alternative;
- avoid sudden jumps or uncontrolled camera shake;
- camera state must persist when opening panels;
- Focus, Follow and Free cameras must share consistent input rules.

### 12.4 Labels

- avoid overlap near the Sun and inner planets;
- collision-aware placement;
- priority based on focus and zoom;
- fade or cluster secondary labels;
- minimum touch target independent from label text size;
- labels must remain readable against bright objects.

### 12.5 Sound

The application may provide:

- ambient layer;
- interface feedback;
- spacecraft interior and propulsion feedback;
- optional narration;
- stylised mission-control communication.

All sound MUST be muted by default. Sound categories require separate volume controls. The UI must explain that external sound in vacuum is a cinematic or educational representation, while interior spacecraft sound may be physically meaningful.

---

## 13. Asteroid belt, Jupiter and Saturn enhancement

### 13.1 Main asteroid belt

The first enhanced belt is located between Mars and Jupiter.

It must not look like a solid wall of rocks. Real spacing remains sparse; visual density may be enhanced for readability and must be labelled.

Quality tiers:

- Low: sparse representative particles and broad belt shape;
- Medium: varied size, orbit and depth;
- High: richer near-view objects, rotation, irregular shape and lighting;
- Auto: dynamically selects density and detail.

Performance degradation must reduce count and shading before affecting orbital calculations.

### 13.2 Jupiter

Improvements should include:

- stronger band depth;
- readable Great Red Spot;
- atmospheric variation without texture blur;
- stable close-up lighting;
- no fake magnetic visualisation unless clearly labelled as an educational overlay.

### 13.3 Saturn

Improvements should include:

- multi-layer ring appearance;
- transparent gaps and radial variation;
- ring shadow on the planet;
- stable ring hierarchy with no shaking regression;
- close-up detail scaled by quality tier.

---

## 14. Travel Mode — spacecraft simulation

### 14.1 First-release scope

- Launch origin: Earth only.
- Destination: all eight planets.
- Moon MAY appear as an introductory destination if it does not delay the Earth-to-planet architecture.
- Destinations are grouped by estimated time, distance and mission complexity, not game level.
- The route engine must support future origins without hard-coding Earth into every domain type.

### 14.2 Entry points

Travel Mode is accessible from:

- the Control Center;
- a selected object's information card.

Both entry points open the same mission-planning state. Switching entry points must not reset the current plan.

### 14.3 Trajectory presentation

Basic Mode:

- readable transfer arc;
- departure and destination;
- spacecraft position;
- estimated arrival date;
- remaining distance and time;
- automatic route planning.

Advanced Mode:

- transfer orbit;
- launch window;
- intercept point;
- departure burn;
- course correction;
- arrival burn;
- orbital insertion;
- Delta-v budget;
- route comparison.

### 14.4 Route options

Advanced Mode should compare when applicable:

- direct transfer;
- Hohmann transfer;
- gravity-assist route.

Invalid routes must be rejected with a scientific explanation. The system must not draw an impossible trajectory merely for cinematic effect.

### 14.5 Fuel and realism

Default behaviour is simplified and assisted.

Optional Advanced Realism controls:

- Unlimited Fuel;
- Fuel Simulation;
- Assisted Navigation;
- launch-window restrictions;
- Delta-v budget;
- propulsion assumptions.

Fuel exhaustion must not unexpectedly terminate a Basic learning session.

### 14.6 Cameras

First spacecraft release:

- Follow Camera;
- Free Camera.

Cockpit view is deferred. Follow Camera should offer near, standard and far offsets and must avoid excessive shake.

### 14.7 Mission time

- Mission dates and duration remain physically meaningful.
- Users may accelerate simulation time.
- Cruise phases may run quickly.
- Launch, burns, fly-bys and orbital insertion may automatically slow or pause.
- `Auto Pause at Key Events` must be optional.
- Time acceleration changes viewing speed, not trajectory outcome.

### 14.8 Spacecraft design

The initial vehicle is an original modern engineering design inspired by contemporary reusable launch and deep-space systems, without copying any real model.

Suggested modular representation:

- launch vehicle;
- transfer stage;
- science/crew module.

The first mission type is robotic science exploration rather than crewed flight.

---

## 15. Robotic probe missions

### 15.1 Initial mission types

First Travel release:

- fly-by;
- orbiter.

Deferred:

- lander;
- rover;
- atmospheric probe;
- sample return.

### 15.2 Instruments

Basic Mode automatically selects a simplified payload.

Advanced Mode may allow selection of:

- camera;
- spectrometer;
- magnetometer;
- particle detector;
- radar or altimeter.

Each instrument should declare mass, power, data type and mission purpose when those values are modelled.

### 15.3 Science data presentation

Basic Mode:

- understandable discovery cards;
- clear distinction between observed result, model inference and known reference fact.

Advanced Mode:

- NASA-style mission dashboard;
- charts and time-series data;
- units and uncertainty;
- source and algorithm;
- raw-data export;
- CSV, JSON, image and teaching-report output.

No random values may be presented as scientific sensor data.

---

## 16. Advanced mission systems

These capabilities belong to a later phase and use Basic/Advanced layering.

### 16.1 Communication

Basic:

- immediate command execution;
- display the real expected one-way delay for education.

Advanced:

- speed-of-light delay;
- command queue;
- send, receive and execution timestamps;
- data downlink;
- occultation-related interruption;
- signal and bandwidth model.

### 16.2 Energy

Basic:

- automatic power management;
- simple battery, generation and shadow status.

Advanced:

- solar-panel orientation and efficiency;
- distance-from-Sun effect;
- battery capacity;
- instrument and communication load;
- eclipse periods;
- safe mode;
- outer-planet energy alternatives.

### 16.3 Thermal control

Basic:

- automatic thermal management;
- normal, cold, hot and danger states.

Advanced:

- solar heating;
- orientation;
- shadows;
- equipment heat;
- radiators;
- insulation and thermal inertia;
- energy and schedule trade-offs.

### 16.4 Radiation and space weather

Basic:

- radiation level;
- solar activity state;
- magnetic protection explanation;
- automatic protection.

Advanced:

- solar wind;
- energetic particles;
- cosmic rays;
- flares and CMEs;
- planetary radiation belts;
- shielding;
- accumulated dose;
- instrument noise and single-event risk.

Offline packages should contain historical and teaching scenarios. Online mode may optionally retrieve current space-weather data. Historical observation, modelled scenario and teaching enhancement must be labelled separately.

### 16.5 Failures and risk

Failures must derive from modelled conditions, not arbitrary random events.

The system should expose:

- risk source;
- probability or confidence;
- warning signals;
- mitigation options;
- effect on time, energy and scientific objectives.

Basic Mode explains and automatically recovers where possible. Advanced Mode may require user decisions.

---

## 17. Technical architecture

### 17.1 Required domain modules

The implementation should evolve toward the following services:

- `SimulationClock`
- `AstronomyEngine`
- `EphemerisProvider`
- `CoordinateTransformService`
- `AstronomicalEventEngine`
- `ObserverLocationService`
- `VisualScaleAdapter`
- `TrajectoryEngine`
- `MissionStateMachine`
- `DataProvenanceRegistry`
- `OfflinePackageManager`
- `AudioService`
- `ExportService`

Explore, Learn and Travel must consume these services rather than duplicate their own orbital logic.

### 17.2 Execution model

- JavaScript/TypeScript core for immediate offline simulation.
- Web Worker for heavy calculations.
- Optional WebAssembly for high-precision modules.
- Main thread dedicated to interaction and rendering.
- IndexedDB for projects, presets, locations, packages and calculation cache.
- Service Worker for application-shell and validated asset caching.

### 17.3 Existing runtime compatibility

All work must preserve the v0.4.4 shared-runtime approach:

- one authoritative runtime source;
- generated standalone runtime;
- no manually duplicated standalone implementation;
- shared Worker and texture dependencies;
- exact source/dist asset validation;
- standalone and ZIP parity.

### 17.4 Engine abstraction

Third-party astronomy libraries must be wrapped behind the project interface.

Each dependency requires:

- pinned version;
- licence record;
- commercial-use review;
- accuracy tests;
- supported range;
- replacement strategy.

A provider upgrade must pass scientific regression before release.

---

## 18. Accessibility and localisation

### 18.1 Accessibility

The product MUST support:

- keyboard navigation;
- visible focus states;
- accessible labels and roles;
- screen-reader-friendly data summaries;
- high contrast;
- Reduced Motion;
- captions/transcripts for narration;
- non-audio equivalents for alerts;
- adequate touch-target sizes;
- no information conveyed only by colour.

### 18.2 Localisation

Initial UI and teaching-content target:

- English;
- Simplified Chinese.

Architecture must support additional locales without hard-coded text. Scientific units, dates, decimal formatting and time-zone labels must be locale aware, while scientific raw exports may use stable machine-readable formats.

---

## 19. Privacy and security

- No location request on first launch.
- Location permission is optional and purpose-specific.
- Saved locations remain local by default.
- No mandatory account or cloud sync.
- No silent analytics requirement.
- Downloaded datasets require checksum and schema validation.
- Unknown or incompatible licences block release.
- External live-data requests must be optional, visible and failure tolerant.
- Exported files must record included location data so users understand what they are sharing.

---

## 20. Export, PWA and offline requirements

Every release must preserve:

- installable PWA behaviour;
- offline reload after first successful installation;
- zero-CDN standalone HTML;
- source ZIP export;
- `.scienceproject` save/load compatibility or documented migration;
- Three.js primary rendering;
- Canvas fallback;
- desktop, tablet and mobile responsiveness.

New simulation state should be exportable where relevant:

- experience and complexity mode;
- scale and quality mode;
- simulation date and time;
- focus and camera;
- observer location when intentionally included;
- data-source versions;
- accuracy status;
- mission plan and state;
- visual-enhancement disclosures.

---

## 21. Performance requirements

### 21.1 Priority order under load

When performance is insufficient, reduce in this order:

1. asteroid and particle count;
2. starfield depth;
3. shadow and post-processing quality;
4. texture resolution or progressive loading;
5. nonessential animation frequency.

Do not silently reduce scientific calculation precision solely to maintain rendering frame rate.

### 21.2 Quality profiles

- Auto;
- Performance;
- Balanced;
- Scientific Precision.

Scientific Precision may reduce visual effects to reserve resources for high-precision calculation.

### 21.3 Responsiveness

- Time slider and camera input must remain responsive while heavy calculations run.
- High-precision jobs require progress and cancellation.
- Approximate preview may be shown first, then replaced by the validated result with an accuracy-status update.

---

## 22. Scientific verification and release gates

Each relevant release must include a Scientific Accuracy Report.

The report should include:

- data sources and versions;
- verified date range;
- test-event count;
- pass/fail summary;
- average and maximum time error;
- angular and positional error where applicable;
- source conflicts;
- visual simplifications;
- changes from the previous release;
- known limitations.

Automated regression should cover known examples of:

- moon phases;
- solar and lunar eclipses;
- planetary orbital repetition;
- opposition and conjunction;
- perihelion and aphelion;
- observer-location differences;
- time-zone and calendar conversion;
- spacecraft transfer sanity checks.

A scientific regression beyond the defined threshold MUST block release.

---

## 23. Phased roadmap

### v0.5 — Mobile Immersion & Time Foundation

Primary objective: make the existing explorer genuinely immersive and usable on mobile while establishing the authoritative time foundation.

Scope:

- minimal mobile canvas;
- draggable bottom-right floating button;
- full-screen fade Control Center;
- Tabs + Cards information architecture;
- removal of permanent mobile toolbar and timeline;
- unified Simulation Clock;
- minute/hour/day/week/month/year presets;
- custom presets;
- fine speed slider;
- date/time picker;
- Advanced reverse time and timeline;
- focus-state consistency fix;
- label collision improvement;
- touch and safe-area improvements;
- asteroid-belt quality tiers;
- Jupiter and Saturn close-up polish;
- NASA-inspired cinematic background refinement;
- no regression to offline, export, Canvas or existing planet/Moon behaviour.

Acceptance summary:

- mobile canvas remains unobstructed when the Control Center is closed;
- no horizontal overflow on supported phones and tablets;
- floating control persists and restores correctly;
- all celestial state derives from Simulation Clock;
- reverse time recomputes deterministic positions;
- standalone HTML and ZIP expose equivalent behaviour;
- cross-browser/device QA passes.

### v0.6 — Scientific Learning & Observation

Primary objective: establish the product as a scientifically credible education simulator.

Scope:

- Explore and Learn modes;
- Basic and Advanced complexity layer;
- Learning/Real Distance/Real Scale modes;
- object information cards;
- moon phases;
- solar and lunar eclipses;
- seasons and axial tilt;
- conjunction, opposition, perihelion and aphelion;
- event jump;
- Astronomy Engine interface;
- data provenance and accuracy UI;
- high-precision provider framework;
- location selection;
- ground observer view;
- multi-location event comparison;
- scientific accuracy regression report.

### v0.7 — Spacecraft Travel

Primary objective: add realistic but approachable Earth-origin interplanetary travel.

Scope:

- Travel Mode;
- Earth-only launch origin;
- eight-planet destinations;
- destination distance/time/complexity grouping;
- automatic Basic route planning;
- Advanced transfer orbit, launch window and Delta-v display;
- direct, Hohmann and gravity-assist comparison where supported;
- Follow and Free cameras;
- simplified default fuel model;
- optional Advanced Realism;
- robotic fly-by and orbiter missions;
- real mission dates and accelerated cruise;
- key-event auto pause;
- original modern spacecraft asset.

### v0.8 — Advanced Mission Systems

Primary objective: deepen robotic-science and mission-control education.

Scope:

- selectable instruments;
- mission science dashboard;
- deterministic scientific data;
- communication delay and command queue;
- data downlink;
- energy management;
- thermal control;
- radiation and space weather;
- historical event replay;
- optional current space-weather update;
- condition-based failures and risk;
- raw data and teaching-report export.

---

## 24. Explicit non-goals for the current vNext programme

The following are not part of the immediate programme unless a later approved specification adds them:

- game points, levels, rewards or campaign progression;
- combat or weapons;
- fictional aliens or narrative storylines;
- multiplayer universe;
- full cockpit/manual six-degree-of-freedom flight in the first Travel release;
- launch from every planet in the first Travel release;
- crew life-support simulation;
- lander, rover or sample-return implementation in the first Travel release;
- every moon and minor body in one release;
- mandatory cloud services;
- automatic sound playback;
- unverified scientific claims or decorative random sensor data.

---

## 25. Programme Definition of Done

A roadmap release is complete only when:

1. all in-scope acceptance criteria pass;
2. TypeScript typecheck and production build pass;
3. domain, export and regression tests pass;
4. Chromium, Firefox and WebKit are inspected on desktop, tablet and mobile;
5. accessibility has no blocking violations;
6. PWA install/offline/update behaviour is verified;
7. standalone HTML opens directly without network dependency;
8. ZIP export contains required source, data, assets and attribution;
9. published asset URLs return successful HTTP status;
10. source and dist asset sizes or hashes are validated where required;
11. scientific accuracy report passes defined thresholds;
12. licence and attribution checks pass;
13. release notes, rollback point and verified backup are recorded;
14. the published URL is inspected after deployment;
15. no existing v0.4.4 capability regresses without an approved migration note.

---

## 26. Final approved product decision

Solar System Explorer vNext will be developed as a phased educational simulation platform rather than a one-release feature expansion.

The immediate implementation target is:

> **v0.5 Mobile Immersion & Time Foundation**

Travel, advanced astronomy and mission-control systems must be built on top of the shared Simulation Clock, Astronomy Engine interfaces and mobile interaction model rather than added as isolated UI demonstrations.
