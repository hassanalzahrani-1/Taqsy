import { useState, useEffect, useCallback } from 'react';
import { weatherService, type WeatherData, type ForecastData, type HourlyForecast } from '../lib/weather-service';
import { storageService } from '../lib/storage';

export function useWeather() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const preferences = storageService.getPreferences();

  const fetchWeatherData = useCallback(async (city?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const cityName = city || preferences.city;
      const [current, forecastData, hourlyData] = await Promise.all([
        weatherService.getCurrentWeather(cityName),
        weatherService.getForecast(cityName),
        weatherService.getHourlyForecast(cityName)
      ]);

      setCurrentWeather(current);
      setForecast(forecastData);
      setHourlyForecast(hourlyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, [preferences.city]);

  const refreshWeather = useCallback(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  useEffect(() => {
    fetchWeatherData();

    // Set up auto-refresh based on user preferences
    const interval = setInterval(refreshWeather, preferences.refreshInterval * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchWeatherData, refreshWeather, preferences.refreshInterval]);

  return {
    currentWeather,
    forecast,
    hourlyForecast,
    loading,
    error,
    refreshWeather,
    fetchWeatherData
  };
}