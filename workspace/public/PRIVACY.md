# Privacy and Local Data Handling

Scientific Animation Generator v0.7.0 is an offline-first educational application.

## Data processed by the application

- Simulation time, playback settings, visual settings, focused objects, learning progress and project snapshots.
- Observer location selected from the built-in catalogue or entered manually by the user.
- Files explicitly exported by the user, including standalone HTML and ZIP project packages.

## Application storage and transmission

- Application state and project snapshots are stored locally in the browser on the current device.
- Observer coordinates are used only to calculate the local educational sky view. The application code does not send them to a server.
- The application source contains no analytics, advertising tracker, account system or third-party telemetry integration.
- No personal data is sold, shared by the application or used for model training.
- Exported files remain under the user's control and are not uploaded by the application.
- The standalone HTML export has no CDN, analytics or network dependency.

## Hosted preview platform

The public `content.gmb01.xyz` share page is served by a hosting platform outside the application source. Post-publication inspection observed that this platform injects a Cloudflare Insights performance beacon. The platform and its infrastructure provider may therefore process normal technical request information such as IP address, browser/device metadata, page URL, timing and error/performance signals under their own hosting and privacy terms.

This hosting-layer beacon is not bundled into the project source, PWA assets, standalone HTML export or ZIP export, and the application does not send observer coordinates or saved project state to it.

## Clearing local data

Users can clear saved application state through the browser's site-data controls. Uninstalling the PWA may not remove browser storage automatically on every platform, so site data should also be cleared when a complete reset is required.

## Scientific and location limitation

Observer calculations are educational approximations. The application does not request GPS permission and does not provide authoritative navigation, safety or local eclipse-contact predictions.
