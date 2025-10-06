import { Calendar, Droplets, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ForecastCard } from "../weather/forecast-card";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription } from "../ui/alert";
import { useWeather } from "../../hooks/use-weather";
import { storageService } from "../../lib/storage";
import { ImageWithFallback } from "../utils/ImageWithFallback";
import { weatherService } from "../../lib/weather-service";

export function Forecast() {
  const { forecast, loading, error } = useWeather();
  const preferences = storageService.getPreferences();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Calendar className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">5-Day Forecast</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {forecast.map((day, index) => (
          <ForecastCard
            key={index}
            date={day.date}
            high={day.high}
            low={day.low}
            description={day.description}
            icon={day.icon}
            temperatureUnit={preferences.temperatureUnit}
            isToday={index === 0}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  {/* Weather Icon */}
                  <ImageWithFallback
                    src={weatherService.getWeatherIconUrl(day.icon)}
                    alt={day.description}
                    className="w-12 h-12"
                  />
                  
                  {/* Date and Description */}
                  <div className="min-w-[100px]">
                    <div className="font-semibold">{day.date}</div>
                    <div className="text-xs text-muted-foreground capitalize">{day.description}</div>
                  </div>
                </div>
                
                {/* Weather Details */}
                <div className="flex items-center gap-6 text-sm">
                  {/* Temperature */}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">
                      {preferences.temperatureUnit === 'fahrenheit' 
                        ? `${Math.round((day.high * 9/5) + 32)}°` 
                        : `${day.high}°`}
                    </span>
                    <span className="text-muted-foreground">
                      {preferences.temperatureUnit === 'fahrenheit' 
                        ? `${Math.round((day.low * 9/5) + 32)}°` 
                        : `${day.low}°`}
                    </span>
                  </div>
                  
                  {/* Humidity */}
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Droplets className="w-4 h-4" />
                    <span>{day.humidity}%</span>
                  </div>
                  
                  {/* Wind */}
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Wind className="w-4 h-4" />
                    <span>{day.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}