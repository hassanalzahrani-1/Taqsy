// Global type definitions for the Taqsy Weather App

export type Route = 'current' | 'forecast' | 'settings';

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export type Theme = 'light' | 'dark' | 'system';

export interface UserPreferences {
  temperatureUnit: TemperatureUnit;
  city: string;
  theme: Theme;
  notifications: boolean;
  refreshInterval: number; // in minutes
}

export interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  icon: string;
  timestamp: Date;
}

export interface ForecastData {
  date: string;
  high: number;
  low: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  description: string;
  icon: string;
  windSpeed: number;
  humidity: number;
}
