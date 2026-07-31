import { simulationDaysToDate } from '../core/simulation-clock';
import { baselineAstronomyEngine } from './baseline-astronomy-engine';
import type { EventLocationComparison, ObserverLocation } from './types';

const STORAGE_KEY = 'solar-explorer-v06-observer-locations';
const ACTIVE_KEY = 'solar-explorer-v06-active-location';

export const BUILTIN_OBSERVER_LOCATIONS: readonly ObserverLocation[] = [
  { id: 'singapore', name: 'Singapore', latitudeDeg: 1.3521, longitudeDeg: 103.8198, timeZone: 'Asia/Singapore', builtin: true },
  { id: 'tokyo', name: 'Tokyo', latitudeDeg: 35.6762, longitudeDeg: 139.6503, timeZone: 'Asia/Tokyo', builtin: true },
  { id: 'london', name: 'London', latitudeDeg: 51.5074, longitudeDeg: -0.1278, timeZone: 'Europe/London', builtin: true },
  { id: 'new-york', name: 'New York', latitudeDeg: 40.7128, longitudeDeg: -74.006, timeZone: 'America/New_York', builtin: true },
  { id: 'sydney', name: 'Sydney', latitudeDeg: -33.8688, longitudeDeg: 151.2093, timeZone: 'Australia/Sydney', builtin: true },
];

function isLocation(value: unknown): value is ObserverLocation {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ObserverLocation>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    Number.isFinite(candidate.latitudeDeg) &&
    Number.isFinite(candidate.longitudeDeg) &&
    typeof candidate.timeZone === 'string' &&
    Math.abs(candidate.latitudeDeg ?? 999) <= 90 &&
    Math.abs(candidate.longitudeDeg ?? 999) <= 180
  );
}

function safeTimeZone(timeZone: string): string {
  try {
    new Intl.DateTimeFormat('en', { timeZone }).format(new Date());
    return timeZone;
  } catch {
    return 'UTC';
  }
}

function readSaved(): ObserverLocation[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as unknown[];
    return parsed.filter(isLocation).map((location) => ({ ...location, builtin: false }));
  } catch {
    return [];
  }
}

export class ObserverLocationService {
  private savedLocations = readSaved();

  list(): ObserverLocation[] {
    return [...BUILTIN_OBSERVER_LOCATIONS, ...this.savedLocations];
  }

  active(): ObserverLocation {
    const id = typeof localStorage === 'undefined' ? null : localStorage.getItem(ACTIVE_KEY);
    return this.list().find((location) => location.id === id) ?? BUILTIN_OBSERVER_LOCATIONS[0];
  }

  setActive(id: string): ObserverLocation {
    const location = this.list().find((candidate) => candidate.id === id);
    if (!location) throw new Error('Observer location was not found.');
    if (typeof localStorage !== 'undefined') localStorage.setItem(ACTIVE_KEY, location.id);
    return location;
  }

  save(name: string, latitudeDeg: number, longitudeDeg: number, timeZone = 'UTC'): ObserverLocation {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Location name is required.');
    if (!Number.isFinite(latitudeDeg) || latitudeDeg < -90 || latitudeDeg > 90) {
      throw new Error('Latitude must be between -90 and 90 degrees.');
    }
    if (!Number.isFinite(longitudeDeg) || longitudeDeg < -180 || longitudeDeg > 180) {
      throw new Error('Longitude must be between -180 and 180 degrees.');
    }
    const id = `custom-${Date.now().toString(36)}-${Math.abs(Math.round(latitudeDeg * 1000)).toString(36)}`;
    const location: ObserverLocation = {
      id,
      name: trimmed,
      latitudeDeg,
      longitudeDeg,
      timeZone: safeTimeZone(timeZone),
      builtin: false,
    };
    this.savedLocations = [...this.savedLocations, location];
    this.persist();
    this.setActive(id);
    return location;
  }

  remove(id: string): void {
    if (BUILTIN_OBSERVER_LOCATIONS.some((location) => location.id === id)) return;
    this.savedLocations = this.savedLocations.filter((location) => location.id !== id);
    this.persist();
    if (typeof localStorage !== 'undefined' && localStorage.getItem(ACTIVE_KEY) === id) {
      localStorage.setItem(ACTIVE_KEY, BUILTIN_OBSERVER_LOCATIONS[0].id);
    }
  }

  fromDevice(position: GeolocationPosition): ObserverLocation {
    return this.save(
      'Device location',
      position.coords.latitude,
      position.coords.longitude,
      Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    );
  }

  compare(objectId: string, simulationDays: number, locations = this.list()): EventLocationComparison[] {
    const date = simulationDaysToDate(simulationDays);
    return locations.map((location) => ({
      location,
      horizontal: baselineAstronomyEngine.horizontalPosition(objectId, simulationDays, location),
      localTimeLabel: new Intl.DateTimeFormat('en', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: safeTimeZone(location.timeZone),
      }).format(date),
    }));
  }

  private persist(): void {
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(this.savedLocations));
  }
}

export const observerLocationService = new ObserverLocationService();
