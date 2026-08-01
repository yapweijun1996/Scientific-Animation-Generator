import './style.css';
import './travel/travel.css';
import './travel/pilot.css';
import { ScientificEditor } from './editor/scientific-editor';
import { createI18n, localeFromStorage, setDocumentLocale } from './i18n';

const root = document.querySelector<HTMLElement>('#app');
if (!root) throw new Error('Application root was not found.');

const editor = new ScientificEditor(root);
editor.start().catch((error: unknown) => {
  const locale = localeFromStorage();
  const i18n = createI18n(locale);
  setDocumentLocale(locale);
  const message = error instanceof Error ? error.message : 'Unknown startup error';
  const main = document.createElement('main');
  main.className = 'fatal-error';

  const title = document.createElement('strong');
  title.textContent = i18n.t('app.unableToStart');

  const detail = document.createElement('p');
  detail.textContent = message;

  const reload = document.createElement('button');
  reload.type = 'button';
  reload.textContent = i18n.t('action.reload');
  reload.style.minHeight = '44px';
  reload.addEventListener('click', () => location.reload());

  main.append(title, detail, reload);
  root.replaceChildren(main);
  console.error(error);
});

async function clearDevelopmentPwaState(): Promise<void> {
  const registrations = await navigator.serviceWorker.getRegistrations();
  const localRegistrations = registrations.filter((registration) => {
    const worker = registration.active ?? registration.waiting ?? registration.installing;
    if (!worker) return false;
    const script = new URL(worker.scriptURL);
    return script.origin === location.origin && script.pathname.endsWith('/sw.js');
  });
  await Promise.all(localRegistrations.map((registration) => registration.unregister()));

  if ('caches' in window) {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith('science-animator-'))
        .map((key) => caches.delete(key)),
    );
  }

  if (
    localRegistrations.length > 0
    && navigator.serviceWorker.controller
    && !sessionStorage.getItem('science-dev-pwa-cleared')
  ) {
    sessionStorage.setItem('science-dev-pwa-cleared', '1');
    location.reload();
  }
}

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
      await navigator.serviceWorker.ready;
      document.dispatchEvent(new CustomEvent('science-offline-ready', { detail: registration.scope }));
    } catch (error) {
      console.warn('Service Worker registration failed:', error);
    }
  });
} else if ('serviceWorker' in navigator) {
  void clearDevelopmentPwaState().catch((error) => {
    console.warn('Unable to clear stale development PWA state:', error);
  });
}
