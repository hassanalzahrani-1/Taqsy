import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../utils/ImageWithFallback";
import { weatherService } from "../../lib/weather-service";

interface WeatherCardProps {
  title: string;
  location?: string;
  temperature: number;
  description: string;
  icon: string;
  temperatureUnit: 'celsius' | 'fahrenheit';
  children?: React.ReactNode;
  className?: string;
}

export function WeatherCard({ 
  title, 
  location, 
  temperature, 
  description, 
  icon, 
  temperatureUnit,
  children,
  className = ""
}: WeatherCardProps) {
  const formatTemp = (temp: number) => {
    const value = temperatureUnit === 'fahrenheit' ? (temp * 9/5) + 32 : temp;
    return `${Math.round(value)}°${temperatureUnit === 'celsius' ? 'C' : 'F'}`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          {location && <Badge variant="secondary">{location}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold">{formatTemp(temperature)}</div>
            </div>
            <p className="text-muted-foreground capitalize mt-1">{description}</p>
          </div>
          <ImageWithFallback
            src={weatherService.getWeatherIconUrl(icon)}
            alt={description}
            className="w-20 h-20"
          />
        </div>
        {children}
      </CardContent>
    </Card>
  );
}