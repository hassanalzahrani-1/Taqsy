import { Button } from "../ui/button";
import { Cloud, Calendar, Settings } from "lucide-react";
import type { Route } from "../../types";

interface NavigationProps {
  activeRoute: Route;
  onRouteChange: (route: Route) => void;
}

export function Navigation({ activeRoute, onRouteChange }: NavigationProps) {
  const routes = [
    { id: 'current' as const, label: 'Current', icon: Cloud },
    { id: 'forecast' as const, label: 'Forecast', icon: Calendar },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <Cloud className="w-8 h-8 text-primary" />
            <span className="font-semibold text-xl">Taqsy</span>
          </div>
          
          <div className="flex space-x-2">
            {routes.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={activeRoute === id ? "default" : "ghost"}
                size="default"
                onClick={() => onRouteChange(id)}
                className="flex items-center space-x-2"
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}