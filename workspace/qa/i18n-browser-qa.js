import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const root = resolve(process.cwd());
const distRoot = join(root, 'dist');
const standalonePath = join(root, 'qa', 'standalone-v0.7.0-smoke.html');
const chineseStandalonePath = join(root, 'qa', 'standalone-v0.7.0-smoke-zh-CN.html');
const types = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.webmanifest', 'application/manifest+json'],
]);
const canonicalSnapshot = (snapshot) => JSON.parse(JSON.stringify(snapshot, (_key, value) =>
  typeof value === 'number' ? Number(value.toPrecision(13)) : value));

const server = createServer((request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
  let filePath = pathname === '/standalone.html'
    ? standalonePath
    : resolve(distRoot, decodeURIComponent(pathname).replace(/^\/+/, '') || 'index.html');
  if (pathname !== '/standalone.html' && (!filePath.startsWith(`${distRoot}/`) || !existsSync(filePath))) {
    filePath = join(distRoot, 'index.html');
  }
  if (!existsSync(filePath)) {
    response.writeHead(404).end('Not found');
    return;
  }
  response.writeHead(200, { 'Content-Type': types.get(extname(filePath)) ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
  response.end(readFileSync(filePath));
});

await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
const address = server.address();
if (!address || typeof address === 'string') throw new Error('i18n QA server did not bind.');
const baseUrl = `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({ locale: 'zh-CN', viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/?qa=1`);
  await page.waitForFunction(() => document.documentElement.dataset.qaBridge === 'ready');

  assert.equal(await page.evaluate(() => document.documentElement.lang), 'en', 'Chinese browser locale must still default to English.');
  assert.equal(await page.title(), 'Scientific Animation Generator');
  await page.evaluate(() => {
    window.__SCIENCE_QA__?.setPlaying(false);
    window.__SCIENCE_QA__?.setSimulationTime(42.25);
    window.__SCIENCE_QA__?.trackObject('mars');
  });
  await page.waitForFunction(() => Math.abs((window.__SCIENCE_QA__?.getState().simulationDays ?? 0) - 42.25) < 1e-8);
  const before = await page.evaluate(() => window.__SCIENCE_QA__?.getSnapshot());
  await page.selectOption('#topbar-locale-select', 'zh-CN');
  await page.waitForFunction(() => window.__SCIENCE_QA__?.getLocale() === 'zh-CN' && document.documentElement.lang === 'zh-CN');
  const after = await page.evaluate(() => window.__SCIENCE_QA__?.getSnapshot());
  assert.deepEqual(canonicalSnapshot(after), canonicalSnapshot(before), 'Changing locale must not alter the project/runtime snapshot.');
  assert.equal(await page.locator('#topbar-locale-select').inputValue(), 'zh-CN');
  assert.equal(await page.locator('#mobile-locale-select').inputValue(), 'zh-CN');
  assert.match(await page.locator('.workspace-toolbar label').first().textContent(), /^跟随/);
  assert.equal(await page.title(), '科学动画生成器');
  assert.match(await page.locator('.planet-label[data-object-id="mars"]').textContent(), /火星/);

  await page.reload();
  await page.waitForFunction(() => document.documentElement.dataset.qaBridge === 'ready');
  assert.equal(await page.evaluate(() => window.__SCIENCE_QA__?.getLocale()), 'zh-CN', 'Editor locale must persist independently.');
  await page.evaluate(() => window.__SCIENCE_QA__?.setLocale('en'));
  await page.waitForFunction(() => document.documentElement.lang === 'en');
  assert.equal(await page.title(), 'Scientific Animation Generator');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => {
    window.__SCIENCE_QA__?.setLocale('zh-CN');
    window.__SCIENCE_QA__?.openControlCenter('travel');
  });
  await page.waitForFunction(() => document.querySelector('#control-center')?.classList.contains('is-open'));
  const mobile = await page.evaluate(() => {
    const dialog = document.querySelector('#control-center')?.getBoundingClientRect();
    const locale = document.querySelector('#mobile-locale-select')?.getBoundingClientRect();
    const control = document.querySelector('#floating-control-button')?.getBoundingClientRect();
    return {
      documentOverflow: document.documentElement.scrollWidth - innerWidth,
      dialogLeft: dialog?.left ?? -1,
      dialogRight: dialog?.right ?? innerWidth + 1,
      localeWidth: locale?.width ?? 0,
      controlHeight: control?.height ?? 0,
    };
  });
  assert.ok(mobile.documentOverflow <= 1, `Chinese mobile UI overflowed by ${mobile.documentOverflow}px.`);
  assert.ok(mobile.dialogLeft >= -1 && mobile.dialogRight <= 391, 'Control Center escaped the mobile viewport.');
  assert.ok(mobile.localeWidth >= 80, 'Language selector was clipped on mobile.');
  assert.ok(mobile.controlHeight >= 44, 'Mobile Controls target is smaller than 44px.');
  await page.locator('[data-experience-mode="learn"]').click();
  await page.waitForFunction(() => document.querySelector('[data-control-panel="learn"]')?.classList.contains('is-active'));
  const chineseGuide = await page.evaluate(() => {
    const picker = document.querySelector('.learning-module-picker');
    const stage = document.querySelector('.learning-stage-card');
    const summary = document.querySelector('.learning-stage-summary');
    const actions = [...document.querySelectorAll('.lesson-actions button')];
    return {
      guidedLabel: document.querySelector('.learning-stage-header .eyebrow')?.textContent ?? '',
      observationLabel: document.querySelector('.lesson-step .eyebrow')?.textContent ?? '',
      summarySize: summary ? Number.parseFloat(getComputedStyle(summary).fontSize) : 0,
      touchTargets: actions.every((button) => button.getBoundingClientRect().height >= 44),
      pickerContained: Boolean(picker && picker.scrollWidth >= picker.clientWidth && document.documentElement.scrollWidth <= innerWidth + 1),
      stageInside: Boolean(stage && stage.getBoundingClientRect().right <= innerWidth - 11),
    };
  });
  assert.match(chineseGuide.guidedLabel, /引导式观测/);
  assert.match(chineseGuide.observationLabel, /当前观测/);
  assert.ok(chineseGuide.summarySize >= 13 && chineseGuide.touchTargets && chineseGuide.pickerContained && chineseGuide.stageInside, `Chinese Guide layout is invalid: ${JSON.stringify(chineseGuide)}.`);
  await context.close();

  const canvasContext = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  await canvasContext.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function getContext(type, ...args) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
      return original.call(this, type, ...args);
    };
  });
  const canvasPage = await canvasContext.newPage();
  await canvasPage.goto(`${baseUrl}/?qa=1`);
  await canvasPage.waitForFunction(() => document.documentElement.dataset.qaBridge === 'ready');
  await canvasPage.evaluate(() => window.__SCIENCE_QA__?.setLocale('zh-CN'));
  assert.equal(await canvasPage.evaluate(() => window.__SCIENCE_QA__?.getState().renderer), 'canvas-2d');
  assert.match(await canvasPage.locator('canvas.canvas-fallback').getAttribute('aria-label'), /太阳系/);
  await canvasContext.close();

  if (existsSync(standalonePath)) {
    const standaloneContext = await browser.newContext();
    const standalonePage = await standaloneContext.newPage();
    const requests = [];
    standalonePage.on('request', (request) => requests.push(request.url()));
    await standalonePage.goto(pathToFileURL(standalonePath).href);
    await standalonePage.waitForFunction(() => document.documentElement.dataset.standaloneReady === 'true');
    assert.equal(await standalonePage.evaluate(() => window.__SCIENCE_STANDALONE_RUNTIME__?.getLocale()), 'en');
    await standalonePage.evaluate(() => window.__SCIENCE_STANDALONE_RUNTIME__?.setLocale('zh-CN'));
    await standalonePage.waitForFunction(() => document.documentElement.lang === 'zh-CN');
    assert.match(await standalonePage.title(), /太阳系探索器/);
    assert.equal(requests.filter((url) => /^https?:/i.test(url)).length, 0, 'Standalone requested network assets.');
    await standaloneContext.close();
  }

  if (existsSync(chineseStandalonePath)) {
    const chineseStandaloneContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
    const chineseStandalonePage = await chineseStandaloneContext.newPage();
    const networkRequests = [];
    chineseStandalonePage.on('request', (request) => {
      if (/^https?:/i.test(request.url())) networkRequests.push(request.url());
    });
    await chineseStandalonePage.goto(pathToFileURL(chineseStandalonePath).href);
    await chineseStandalonePage.waitForFunction(() => document.documentElement.dataset.standaloneReady === 'true');
    assert.equal(await chineseStandalonePage.evaluate(() => window.__SCIENCE_STANDALONE_RUNTIME__?.getLocale()), 'zh-CN');
    assert.match(await chineseStandalonePage.title(), /太阳系探索器/);
    await chineseStandalonePage.locator('#standalone-control-button').click();
    const mobileStandalone = await chineseStandalonePage.evaluate(() => {
      const surface = document.querySelector('.standalone-surface')?.getBoundingClientRect();
      const body = document.querySelector('.standalone-body');
      const presetHeights = [...document.querySelectorAll('.standalone-presets button')].map((button) => button.getBoundingClientRect().height);
      return {
        open: Boolean(document.querySelector('.standalone-panel')?.open),
        surfaceHeight: surface?.height ?? 0,
        scrollable: Boolean(body && body.scrollHeight > body.clientHeight),
        presetTargets: presetHeights.length > 0 && presetHeights.every((height) => height >= 44),
        overflow: document.documentElement.scrollWidth - innerWidth,
      };
    });
    assert.ok(mobileStandalone.open && mobileStandalone.surfaceHeight >= 843, `Standalone mobile panel is not full screen: ${JSON.stringify(mobileStandalone)}.`);
    assert.ok(mobileStandalone.scrollable && mobileStandalone.presetTargets && mobileStandalone.overflow <= 1, `Standalone mobile layout is invalid: ${JSON.stringify(mobileStandalone)}.`);
    await chineseStandalonePage.locator('.standalone-close').click();
    assert.equal(await chineseStandalonePage.locator('.standalone-panel').evaluate((panel) => panel.open), false);

    await chineseStandalonePage.setViewportSize({ width: 768, height: 1024 });
    await chineseStandalonePage.locator('#standalone-control-button').click();
    const tabletStandalone = await chineseStandalonePage.evaluate(() => {
      const surface = document.querySelector('.standalone-surface')?.getBoundingClientRect();
      const body = document.querySelector('.standalone-body');
      if (body) {
        body.scrollTop = body.scrollHeight;
        body.scrollTop = 0;
      }
      return {
        surfaceHeight: surface?.height ?? 0,
        bodyScrollable: Boolean(body && body.scrollHeight > body.clientHeight),
        overflow: document.documentElement.scrollWidth - innerWidth,
      };
    });
    assert.ok(tabletStandalone.surfaceHeight >= 880 && tabletStandalone.bodyScrollable && tabletStandalone.overflow <= 1, `Standalone tablet layout is invalid: ${JSON.stringify(tabletStandalone)}.`);
    await chineseStandalonePage.keyboard.press('Escape');
    assert.equal(await chineseStandalonePage.locator('.standalone-panel').evaluate((panel) => panel.open), false);
    await chineseStandalonePage.evaluate(() => window.__SCIENCE_STANDALONE_RUNTIME__?.setLocale('en'));
    await chineseStandalonePage.waitForFunction(() => document.documentElement.lang === 'en');
    assert.match(await chineseStandalonePage.title(), /Solar System Explorer/);
    assert.equal(networkRequests.length, 0, 'Chinese standalone requested network assets.');
    await chineseStandaloneContext.close();
  }

  console.log('i18n browser QA passed.');
} finally {
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}
