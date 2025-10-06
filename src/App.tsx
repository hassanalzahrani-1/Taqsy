import { useState, useEffect } from 'react';
import { Navigation } from './components/layout/navigation';
import { CurrentWeather } from './components/pages/current-weather';
import { Forecast } from './components/pages/forecast';
import { Settings } from './components/pages/settings';
import { storageService } from './lib/storage';
import type { Route, Theme, UserPreferences } from './types';

export default function App() {
  const [activeRoute, setActiveRoute] = useState<Route>('current');

  // Apply theme to document
  useEffect(() => {
    const preferences = storageService.getPreferences();

    const applyTheme = (themePref: Theme): (() => void) | undefined => {
      const root = document.documentElement;
      
      // Remove dark class first
      root.classList.remove('dark');
      
      if (themePref === 'system') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        root.classList.toggle('dark', mediaQuery.matches);
        
        const handler = (e: MediaQueryListEvent) => {
          root.classList.remove('dark');
          root.classList.toggle('dark', e.matches);
        };
        
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
      } else if (themePref === 'dark') {
        root.classList.add('dark');
      }
      // 'light' theme = no classes
      return undefined;
    };

    const cleanup = applyTheme(preferences.theme);
    
    // Listen for preference changes (custom event for same-tab updates)
    const handlePreferencesChange = (event: Event) => {
      const customEvent = event as CustomEvent<UserPreferences>;
      applyTheme(customEvent.detail.theme);
    };

    window.addEventListener('preferencesChanged', handlePreferencesChange);
    
    return () => {
      window.removeEventListener('preferencesChanged', handlePreferencesChange);
      if (cleanup) cleanup();
    };
  }, []);

  const renderContent = () => {
    switch (activeRoute) {
      case 'current':
        return <CurrentWeather />;
      case 'forecast':
        return <Forecast />;
      case 'settings':
        return <Settings />;
      default:
        return <CurrentWeather />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeRoute={activeRoute} onRouteChange={setActiveRoute} />
      
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {renderContent()}
      </main>
    </div>
  );
}