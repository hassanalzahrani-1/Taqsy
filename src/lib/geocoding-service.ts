// Geocoding service for city search using OpenWeatherMap API

export interface CityResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

class GeocodingService {
  private apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || "";
  private baseUrl = "https://api.openweathermap.org/geo/1.0";

  async searchCities(query: string): Promise<CityResult[]> {
    if (!query || query.length < 2) {
      return [];
    }
    
    // If no API key, return empty array
    if (!this.apiKey || this.apiKey === "your_api_key_here") {
      console.warn("OpenWeatherMap API key not configured. City search unavailable.");
      return [];
    }

    try {
      const url = `${this.baseUrl}/direct?q=${encodeURIComponent(query)}&limit=10&appid=${this.apiKey}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Geocoding API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Geocoding API error: ${response.statusText}`);
      }

      const data = await response.json();

      return data.map((city: any) => ({
        name: city.name,
        country: city.country,
        state: city.state,
        lat: city.lat,
        lon: city.lon,
      }));
    } catch (error) {
      console.error("Error searching cities:", error);
      return [];
    }
  }

  formatCityDisplay(city: CityResult): string {
    if (city.state) {
      return `${city.name}, ${city.state}, ${city.country}`;
    }
    return `${city.name}, ${city.country}`;
  }

  formatCityValue(city: CityResult): string {
    // Return just the city name for the weather API
    return city.name;
  }
}

export const geocodingService = new GeocodingService();
