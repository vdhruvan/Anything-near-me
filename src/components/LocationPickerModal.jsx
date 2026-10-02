import React, { useState } from 'react';
import { X, MapPin, Search, Navigation, Compass, Loader2 } from 'lucide-react';

export default function LocationPickerModal({ isOpen, onClose, onSelectLocation }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [customLat, setCustomLat] = useState('');
  const [customLon, setCustomLon] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const popularCities = [
    { name: 'Bengaluru, India', lat: 12.9716, lon: 77.5946 },
    { name: 'London, United Kingdom', lat: 51.5074, lon: -0.1278 },
    { name: 'New York, USA', lat: 40.7128, lon: -74.006 },
    { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503 },
    { name: 'Paris, France', lat: 48.8566, lon: 2.3522 },
    { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093 }
  ];

  const handleSearchCity = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setErrorMsg('');
    try {
      const resp = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      if (resp.ok) {
        const data = await resp.json();
        setSearchResults(data.results || []);
        if (!data.results || data.results.length === 0) {
          setErrorMsg('No locations found matching that query.');
        }
      } else {
        // Fallback geocode directly with Nominatim
        const directResp = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`);
        const data = await directResp.json();
        setSearchResults(data.map((item) => ({
          displayName: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        })));
      }
    } catch (err) {
      setErrorMsg('Could not search location. Please try entering coordinates directly below.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCustomCoordinates = (e) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);

    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setErrorMsg('Please enter valid latitude (-90 to 90) and longitude (-180 to 180).');
      return;
    }

    onSelectLocation(lat, lon, `Custom (${lat.toFixed(3)}, ${lon.toFixed(3)})`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Choose Search Location</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Quick Preset Cities */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              Popular Cities
            </label>
            <div className="grid grid-cols-2 gap-2">
              {popularCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => {
                    onSelectLocation(city.lat, city.lon, city.name);
                    onClose();
                  }}
                  className="p-2.5 text-left text-xs font-semibold bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 rounded-xl transition-all flex items-center gap-2 group"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                  <span className="truncate">{city.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search by City / Address */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              Search by City, Town or Postal Code
            </label>
            <form onSubmit={handleSearchCity} className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Bengaluru, Oxford, San Francisco..."
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Search</span>
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="mt-3 divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectLocation(item.lat, item.lon, item.displayName.split(',')[0]);
                      onClose();
                    }}
                    className="w-full p-2.5 text-left text-xs hover:bg-emerald-50 hover:text-emerald-900 transition-colors flex items-start gap-2 text-slate-700"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{item.displayName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Custom Coordinates */}
          <div className="pt-4 border-t border-slate-200">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              Or Enter Precise Coordinates
            </label>
            <form onSubmit={handleCustomCoordinates} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="any"
                  value={customLat}
                  onChange={(e) => setCustomLat(e.target.value)}
                  placeholder="Latitude (e.g. 12.9716)"
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  step="any"
                  value={customLon}
                  onChange={(e) => setCustomLon(e.target.value)}
                  placeholder="Longitude (e.g. 77.5946)"
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Use Coordinates
              </button>
            </form>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
          )}
        </div>
      </div>
    </div>
  );
}
