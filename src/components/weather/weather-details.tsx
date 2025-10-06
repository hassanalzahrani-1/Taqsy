import { Droplets, Wind, Gauge, Eye, Sun } from "lucide-react";

interface WeatherDetailsProps {
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex?: number;
}

export function WeatherDetails({ humidity, windSpeed, pressure, visibility, uvIndex }: WeatherDetailsProps) {
  const details = [
    {
      icon: Droplets,
      label: "Humidity",
      value: `${humidity}%`,
      color: "text-blue-500"
    },
    {
      icon: Wind,
      label: "Wind Speed",
      value: `${windSpeed} km/h`,
      color: "text-gray-500"
    },
    {
      icon: Gauge,
      label: "Pressure",
      value: `${pressure} hPa`,
      color: "text-purple-500"
    },
    {
      icon: Eye,
      label: "Visibility",
      value: `${visibility} km`,
      color: "text-green-500"
    }
  ];

  if (uvIndex !== undefined) {
    details.push({
      icon: Sun,
      label: "UV Index",
      value: uvIndex.toString(),
      color: "text-yellow-500"
    });
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {details.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="flex flex-col items-center p-3 bg-muted rounded-lg">
          <Icon className={`w-5 h-5 mb-2 ${color}`} />
          <span className="text-xs text-muted-foreground mb-1">{label}</span>
          <span className="font-medium">{value}</span>
        </div>
      ))}
    </div>
  );
}