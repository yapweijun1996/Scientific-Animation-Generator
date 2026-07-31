import type { AstronomyProvider, BodyState, MoonPhaseState, ProviderMetadata } from './types';
import { baselineAstronomyEngine } from './baseline-astronomy-engine';

export interface HighPrecisionProviderFactory {
  id: string;
  label: string;
  load(): Promise<AstronomyProvider>;
}

export class AstronomyEngine {
  private activeProvider: AstronomyProvider = baselineAstronomyEngine;
  private readonly providerFactories = new Map<string, HighPrecisionProviderFactory>();

  get provider(): AstronomyProvider {
    return this.activeProvider;
  }

  get metadata(): ProviderMetadata {
    return this.activeProvider.metadata;
  }

  registerProvider(factory: HighPrecisionProviderFactory): void {
    this.providerFactories.set(factory.id, factory);
  }

  listProviders(): Array<{ id: string; label: string; installed: boolean; active: boolean }> {
    return [
      {
        id: baselineAstronomyEngine.metadata.id,
        label: baselineAstronomyEngine.metadata.name,
        installed: true,
        active: this.activeProvider.metadata.id === baselineAstronomyEngine.metadata.id,
      },
      ...[...this.providerFactories.values()].map((factory) => ({
        id: factory.id,
        label: factory.label,
        installed: false,
        active: this.activeProvider.metadata.id === factory.id,
      })),
    ];
  }

  async activateProvider(id: string): Promise<ProviderMetadata> {
    if (id === baselineAstronomyEngine.metadata.id) {
      this.activeProvider = baselineAstronomyEngine;
      return this.activeProvider.metadata;
    }
    const factory = this.providerFactories.get(id);
    if (!factory) throw new Error(`Astronomy provider is not registered: ${id}`);
    const provider = await factory.load();
    if (!provider.metadata.installed) throw new Error(`${provider.metadata.name} is not installed.`);
    this.activeProvider = provider;
    return provider.metadata;
  }

  bodyState(objectId: string, simulationDays: number): BodyState {
    return this.activeProvider.bodyState(objectId, simulationDays);
  }

  moonPhase(simulationDays: number): MoonPhaseState {
    return this.activeProvider.moonPhase(simulationDays);
  }
}

export const astronomyEngine = new AstronomyEngine();

// Framework registration only. v0.6 remains fully offline and does not download an
// ephemeris automatically. A future package can replace this factory without changing
// Explore, Learn or Observer consumers.
astronomyEngine.registerProvider({
  id: 'high-precision-package',
  label: 'High-precision ephemeris package',
  async load(): Promise<AstronomyProvider> {
    throw new Error('No high-precision ephemeris package is installed. The offline educational provider remains active.');
  },
});
