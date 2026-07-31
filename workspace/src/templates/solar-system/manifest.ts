import type { TemplateManifest } from '../../core/template-protocol';
import { APP_VERSION, TEMPLATE_PROTOCOL_VERSION } from '../../core/app-config';

export const solarSystemManifest: TemplateManifest = {
  protocolVersion: TEMPLATE_PROTOCOL_VERSION,
  id: 'solar-system-3d',
  version: APP_VERSION,
  name: '3D Solar System',
  description: 'Explore, learn and observe a deterministic educational Solar System with Earth’s Moon.',
  renderer: 'three',
  category: 'planet',
  accuracyProfile: {
    mode: 'educational',
    note: 'Uses rounded orbital constants through the installed baseline Astronomy Engine. Visual scale can be enhanced for teaching and is not suitable for navigation or authoritative eclipse prediction.',
  },
  capabilities: {
    focusableObjects: true,
    interactiveCamera: true,
    standaloneHtmlExport: true,
    deterministic: true,
  },
  parameters: {
    timeScale: {
      type: 'range',
      label: 'Simulation speed',
      min: -2048,
      max: 2048,
      step: 0.001,
      default: 1,
      unit: 'days/s',
      description: 'Signed simulated Earth days advanced per real second. Reverse time is exposed only in Advanced Mode.',
    },
    scaleMode: {
      type: 'select',
      label: 'Visual scale',
      default: 'learning',
      options: [
        { label: 'Learning Scale', value: 'learning' },
        { label: 'Real Distance', value: 'real-distance' },
        { label: 'Real Scale', value: 'real-scale' },
      ],
      description: 'Scientific positions are unchanged. Learning Scale compresses spacing; Real Distance uses linear AU spacing with overlap-safe sizes and locator labels; Real Scale uses physical radius-to-AU ratios.',
    },
    planetScale: {
      type: 'range',
      label: 'Planet size',
      min: 0.6,
      max: 2.4,
      step: 0.05,
      default: 1.15,
      unit: '×',
    },
    distanceScale: {
      type: 'range',
      label: 'Orbit spacing',
      min: 0.65,
      max: 1.45,
      step: 0.05,
      default: 1,
      unit: '×',
    },
    visualMode: {
      type: 'select',
      label: 'Legacy distance model',
      default: 'educational',
      options: [
        { label: 'Teaching compression', value: 'educational' },
        { label: 'Linear AU spacing', value: 'scientific' },
      ],
      description: 'Retained for backward-compatible v0.5 snapshots. Linear AU spacing now applies Real Distance overlap guards and automatic full-system framing.',
    },
    showOrbits: {
      type: 'toggle',
      label: 'Orbit lines',
      default: true,
    },
    showLabels: {
      type: 'toggle',
      label: 'Planet and Moon labels',
      default: true,
    },
    showStars: {
      type: 'toggle',
      label: 'Star field',
      default: true,
    },
    quality: {
      type: 'select',
      label: 'Render quality',
      default: 'auto',
      options: [
        { label: 'Auto', value: 'auto' },
        { label: 'Battery saver', value: 'low' },
        { label: 'High detail', value: 'high' },
      ],
    },
  },
};
