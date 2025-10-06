import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { HourlyForecast } from "../../types";
import { ImageWithFallback } from "../utils/ImageWithFallback";
import { weatherService } from "../../lib/weather-service";

interface HourlyChartProps {
  data: HourlyForecast[];
  temperatureUnit: 'celsius' | 'fahrenheit';
}

export function HourlyChart({ data, temperatureUnit }: HourlyChartProps) {
  if (data.length === 0) return null;
  
  // Format time - short version for mobile (e.g., "6PM")
  const formatTimeShort = (time: string) => {
    const match = time.match(/(\d+):(\d+)/);
    if (!match || !match[1]) return time;
    
    let hour = parseInt(match[1]);
    const isPM = hour >= 12;
    
    if (hour === 0) {
      hour = 12;
    } else if (hour > 12) {
      hour = hour - 12;
    }
    
    return `${hour}${isPM ? 'PM' : 'AM'}`;
  };

  // Format time - full version for desktop (e.g., "6:00 PM")
  const formatTimeFull = (time: string) => {
    const match = time.match(/(\d+):(\d+)/);
    if (!match || !match[1] || !match[2]) return time;
    
    let hour = parseInt(match[1]);
    const minute = match[2];
    const isPM = hour >= 12;
    
    if (hour === 0) {
      hour = 12;
    } else if (hour > 12) {
      hour = hour - 12;
    }
    
    return `${hour}:${minute} ${isPM ? 'PM' : 'AM'}`;
  };

  // Convert data to Recharts format
  const chartData = data.map(item => ({
    time: formatTimeShort(item.time), // Short format for X-axis
    fullTime: formatTimeFull(item.time), // Full format for tooltip
    temperature: temperatureUnit === 'fahrenheit' 
      ? Math.round((item.temperature * 9/5) + 32)
      : Math.round(item.temperature),
    description: item.description,
    windSpeed: item.windSpeed,
    humidity: item.humidity
  }));

  // Calculate Y-axis range
  const temps = chartData.map(d => d.temperature);
  const dataMinTemp = Math.min(...temps);
  const dataMaxTemp = Math.max(...temps);
  
  // Round to nearest multiple of 5
  const roundToNearestFive = (num: number) => Math.round(num / 5) * 5;
  
  // Calculate domain
  const yAxisMax = roundToNearestFive(dataMaxTemp) + 5;
  const yAxisMin = roundToNearestFive(dataMinTemp) - 5;
  
  // Create 4 Y-axis ticks: [max, max-5, max-10, min]
  const yAxisTicks = [
    yAxisMax,
    yAxisMax - 5,
    yAxisMax - 10,
    yAxisMin
  ];


  return (
    <Card>
      <CardHeader>
        <CardTitle>Temperature Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Time labels at the top */}
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}>
            {data.map((hour, index) => (
              <div key={index} className="text-center text-[8px] sm:text-[10px] md:text-sm lg:text-base font-medium text-muted-foreground leading-tight">
                {/* Show short format on mobile, full format on desktop */}
                <span className="md:hidden">{formatTimeShort(hour.time)}</span>
                <span className="hidden md:inline">{formatTimeFull(hour.time)}</span>
              </div>
            ))}
          </div>

          {/* Temperature chart with Recharts */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis 
                  dataKey="time" 
                  hide
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                  width={40}
                  domain={[yAxisMin, yAxisMax]}
                  ticks={yAxisTicks}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                    fontSize: '12px'
                  }}
                  labelFormatter={(label, payload) => {
                    // Show full time in tooltip
                    return payload && payload[0] ? payload[0].payload.fullTime : label;
                  }}
                  formatter={(value: number) => [`${value}°${temperatureUnit === 'fahrenheit' ? 'F' : 'C'}`, 'Temperature']}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="rgb(249, 115, 22)" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}>
            {/* Precipitation chance */}
            {data.map((_, index) => (
              <div key={index} className="text-center text-[8px] sm:text-[10px] md:text-sm lg:text-base text-cyan-500 overflow-hidden whitespace-nowrap">
                0%
              </div>
            ))}
          </div>

          {/* Divider line */}
          <div className="border-t" />

          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}>
            {/* Weather icons */}
            {data.map((hour, index) => (
              <div key={index} className="flex justify-center">
                <ImageWithFallback
                  src={weatherService.getWeatherIconUrl(hour.icon)}
                  alt={hour.description}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                />
              </div>
            ))}
          </div>

          <div className="grid gap-1 overflow-hidden" style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}>
            {/* Wind speed */}
            {data.map((hour, index) => (
              <div key={index} className="text-center text-[6px] sm:text-[8px] md:text-xs lg:text-sm text-muted-foreground leading-tight overflow-hidden px-0.5">
                {hour.windSpeed}km/h
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
