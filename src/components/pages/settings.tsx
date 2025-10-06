import { useState } from "react";
import { Settings as SettingsIcon, MapPin, Thermometer, Clock, Bell, Palette, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { CitySearch } from "../ui/city-search";
import { storageService } from "../../lib/storage";
import type { UserPreferences, Theme } from "../../types";
import { useWeather } from "../../hooks/use-weather";

export function Settings() {
  const [preferences, setPreferences] = useState<UserPreferences>(storageService.getPreferences());
  const { fetchWeatherData } = useWeather();

  const handleReset = () => {
    const defaults = {
      temperatureUnit: 'celsius' as const,
      city: 'New York',
      theme: 'system' as const,
      notifications: true,
      refreshInterval: 30
    };
    setPreferences(defaults);
    storageService.savePreferences(defaults);
    fetchWeatherData(defaults.city);
  };

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    storageService.savePreferences(newPreferences);
    
    // Fetch new weather data if city changed
    if (key === 'city') {
      fetchWeatherData(value as string);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center space-x-2">
        <SettingsIcon className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Location</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="city">Default City</Label>
            <CitySearch
              value={preferences.city}
              onValueChange={(value) => updatePreference('city', value)}
            />
            <p className="text-xs text-muted-foreground">
              Search for any city worldwide using OpenWeatherMap's database
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Thermometer className="w-5 h-5" />
            <span>Temperature</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Temperature Unit</Label>
            <Select
              value={preferences.temperatureUnit}
              onValueChange={(value: 'celsius' | 'fahrenheit') => 
                updatePreference('temperatureUnit', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="celsius">Celsius (°C)</SelectItem>
                <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Appearance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select
              value={preferences.theme}
              onValueChange={(value: Theme) => 
                updatePreference('theme', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Data Refresh</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Auto-refresh interval</Label>
            <Select
              value={preferences.refreshInterval.toString()}
              onValueChange={(value) => 
                updatePreference('refreshInterval', parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">Every 15 minutes</SelectItem>
                <SelectItem value="30">Every 30 minutes</SelectItem>
                <SelectItem value="60">Every hour</SelectItem>
                <SelectItem value="120">Every 2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about weather updates
              </p>
            </div>
            <Switch
              checked={preferences.notifications}
              onCheckedChange={(checked) => updatePreference('notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="flex items-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Reset to Defaults</span>
        </Button>
      </div>

      <Separator />
      
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Taqsy v1.0.0
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by OpenWeatherMap API
          </p>
        </CardContent>
      </Card>
    </div>
  );
}