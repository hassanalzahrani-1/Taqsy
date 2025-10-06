// Local storage utilities for user preferences
import type { UserPreferences, TemperatureUnit } from '../types';

const defaultPreferences: UserPreferences = {
  temperatureUnit: 'celsius',
  city: 'New York',
  theme: 'system',
  notifications: true,
  refreshInterval: 30
};

const STORAGE_KEY = 'weather-app-preferences';

export const storageService = {
  getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading preferences:', error);
    }
    return defaultPreferences;
  },

  savePreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new CustomEvent('preferencesChanged', { detail: preferences }));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  },

  updatePreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): void {
    const current = this.getPreferences();
    this.savePreferences({ ...current, [key]: value });
  },

  clearPreferences(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing preferences from localStorage:', error);
    }
  }
};

// Temperature conversion utilities
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9/5) + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * 5/9;
}

export function formatTemperature(temp: number, unit: TemperatureUnit): string {
  const value = unit === 'fahrenheit' ? celsiusToFahrenheit(temp) : temp;
  return `${Math.round(value)}°${unit === 'celsius' ? 'C' : 'F'}`;
}