import { chromium, firefox, webkit } from 'playwright';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const dist = join(root, 'dist');
const browserName = process.env.VIEWPORT_QA_BROWSER ?? 'chromium';
const viewportName = process.env.VIEWPORT_QA_VIEWPORT ?? 'desktop';
const forceCanvas = process.env.VIEWPORT_QA_FORCE_CANVAS === '1';
const browserType = { chromium, firefox, webkit }[browserName];
const sizes = {
  desktop: { width: 1280, height: 800, hasTouch: false },
  wideEdge: { width: 1200, height: 800, hasTouch: false },
  compactEdge: { width: 1199, height: 800, hasTouch: false },
  compactDesktop: { width: 1117, height: 837, hasTouch: false },
  compact: { width: 891, height: 786, hasTouch: true },
  zoomEquivalent: { width: 640, height: 800, hasTouch: false },
  tablet: { width: 768, height: 1024, hasTouch: true },
  mobile: { width: 390, height: 844, hasTouch: true },
};
const size = sizes[viewportName];
if (!browserType || !size) throw new Error('Unsupported browser or viewport.');
const immersiveShell = size.width <= 900 || (size.height > size.width && size.width <= 1100);
const compactShell = !immersiveShell && size.width < 1200;
if (!existsSync(join(dist, 'index.html'))) throw new Error('dist/index.html is missing.');

const runId = `${new Date().toISOString().replace(/[:.]/g, '-')}-${browserName}-${viewportName}-${process.pid}`;
const evidence = process.env.VIEWPORT_QA_EVIDENCE_DIR
  ? resolve(root, process.env.VIEWPORT_QA_EVIDENCE_DIR)
  : join(root, 'qa-evidence', 'viewport-smoke', runId);
mkdirSync(evidence, { recursive: true });

