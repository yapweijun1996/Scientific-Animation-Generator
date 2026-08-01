import assert from 'node:assert/strict';
import {
  DEFAULT_LOCALE,
  EN_MESSAGES,
  LOCALE_STORAGE_KEY,
  OBJECT_NAMES,
  SUPPORTED_LOCALES,
  ZH_CN_MESSAGES,
  createI18n,
  localeFromStorage,
  missionRejectionText,
  normalizeLocale,
} from '../src/i18n/index.ts';

assert.deepEqual(SUPPORTED_LOCALES, ['en', 'zh-CN']);
assert.equal(DEFAULT_LOCALE, 'en');
assert.equal(normalizeLocale(undefined), 'en');
assert.equal(normalizeLocale('zh'), 'en');
assert.equal(normalizeLocale('zh-CN'), 'zh-CN');
assert.equal(localeFromStorage({ getItem: () => null }), 'en');
assert.equal(localeFromStorage({ getItem: (key) => key === LOCALE_STORAGE_KEY ? 'zh-CN' : null }), 'zh-CN');
assert.equal(localeFromStorage({ getItem: () => 'fr' }), 'en');

assert.deepEqual(Object.keys(ZH_CN_MESSAGES).sort(), Object.keys(EN_MESSAGES).sort());
for (const key of Object.keys(EN_MESSAGES)) {
  assert.ok(EN_MESSAGES[key].length > 0, `English message ${key} is empty.`);
  assert.ok(ZH_CN_MESSAGES[key].length > 0, `Chinese message ${key} is empty.`);
}

const english = createI18n('en');
const chinese = createI18n('zh-CN');
assert.equal(english.objectName('earth'), 'Earth');
assert.equal(chinese.objectName('earth'), '地球');
assert.equal(chinese.objectName('mercury'), '水星');
assert.equal(chinese.phaseName('First Quarter'), '上弦月');
assert.equal(chinese.text('Hohmann Transfer'), '霍曼转移');
assert.equal(chinese.text('Perihelion / aphelion'), '近日点 / 远日点');
assert.match(english.date('2026-01-01T00:00:00.000Z', { dateStyle: 'medium', timeZone: 'UTC' }), /2026/);
assert.match(chinese.date('2026-01-01T00:00:00.000Z', { dateStyle: 'medium', timeZone: 'UTC' }), /2026/);
assert.match(english.number(12345.6), /12.*345/);
assert.match(chinese.number(12345.6), /12.*345/);

assert.equal(
  missionRejectionText('earth-requires-orbiter', 'ignored', 'zh-CN'),
  '地球仅提供轨道演练，请选择环绕器而不是飞越。',
);
assert.equal(
  missionRejectionText('insufficient-delta-v', 'Budget 2.00 km/s is below required 3.50 km/s.', 'zh-CN'),
  '简化任务预算 2.00 km/s 低于所需的 3.50 km/s。',
);

for (const [id, names] of Object.entries(OBJECT_NAMES)) {
  assert.equal(english.objectName(id), names.en);
  assert.equal(chinese.objectName(id), names['zh-CN']);
}

console.log('i18n policy QA passed.');
