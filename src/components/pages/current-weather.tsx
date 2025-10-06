import { RefreshCw, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { WeatherCard } from "../weather/weather-card";
import { WeatherDetails } from "../weather/weather-details";
import { HourlyForecastComponent } from "../weather/hourly-forecast";
import { HourlyChart } from "../weather/hourly-chart";
import { Skeleton } from "../ui/skeleton";
import { useWeather } from "../../hooks/use-weather";
import { storageService } from "../../lib/storage";

export function CurrentWeather() {
  const { currentWeather, hourlyForecast, loading, error, refreshWeather } = useWeather();
  const preferences = storageService.getPreferences();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshWeather}
            className="ml-2"
          >
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!currentWeather) {
    return (
      <Alert>
        <AlertDescription>No weather data available.</AlertDescription>
      </Alert>
    );
  }

  const lastUpdated = new Date(currentWeather.timestamp).toLocaleTimeString();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-muted-foreground" />
          <h1 className="text-2xl font-bold">
            {currentWeather.location}, {currentWeather.country}
          </h1>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshWeather}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </Button>
      </div>

      <WeatherCard
        title="Current Weather"
        temperature={currentWeather.temperature}
        description={currentWeather.description}
        icon={currentWeather.icon}
        temperatureUnit={preferences.temperatureUnit}
      >
        <div className="space-y-4">
          <WeatherDetails
            humidity={currentWeather.humidity}
            windSpeed={currentWeather.windSpeed}
            pressure={currentWeather.pressure}
            visibility={currentWeather.visibility}
            uvIndex={currentWeather.uvIndex}
          />
          <p className="text-xs text-muted-foreground text-center">
            Last updated: {lastUpdated}
          </p>
        </div>
      </WeatherCard>

      <HourlyForecastComponent 
        data={hourlyForecast} 
        temperatureUnit={preferences.temperatureUnit}
      />

      <HourlyChart 
        data={hourlyForecast} 
        temperatureUnit={preferences.temperatureUnit}
      />
    </div>
  );
}