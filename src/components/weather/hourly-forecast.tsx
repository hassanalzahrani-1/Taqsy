import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { ImageWithFallback } from "../utils/ImageWithFallback";
import { weatherService } from "../../lib/weather-service";
import { formatTemperature } from "../../lib/storage";
import type { HourlyForecast } from "../../types";

interface HourlyForecastProps {
  data: HourlyForecast[];
  temperatureUnit: 'celsius' | 'fahrenheit';
}

export function HourlyForecastComponent({ data, temperatureUnit }: HourlyForecastProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 pb-4">
            {data.map((hour, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 min-w-[90px] p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <span className="text-sm font-medium text-muted-foreground">{hour.time}</span>
                <ImageWithFallback
                  src={weatherService.getWeatherIconUrl(hour.icon)}
                  alt={hour.description}
                  className="w-10 h-10"
                />
                <div className="text-center">
                  <span className="font-semibold text-lg">{formatTemperature(hour.temperature, temperatureUnit)}</span>
                </div>
                <span className="text-xs text-muted-foreground">{hour.windSpeed}km/h</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}