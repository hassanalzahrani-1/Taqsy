import { useState, useEffect, useRef } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "./input";
import { geocodingService, type CityResult } from "../../lib/geocoding-service";

interface CitySearchProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function CitySearch({ value, onValueChange }: CitySearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [cities, setCities] = useState<CityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setCities([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    setShowDropdown(true);

    // Debounce the search
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      const results = await geocodingService.searchCities(searchQuery);
      setCities(results);
      setLoading(false);
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (city: CityResult) => {
    const cityValue = geocodingService.formatCityValue(city);
    onValueChange(cityValue);
    setSearchQuery("");
    setCities([]);
    setShowDropdown(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={value || "Search for a city..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
          className="pl-9"
        />
      </div>

      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-[300px] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Searching...</span>
            </div>
          )}

          {!loading && searchQuery.length >= 2 && cities.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No cities found.
            </div>
          )}

          {!loading && searchQuery.length < 2 && (
            <div className="p-4 text-sm text-muted-foreground text-center">
              Type at least 2 characters to search
            </div>
          )}

          {!loading && cities.length > 0 && (
            <div className="py-1">
              {cities.map((city, index) => (
                <button
                  key={`${city.name}-${city.country}-${index}`}
                  onClick={() => handleCitySelect(city)}
                  className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors text-sm"
                >
                  {geocodingService.formatCityDisplay(city)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
