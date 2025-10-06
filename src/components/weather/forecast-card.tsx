import { Card, CardContent } from "../ui/card";
import { ImageWithFallback } from "../utils/ImageWithFallback";
import { weatherService } from "../../lib/weather-service";
import { formatTemperature } from "../../lib/storage";

interface ForecastCardProps {
  date: string;
  high: number;
  low: number;
  description: string;
  icon: string;
  temperatureUnit: 'celsius' | 'fahrenheit';
  isToday?: boolean;
}

export function ForecastCard({ 
  date, 
  high, 
  low, 
  description, 
  icon, 
  temperatureUnit,
  isToday = false 
}: ForecastCardProps) {
  return (
    <Card className={`transition-colors hover:bg-muted/50 ${isToday ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-3">
        <div className="text-center">
          <p className="font-medium text-sm mb-1">{date}</p>
          <ImageWithFallback
            src={weatherService.getWeatherIconUrl(icon)}
            alt={description}
            className="w-10 h-10 mx-auto mb-1"
          />
          <p className="text-xs text-muted-foreground capitalize mb-2 line-clamp-1">{description}</p>
          <div className="flex justify-center gap-2 items-center text-sm">
            <span className="font-semibold">{formatTemperature(high, temperatureUnit)}</span>
            <span className="text-muted-foreground">{formatTemperature(low, temperatureUnit)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}