const mime = { html: 'text/html', js: 'text/javascript', css: 'text/css', json: 'application/json', webmanifest: 'application/manifest+json', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg' };
let baseUrl = '';
const server = createServer((request, response) => {
  try {
    const url = new URL(request.url ?? '/', baseUrl || 'http://127.0.0.1/');
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    let path = resolve(dist, relative);
    if (!path.startsWith(`${dist}/`) && path !== dist) return response.writeHead(403).end();
    if (!existsSync(path)) path = join(dist, 'index.html');
    const extension = path.split('.').pop()?.toLowerCase() ?? '';
    response.writeHead(200, { 'Content-Type': `${mime[extension] ?? 'application/octet-stream'}${['html', 'js', 'css', 'json'].includes(extension) ? '; charset=utf-8' : ''}`, 'Cache-Control': 'no-store' });
    response.end(readFileSync(path));
  } catch (error) {
    response.writeHead(500).end(error instanceof Error ? error.message : String(error));
  }
});

const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
const assert = (value, message) => { if (!value) throw new Error(message); };

async function ready(page) {
  const deadline = Date.now() + 60_000;
  let state;
  while (Date.now() < deadline) {
    try {
      state = await page.evaluate(() => ({
        marker: document.documentElement.dataset.qaBridge,
        canvas: Boolean(document.querySelector('#runtime-viewport canvas')),
        fatal: document.querySelector('.fatal-error')?.textContent ?? null,
        modules: document.querySelectorAll('[data-learning-module]').length,
        observers: document.querySelectorAll('#observer-location-select option').length,
        travel: Boolean(document.querySelector('#travel-mode-root')),
      }));
      if (state.marker === 'ready' && state.canvas && !state.fatal && state.modules === 3 && state.observers >= 5 && state.travel) return state;
    } catch (error) {
      state = { error: error instanceof Error ? error.message : String(error) };
    }
    await sleep(100);
  }
  throw new Error(`Viewport startup timeout: ${JSON.stringify(state)}`);
}

async function run() {
  await new Promise((resolveStart, rejectStart) => {
    server.once('error', rejectStart);
    server.listen(0, '127.0.0.1', resolveStart);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Server port is unavailable.');
  baseUrl = `http://127.0.0.1:${address.port}/`;

  const browser = await browserType.launch(browserName === 'chromium' ? { headless: true, args: ['--disable-dev-shm-usage'] } : { headless: true });
  const context = await browser.newContext({ viewport: { width: size.width, height: size.height }, hasTouch: size.hasTouch });
  if (forceCanvas) await context.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function patched(type, ...args) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
      return original.call(this, type, ...args);
    };
  });

  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  const httpErrors = [];
  const requests = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('request', (request) => requests.push(request.url()));
  page.on('requestfailed', (request) => failedRequests.push(`${request.method()} ${request.url()}`));
  page.on('response', (response) => { if (response.status() >= 400) httpErrors.push(`${response.status()} ${response.url()}`); });

  await page.goto(`${baseUrl}?qa=1`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  const startup = await ready(page);
  const state = await page.evaluate(() => {
    const canvas = document.querySelector('#runtime-viewport canvas');
    const visible = (selector) => {
      const element = document.querySelector(selector);
      return element instanceof HTMLElement && !element.hidden && getComputedStyle(element).display !== 'none' && element.getClientRects().length > 0;
    };
    return {
      title: document.title,
      version: (document.body.textContent ?? '').includes('v0.7.0'),
      focusCount: document.querySelectorAll('#focus-select option').length,
      renderer: canvas?.classList.contains('canvas-fallback') ? 'canvas-2d' : 'webgl',
      topbar: visible('.topbar'),
      toolbar: visible('.workspace-toolbar'),
      floating: visible('#floating-control-button'),
      shellMode: document.querySelector('.app-shell')?.dataset.responsiveShell,
      topLocale: visible('#topbar-locale-select'),
      mobileLocale: visible('#mobile-locale-select'),
      bodyWidth: document.body.scrollWidth,
      innerWidth: window.innerWidth,
      travelTab: document.querySelectorAll('[data-control-tab="travel"]').length,
      learnTab: document.querySelectorAll('[data-control-tab="learn"]').length,
      observeTab: document.querySelectorAll('[data-control-tab="observe"]').length,
      topbarGroupsOverlap: (() => {
        const center = document.querySelector('.topbar-center')?.getBoundingClientRect();
        const actions = document.querySelector('.topbar-actions')?.getBoundingClientRect();
        return Boolean(center && actions && center.width > 0 && actions.width > 0 && center.right > actions.left);
      })(),
    };
  });

  assert(state.title === 'Scientific Animation Generator', 'Wrong document title.');
  assert(state.version, 'v0.7.0 label is missing.');
  assert(state.focusCount === 10, `Expected 10 celestial objects, received ${state.focusCount}.`);
  assert(state.travelTab === 1 && state.learnTab === 1 && state.observeTab === 1, 'Control Center tabs are incomplete.');
  assert(state.bodyWidth <= state.innerWidth + 1, `Horizontal overflow ${state.bodyWidth} > ${state.innerWidth}.`);
  if (!immersiveShell) {
    assert(state.topbar && state.toolbar, 'Desktop shell is hidden.');
    assert(!state.topbarGroupsOverlap, 'Topbar project controls overlap the action buttons.');
    assert(state.topLocale && !state.mobileLocale, 'Desktop language selector visibility is incorrect.');
  }
  else {
    assert(!state.topbar && !state.toolbar && state.floating, 'Mobile/tablet immersive shell is incorrect.');
    assert(!state.topLocale, 'Immersive shell exposed the desktop language selector.');
  }
  assert(state.shellMode === (immersiveShell ? 'immersive' : compactShell ? 'compact' : 'wide'), `Unexpected responsive shell mode ${state.shellMode}.`);
  if (forceCanvas) assert(state.renderer === 'canvas-2d', `Forced Canvas rendered as ${state.renderer}.`);
  else if (browserName === 'chromium' || browserName === 'webkit') assert(state.renderer === 'webgl', `${browserName} rendered as ${state.renderer}.`);

  if (!forceCanvas && viewportName === 'compact') {
    const compactOverview = await page.evaluate(() => ({
      diagnostics: window.__SCIENCE_QA__?.getVisualDiagnostics(),
      stage: (() => {
        const rect = document.querySelector('.runtime-stage')?.getBoundingClientRect();
        return rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null;
      })(),
      labels: [...document.querySelectorAll('.planet-label')]
        .filter((element) => getComputedStyle(element).display !== 'none')
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return { text: element.textContent ?? '', left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
        }),
    }));
    const clippedObjects = compactOverview.diagnostics?.objects?.filter((object) => !object.fullyInViewport) ?? [];
    assert(clippedObjects.length === 0, `Compact overview clips: ${clippedObjects.map((object) => object.id).join(', ')}`);
    assert(compactOverview.labels.length <= 6, `Compact overview shows ${compactOverview.labels.length} labels; expected at most 6.`);
    const overlappingLabels = compactOverview.labels.flatMap((label, index) => (
      compactOverview.labels.slice(index + 1).filter((other) => (
        label.left < other.right && label.right > other.left && label.top < other.bottom && label.bottom > other.top
      )).map((other) => `${label.text}/${other.text}`)
    ));
    assert(overlappingLabels.length === 0, `Compact overview label overlap: ${overlappingLabels.join(', ')}`);
    const bodyLabelOverlaps = compactOverview.stage
      ? compactOverview.labels.flatMap((label) => (
          (compactOverview.diagnostics?.objects ?? []).filter((object) => {
            const centerX = compactOverview.stage.left + (object.ndcX * 0.5 + 0.5) * compactOverview.stage.width;
            const centerY = compactOverview.stage.top + (-object.ndcY * 0.5 + 0.5) * compactOverview.stage.height;
            const radius = object.projectedRadiusNdcY * compactOverview.stage.height * 0.5;
            const closestX = Math.max(label.left, Math.min(centerX, label.right));
            const closestY = Math.max(label.top, Math.min(centerY, label.bottom));
            return Math.hypot(centerX - closestX, centerY - closestY) < radius;
          }).map((object) => `${label.text}/${object.id}`)
        ))
      : ['missing-stage'];
    assert(bodyLabelOverlaps.length === 0, `Compact overview label/body overlap: ${bodyLabelOverlaps.join(', ')}`);
  }

  await page.evaluate(() => window.__SCIENCE_QA__?.setPlaying(false));
  await page.waitForTimeout(80);
  const labelToggle = page.locator('#parameter-controls-extra input[data-parameter="showLabels"]');
  await labelToggle.evaluate((input) => {
    input.checked = false;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForTimeout(120);
  const labelsDisabled = await page.evaluate(() => ({
    parameter: window.__SCIENCE_QA__?.getRuntimeSnapshot().parameters.showLabels,
    visibleLabels: [...document.querySelectorAll('.planet-label:not(.spacecraft-label)')]
      .filter((label) => !label.hidden && getComputedStyle(label).display !== 'none')
      .map((label) => label.textContent ?? ''),
  }));
  assert(labelsDisabled.parameter === false, 'Planet label toggle did not reach the runtime snapshot.');
  assert(labelsDisabled.visibleLabels.length === 0, `Disabled planet labels remained visible: ${labelsDisabled.visibleLabels.join(', ')}`);

  await labelToggle.evaluate((input) => {
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForTimeout(120);
  const labelsRestored = await page.evaluate(() => ({
    parameter: window.__SCIENCE_QA__?.getRuntimeSnapshot().parameters.showLabels,
    visibleLabels: [...document.querySelectorAll('.planet-label:not(.spacecraft-label)')]
      .filter((label) => !label.hidden && getComputedStyle(label).display !== 'none').length,
  }));
  assert(labelsRestored.parameter === true, 'Planet label toggle did not restore the runtime parameter.');
  if (!forceCanvas) assert(labelsRestored.visibleLabels > 0, 'Planet labels did not return after re-enabling the toggle.');
  await page.evaluate(() => window.__SCIENCE_QA__?.setPlaying(true));

  let drawerResult;
  if (compactShell) {
    const workspaceBefore = await page.locator('.workspace').boundingBox();
    const templatesHitTarget = await page.evaluate(() => {
      const button = document.querySelector('#toggle-templates-panel');
      const rect = button?.getBoundingClientRect();
      if (!rect) return null;
      const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      return { rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height }, hit: hit?.closest('button')?.id ?? hit?.tagName ?? null };
    });
    assert(templatesHitTarget?.hit === 'toggle-templates-panel', `Templates trigger is covered: ${JSON.stringify(templatesHitTarget)}`);
    await page.locator('#toggle-templates-panel').click();
    await page.waitForTimeout(220);
    const templatesOpen = await page.evaluate(() => ({
      drawer: document.querySelector('.app-shell')?.dataset.compactDrawer,
      visible: document.querySelector('#templates-panel')?.getAttribute('aria-hidden') === 'false',
      inspectorHidden: document.querySelector('#inspector-panel')?.getAttribute('aria-hidden') === 'true',
      role: document.querySelector('#templates-panel')?.getAttribute('role'),
      modal: document.querySelector('#templates-panel')?.getAttribute('aria-modal'),
      focusedInside: Boolean(document.querySelector('#templates-panel')?.contains(document.activeElement)),
      active: document.activeElement ? `${document.activeElement.tagName}#${document.activeElement.id}.${document.activeElement.className}` : null,
      panelInert: Boolean(document.querySelector('#templates-panel')?.inert),
      close: (() => {
        const close = document.querySelector('#templates-panel [data-close-compact-drawer]');
        if (!close) return null;
        const rect = close.getBoundingClientRect();
        return { display: getComputedStyle(close).display, rect: [rect.x, rect.y, rect.width, rect.height], disabled: close.disabled };
      })(),
    }));
    const workspaceTemplates = await page.locator('.workspace').boundingBox();
    assert(templatesOpen.drawer === 'templates' && templatesOpen.visible && templatesOpen.inspectorHidden, 'Templates drawer did not open exclusively.');
    assert(templatesOpen.role === 'dialog' && templatesOpen.modal === 'true' && templatesOpen.focusedInside, `Templates drawer accessibility state is incomplete: ${JSON.stringify(templatesOpen)}`);
    assert(JSON.stringify(workspaceTemplates) === JSON.stringify(workspaceBefore), 'Templates drawer changed the workspace rectangle.');
    await page.screenshot({ path: join(evidence, `viewport-${browserName}-${viewportName}-templates-drawer.png`) });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(40);
    assert(await page.evaluate(() => document.querySelector('.app-shell')?.dataset.compactDrawer === 'none'), 'Escape did not close the compact drawer.');
    assert(await page.evaluate(() => document.activeElement === document.querySelector('#toggle-templates-panel')), 'Compact drawer did not restore focus.');

    await page.locator('#toggle-inspector-panel').click();
    await page.waitForTimeout(220);
    const workspaceInspector = await page.locator('.workspace').boundingBox();
    assert(JSON.stringify(workspaceInspector) === JSON.stringify(workspaceBefore), 'Inspector drawer changed the workspace rectangle.');
    await page.locator('#compact-drawer-backdrop').click({ position: { x: 4, y: 4 } });
    await page.waitForTimeout(40);
    assert(await page.evaluate(() => document.querySelector('.app-shell')?.dataset.compactDrawer === 'none'), 'Backdrop did not close the compact drawer.');
    drawerResult = { overlay: true, exclusive: true, escapeClose: true, backdropClose: true, focusRestore: true };
  }
  if (!immersiveShell && !compactShell) {
    await page.locator('#toggle-templates-panel').click();
    await page.waitForTimeout(80);
    const widePanel = await page.evaluate(() => {
      const panel = document.querySelector('#templates-panel')?.getBoundingClientRect();
      const activeCard = document.querySelector('.template-card.is-active')?.getBoundingClientRect();
      const activeBadge = document.querySelector('.template-card.is-active em')?.getBoundingClientRect();
      const buttons = [...document.querySelectorAll('.panel-footer .panel-history-button')].map((button) => button.getBoundingClientRect());
      return {
        visible: document.querySelector('#templates-panel')?.getAttribute('aria-hidden') === 'false',
        badgeInside: Boolean(activeCard && activeBadge && activeBadge.left >= activeCard.left && activeBadge.right <= activeCard.right && activeBadge.top >= activeCard.top && activeBadge.bottom <= activeCard.bottom),
        footerAligned: buttons.length === 2 && Math.abs(buttons[0].top - buttons[1].top) < 1 && buttons.every((button) => button.height >= 44),
        footerInside: Boolean(panel && buttons.every((button) => button.bottom <= panel.bottom + 1)),
      };
    });
    assert(widePanel.visible && widePanel.badgeInside && widePanel.footerAligned && widePanel.footerInside, `Wide Template Library layout is invalid: ${JSON.stringify(widePanel)}`);
    await page.locator('#toggle-templates-panel').click();
    await page.waitForTimeout(40);
  }

  const controlTrigger = immersiveShell ? '#floating-control-button' : '#open-control-center-button';
  await page.locator(controlTrigger).click();
  await page.waitForTimeout(80);
  const dialogOpen = await page.evaluate(() => {
    const dialog = document.querySelector('#control-center');
    const active = document.activeElement;
    const body = document.querySelector('.control-center-body');
    if (!(dialog instanceof HTMLDialogElement) || !(body instanceof HTMLElement)) return null;
    const scrollSamples = [];
    for (const ratio of [0, 0.5, 1]) {
      body.scrollTop = (body.scrollHeight - body.clientHeight) * ratio;
      scrollSamples.push(body.scrollTop);
    }
    body.scrollTop = 0;
    return {
      open: dialog.open,
      focusedInside: active instanceof Element && dialog.contains(active),
      scrollable: body.scrollHeight >= body.clientHeight,
      scrollSamples,
      ariaValueText: document.querySelector('#timescale-input')?.getAttribute('aria-valuetext'),
      mobileLocaleVisible: (() => {
        const locale = document.querySelector('#mobile-locale-select');
        return Boolean(locale && getComputedStyle(locale).display !== 'none' && locale.getClientRects().length > 0);
      })(),
      customPresetGap: (() => {
        const fields = document.querySelector('.preset-form-grid')?.getBoundingClientRect();
        const save = document.querySelector('#save-preset-button')?.getBoundingClientRect();
        return fields && save ? save.top - fields.bottom : 0;
      })(),
      eventCatalogueScrolls: (() => {
        const catalogue = document.querySelector('.time-events-card .event-catalogue');
        return catalogue ? catalogue.scrollHeight > catalogue.clientHeight + 1 : false;
      })(),
      surfaceRect: (() => {
        const rect = document.querySelector('.control-center-surface')?.getBoundingClientRect();
        return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height } : null;
      })(),
    };
  });
  assert(dialogOpen?.open, 'Control Center did not open as a native dialog.');
  assert(dialogOpen.focusedInside, 'Initial Control Center focus is outside the dialog.');
  assert(Boolean(dialogOpen.ariaValueText), 'Time scale is missing aria-valuetext.');
  assert(dialogOpen.mobileLocaleVisible === immersiveShell, 'Control Center language selector visibility is incorrect.');
  assert(dialogOpen.customPresetGap >= 11, `Custom preset action gap is ${dialogOpen.customPresetGap}px.`);
  assert(!dialogOpen.eventCatalogueScrolls, 'Time event catalogue created a nested scroll container.');
  if (immersiveShell && size.width <= 620) {
    assert(dialogOpen.surfaceRect?.height >= size.height - 1, `Mobile Control Center is not full height: ${JSON.stringify(dialogOpen.surfaceRect)}.`);
  } else if (immersiveShell) {
    assert(dialogOpen.surfaceRect?.height >= Math.min(size.height * 0.9, 880), `Tablet Control Center is too short: ${JSON.stringify(dialogOpen.surfaceRect)}.`);
  }
  await page.screenshot({ path: join(evidence, `viewport-${browserName}-${viewportName}-controls-open.png`) });
  await page.locator('[data-experience-mode="learn"]').click();
  await page.waitForFunction(() => document.querySelector('[data-control-panel="learn"]')?.classList.contains('is-active'));
  await page.waitForTimeout(40);
  const guideLayout = await page.evaluate((isImmersive) => {
    const panel = document.querySelector('[data-control-panel="learn"]')?.getBoundingClientRect();
    const intro = document.querySelector('.learning-intro-card')?.getBoundingClientRect();
    const moon = document.querySelector('#moon-phase-root')?.getBoundingClientRect();
    const picker = document.querySelector('.learning-module-picker')?.getBoundingClientRect();
    const stage = document.querySelector('.learning-stage-card')?.getBoundingClientRect();
    const summary = document.querySelector('.learning-stage-summary');
    const lessonTitle = document.querySelector('.lesson-step strong');
    const moduleButtons = [...document.querySelectorAll('.learning-module-picker button')].map((button) => button.getBoundingClientRect());
    const actionButtons = [...document.querySelectorAll('.lesson-actions button')].map((button) => button.getBoundingClientRect());
    const pickerElement = document.querySelector('.learning-module-picker');
    return {
      stageFullWidth: Boolean(panel && stage && stage.width >= panel.width - 1),
      introFullWidth: Boolean(panel && intro && intro.width >= panel.width - 1),
      desktopOverviewAligned: Boolean(moon && picker && Math.abs(moon.top - picker.top) <= 1),
      immersiveSequence: Boolean(moon && picker && stage && moon.bottom <= picker.top + 1 && picker.bottom <= stage.top + 1),
      stageAfterOverview: Boolean(moon && picker && stage && stage.top >= Math.max(moon.bottom, picker.bottom) + 10),
      headingSize: Number.parseFloat(getComputedStyle(document.querySelector('.learning-stage-header h3')).fontSize),
      summarySize: summary ? Number.parseFloat(getComputedStyle(summary).fontSize) : 0,
      lessonTitleSize: lessonTitle ? Number.parseFloat(getComputedStyle(lessonTitle).fontSize) : 0,
      moduleTargets: moduleButtons.every((rect) => rect.height >= 44 && rect.width >= 44),
      actionTargets: actionButtons.every((rect) => rect.height >= 44 && rect.width >= 44),
      pickerHorizontalOnly: pickerElement ? pickerElement.scrollHeight <= pickerElement.clientHeight + 2 : false,
      noDocumentOverflow: document.documentElement.scrollWidth <= innerWidth + 1,
      isImmersive,
    };
  }, immersiveShell);
  assert(guideLayout.stageFullWidth && guideLayout.introFullWidth, `Guide full-width reading flow is invalid: ${JSON.stringify(guideLayout)}`);
  assert(guideLayout.stageAfterOverview, `Guide stage does not follow its overview row: ${JSON.stringify(guideLayout)}`);
  assert(immersiveShell ? guideLayout.immersiveSequence : guideLayout.desktopOverviewAligned, `Guide responsive order is invalid: ${JSON.stringify(guideLayout)}`);
  assert(guideLayout.headingSize >= 18 && guideLayout.summarySize >= 13 && guideLayout.lessonTitleSize >= 14, `Guide type hierarchy is too small: ${JSON.stringify(guideLayout)}`);
  assert(guideLayout.moduleTargets && guideLayout.actionTargets && guideLayout.pickerHorizontalOnly && guideLayout.noDocumentOverflow, `Guide touch/overflow contract failed: ${JSON.stringify(guideLayout)}`);
  await page.screenshot({ path: join(evidence, `viewport-${browserName}-${viewportName}-guide-top.png`) });
  if (immersiveShell) {
    const controlBody = page.locator('.control-center-body');
    await controlBody.evaluate((body) => { body.scrollTop = (body.scrollHeight - body.clientHeight) * 0.5; });
    await page.screenshot({ path: join(evidence, `viewport-${browserName}-${viewportName}-guide-middle.png`) });
    await controlBody.evaluate((body) => { body.scrollTop = body.scrollHeight; });
    await page.screenshot({ path: join(evidence, `viewport-${browserName}-${viewportName}-guide-bottom.png`) });
    await controlBody.evaluate((body) => { body.scrollTop = 0; });
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(40);
  const escaped = await page.evaluate((selector) => ({
    open: (document.querySelector('#control-center')) instanceof HTMLDialogElement
      ? document.querySelector('#control-center').open
      : true,
    focusRestored: document.activeElement === document.querySelector(selector),
  }), controlTrigger);
  assert(!escaped.open, 'Escape did not close the Control Center.');
  assert(escaped.focusRestored, 'Control Center did not restore focus to its trigger.');
  if (size.width > 620) {
    await page.locator(controlTrigger).click();
    await page.waitForTimeout(40);
    await page.locator('#control-center').click({ position: { x: 4, y: 4 } });
    await page.waitForTimeout(40);
    assert(!(await page.locator('#control-center').evaluate((dialog) => dialog.open)), 'Backdrop click did not close the Control Center.');
  }
  await page.locator(controlTrigger).click();
  await page.waitForTimeout(40);
  await page.locator('.control-center-close').click();
  await page.waitForTimeout(40);
  assert(!(await page.locator('#control-center').evaluate((dialog) => dialog.open)), 'Visible close button did not close the Control Center.');
  assert(await page.evaluate((selector) => document.activeElement === document.querySelector(selector), controlTrigger), 'Visible close button did not restore focus.');

  let performanceResult;
  if (!forceCanvas && viewportName === 'desktop') {
    const beforeZoom = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
    await page.locator('[data-view-control="zoom-in"]').click();
    const afterZoom = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
    assert(
      Number(afterZoom?.cameraDistance) < Number(beforeZoom?.cameraDistance),
      'WebGL Zoom In did not change camera distance.',
    );
    await page.locator('[data-view-control="reframe"]').click();
    const reframed = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
    assert(Number(reframed?.cameraDistance) > 0, 'WebGL Frame Overview produced an invalid camera distance.');
    await page.evaluate(() => window.__SCIENCE_QA__?.trackObject('jupiter'));
    await page.waitForTimeout(120);
    const tracked = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
    assert(tracked?.viewMode === 'track', 'WebGL Track did not enter contextual tracking mode.');
    assert(!tracked?.focusDecorationsHidden, 'WebGL Track hid environmental context.');
    assert((tracked?.asteroidSpriteCount ?? 0) > 0, 'WebGL Track hid the asteroid belt.');
    await page.evaluate(() => window.__SCIENCE_QA__?.focusObject('jupiter'));
    await page.waitForTimeout(120);
    const focused = await page.evaluate(() => ({
      diagnostics: window.__SCIENCE_QA__?.getVisualDiagnostics(),
      labels: [...document.querySelectorAll('.planet-label')]
        .filter((element) => getComputedStyle(element).display !== 'none' && !element.hidden)
        .map((element) => element.textContent),
    }));
    const focusedJupiter = focused.diagnostics?.objects?.find((object) => object.id === 'jupiter');
    assert(focused.diagnostics?.viewMode === 'inspect', 'WebGL focus compatibility alias did not enter Inspect mode.');
    assert(focused.diagnostics?.focusedObject === 'jupiter', 'WebGL focus diagnostics report the wrong object.');
    assert(focused.diagnostics?.focusDecorationsHidden, 'WebGL focus left overview decorations visible.');
    assert(
      Number(focusedJupiter?.projectedRadiusNdcY) >= 0.14 && Number(focusedJupiter?.projectedRadiusNdcY) <= 0.25,
      `WebGL focused Jupiter has invalid frame size ${focusedJupiter?.projectedRadiusNdcY}.`,
    );
    assert(focused.labels.join(',') === 'Jupiter', `WebGL focus labels are noisy: ${focused.labels.join(',')}`);
    await page.locator('[data-view-control="reframe"]').click();
  }
  if (forceCanvas && viewportName === 'desktop') {
    const beforeZoom = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
    await page.locator('[data-view-control="zoom-in"]').click();
    const afterZoom = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
    assert(
      Number(afterZoom?.cameraDistance) < Number(beforeZoom?.cameraDistance),
      'Canvas Zoom In did not change camera distance.',
    );
    await page.locator('[data-view-control="reframe"]').click();
    const reframed = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
    assert(Math.abs(Number(reframed?.cameraDistance) - 1) < 0.001, 'Canvas Frame Overview did not restore overview zoom.');
    await page.evaluate(() => window.__SCIENCE_QA__?.trackObject('jupiter'));
    const tracked = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
    assert(tracked?.viewMode === 'track', 'Canvas Track did not enter contextual tracking mode.');
    assert(!tracked?.focusDecorationsHidden, 'Canvas Track hid environmental context.');
    assert((tracked?.asteroidSpriteCount ?? 0) > 0, 'Canvas Track hid the asteroid belt.');
    await page.evaluate(() => window.__SCIENCE_QA__?.focusObject('jupiter'));
    const focused = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
    assert(focused?.viewMode === 'inspect', 'Canvas focus compatibility alias did not enter Inspect mode.');
    assert(focused?.focusedObject === 'jupiter', 'Canvas focus diagnostics report the wrong object.');
    assert(focused?.focusDecorationsHidden, 'Canvas focus left overview decorations visible.');
    await page.locator('[data-view-control="reframe"]').click();

    performanceResult = await page.evaluate(async () => {
      window.__SCIENCE_QA__?.setPlaying(true);
      await new Promise((resolveWarmup) => setTimeout(resolveWarmup, 2_000));
      const longTasks = [];
      const observer = new PerformanceObserver((list) => {
        longTasks.push(...list.getEntries().map((entry) => entry.duration));
      });
      observer.observe({ type: 'longtask', buffered: false });
      await new Promise((resolveSample) => setTimeout(resolveSample, 5_000));
      observer.disconnect();
      const diagnostics = window.__SCIENCE_QA__?.getVisualDiagnostics();
      window.__SCIENCE_QA__?.setPlaying(false);
      await new Promise((resolveIdle) => setTimeout(resolveIdle, 2_000));
      return {
        fps: Number(diagnostics?.measuredFps ?? 0),
        averageFrameMs: Number(diagnostics?.averageFrameMs ?? 0),
        longTaskCount: longTasks.length,
        longTaskTotalMs: longTasks.reduce((sum, duration) => sum + duration, 0),
        idleLabel: document.querySelector('#fps-meter')?.textContent ?? '',
      };
    });
    assert(performanceResult.fps >= 24, `Canvas FPS ${performanceResult.fps.toFixed(1)} is below the CI floor.`);
    assert(performanceResult.longTaskTotalMs < 500, `Canvas long tasks total ${performanceResult.longTaskTotalMs.toFixed(1)} ms.`);
    assert(performanceResult.idleLabel === 'idle', `Paused renderer did not become idle: ${performanceResult.idleLabel}`);
  }

  const external = requests.filter((url) => /^https?:/i.test(url) && !url.startsWith(baseUrl));
  assert(external.length === 0, `External requests: ${external.join(', ')}`);
  assert(consoleErrors.length === 0, `Console errors: ${consoleErrors.join(' | ')}`);
  assert(pageErrors.length === 0, `Page errors: ${pageErrors.join(' | ')}`);
  assert(failedRequests.length === 0, `Failed requests: ${failedRequests.join(' | ')}`);
  assert(httpErrors.length === 0, `HTTP errors: ${httpErrors.join(' | ')}`);

  const screenshot = join(evidence, `viewport-${browserName}-${viewportName}.png`);
  await page.screenshot({ path: screenshot });
  const result = {
    passed: true,
    runId,
    browser: browserName,
    viewport: viewportName,
    renderer: state.renderer,
    forceCanvas,
    width: size.width,
    height: size.height,
    learningModules: startup.modules,
    observerOptions: startup.observers,
    focusCount: state.focusCount,
    noHorizontalOverflow: true,
    nativeDialog: true,
    escapeClose: true,
    backdropClose: true,
    focusRestore: true,
    drawer: drawerResult,
    performance: performanceResult,
    externalRequests: 0,
    consoleErrors,
    pageErrors,
    failedRequests,
    httpErrors,
    screenshot: screenshot.slice(root.length + 1),
  };
  writeFileSync(join(evidence, 'viewport-results.json'), JSON.stringify(result, null, 2));
  await context.close();
  await browser.close();
  return result;
}

try {
  console.log(JSON.stringify(await run(), null, 2));
} catch (error) {
  const failure = { passed: false, runId, browser: browserName, viewport: viewportName, forceCanvas, error: error instanceof Error ? error.stack ?? error.message : String(error) };
  writeFileSync(join(evidence, 'viewport-results.json'), JSON.stringify(failure, null, 2));
  throw error;
} finally {
  if (server.listening) await new Promise((resolveClose) => server.close(resolveClose));
}
