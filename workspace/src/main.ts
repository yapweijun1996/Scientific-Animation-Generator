import './style.css';
import './travel/travel.css';
import { ScientificEditor } from './editor/scientific-editor';

const root = document.querySelector<HTMLElement>('#app');
if (!root) throw new Error('Application root was not found.');

const editor = new ScientificEditor(root);
editor.start().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown startup error';
  const main = document.createElement('main');
  main.className = 'fatal-error';

  const title = document.createElement('strong');
  title.textContent = 'Unable to start Scientific Animation Generator';

  const detail = document.createElement('p');
  detail.textContent = message;

  const reload = document.createElement('button');
  reload.type = 'button';
  reload.textContent = 'Reload';
  reload.style.minHeight = '44px';
  reload.addEventListener('click', () => location.reload());

  main.append(title, detail, reload);
  root.replaceChildren(main);
  console.error(error);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js');
      await navigator.serviceWorker.ready;
      document.dispatchEvent(new CustomEvent('science-offline-ready', { detail: registration.scope }));
    } catch (error) {
      console.warn('Service Worker registration failed:', error);
    }
  });
}
