// Weather service for OpenWeather API integration
import type { WeatherData, ForecastData, HourlyForecast } from '../types';

// Mock data for demonstration
const mockCurrentWeather: WeatherData = {
  location: "New York",
  country: "US",
  temperature: 22,
  description: "Partly cloudy",
  humidity: 65,
  windSpeed: 12,
  pressure: 1013,
  visibility: 10,
  uvIndex: 3,
  icon: "02d",
  timestamp: new Date()
};

const mockForecast: ForecastData[] = [
  { date: "Today", high: 24, low: 18, description: "Partly cloudy", icon: "02d", humidity: 65, windSpeed: 12 },
  { date: "Tomorrow", high: 26, low: 20, description: "Sunny", icon: "01d", humidity: 55, windSpeed: 8 },
  { date: "Wednesday", high: 23, low: 17, description: "Light rain", icon: "10d", humidity: 80, windSpeed: 15 },
  { date: "Thursday", high: 25, low: 19, description: "Cloudy", icon: "03d", humidity: 70, windSpeed: 10 },
  { date: "Friday", high: 27, low: 21, description: "Sunny", icon: "01d", humidity: 50, windSpeed: 6 },
];

const mockHourlyForecast: HourlyForecast[] = [
  { time: "12:00", temperature: 22, description: "Partly cloudy", icon: "02d", windSpeed: 12, humidity: 65 },
  { time: "13:00", temperature: 23, description: "Partly cloudy", icon: "02d", windSpeed: 13, humidity: 63 },
  { time: "14:00", temperature: 24, description: "Sunny", icon: "01d", windSpeed: 11, humidity: 60 },
  { time: "15:00", temperature: 24, description: "Sunny", icon: "01d", windSpeed: 10, humidity: 58 },
  { time: "16:00", temperature: 23, description: "Partly cloudy", icon: "02d", windSpeed: 12, humidity: 62 },
  { time: "17:00", temperature: 22, description: "Partly cloudy", icon: "02d", windSpeed: 14, humidity: 64 },
  { time: "18:00", temperature: 21, description: "Cloudy", icon: "03d", windSpeed: 15, humidity: 66 },
  { time: "19:00", temperature: 20, description: "Cloudy", icon: "03d", windSpeed: 14, humidity: 68 },
  { time: "20:00", temperature: 19, description: "Clear", icon: "01n", windSpeed: 12, humidity: 70 },
  { time: "21:00", temperature: 18, description: "Clear", icon: "01n", windSpeed: 11, humidity: 72 },
  { time: "22:00", temperature: 17, description: "Clear", icon: "01n", windSpeed: 10, humidity: 74 },
  { time: "23:00", temperature: 17, description: "Clear", icon: "01n", windSpeed: 9, humidity: 75 },
  { time: "00:00", temperature: 16, description: "Clear", icon: "01n", windSpeed: 8, humidity: 76 },
];

class WeatherService {
  private apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || "";
  private baseUrl = import.meta.env.VITE_OPENWEATHER_BASE_URL || "https://api.openweathermap.org/data/2.5";

  async getCurrentWeather(city: string = "New York"): Promise<WeatherData> {
    try {
      // If API key is not set, return mock data
      if (!this.apiKey || this.apiKey === "your_api_key_here") {
        console.warn("OpenWeatherMap API key not configured. Using mock data.");
        return {
          ...mockCurrentWeather,
          location: city,
          timestamp: new Date()
        };
      }

      // Make real API call
      const response = await fetch(
        `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        location: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000, // Convert to km
        uvIndex: 0, // UV index requires separate API call
        icon: data.weather[0].icon,
        timestamp: new Date()
      };
    } catch (error) {
      console.error("Error fetching current weather:", error);
      return {
        ...mockCurrentWeather,
        location: city,
        timestamp: new Date()
      };
    }
  }

  async getForecast(city: string = "New York"): Promise<ForecastData[]> {
    try {
      // If API key is not set, return mock data
      if (!this.apiKey || this.apiKey === "your_api_key_here") {
        return mockForecast;
      }

      const response = await fetch(
        `${this.baseUrl}/forecast?q=${city}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Group forecast by day and get daily high/low
      const dailyForecasts: ForecastData[] = [];
      const days = new Map<string, any[]>();
      
      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!days.has(date)) {
          days.set(date, []);
        }
        days.get(date)?.push(item);
      });
      
      let dayIndex = 0;
      days.forEach((items) => {
        if (dayIndex < 5) {
          const temps = items.map(i => i.main.temp);
          const dayName = dayIndex === 0 ? "Today" : new Date(items[0].dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
          
          // Find a daytime entry for better icon representation (prefer icons ending with 'd')
          const daytimeItem = items.find(i => i.weather[0].icon.endsWith('d')) || items[0];
          
          dailyForecasts.push({
            date: dayName,
            high: Math.max(...temps),
            low: Math.min(...temps),
            description: daytimeItem.weather[0].description,
            icon: daytimeItem.weather[0].icon,
            humidity: items[0].main.humidity,
            windSpeed: items[0].wind.speed
          });
          dayIndex++;
        }
      });
      
      return dailyForecasts;
    } catch (error) {
      console.error("Error fetching forecast:", error);
      return mockForecast;
    }
  }

  async getHourlyForecast(city: string = "New York"): Promise<HourlyForecast[]> {
    try {
      // If API key is not set, return mock data
      if (!this.apiKey || this.apiKey === "your_api_key_here") {
        return mockHourlyForecast;
      }

      const response = await fetch(
        `${this.baseUrl}/forecast?q=${city}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Hourly forecast API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Get next 13 data points (3-hour intervals, covering next ~39 hours)
      const hourlyData: HourlyForecast[] = data.list.slice(0, 13).map((item: any) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        temperature: item.main.temp,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        windSpeed: item.wind.speed,
        humidity: item.main.humidity
      }));
      
      return hourlyData;
    } catch (error) {
      console.error("Error fetching hourly forecast:", error);
      return mockHourlyForecast;
    }
  }

  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
}

export const weatherService = new WeatherService();