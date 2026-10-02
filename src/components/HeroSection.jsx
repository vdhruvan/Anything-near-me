import React from 'react';
import { MapPin, ShieldCheck, Sparkles, Navigation, Loader2 } from 'lucide-react';

export default function HeroSection({
  onFindNearMe,
  onSelectPresetLocation,
  onOpenManualLocation,
  isLoadingLocation,
  isSearching,
  hasLocation,
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200">
      {/* Decorative background subtle shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Instant Geolocation Discovery</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Find Libraries Near You
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Discover libraries around your current location and find the closest place to read, study, or borrow books.
        </p>

        {/* Primary CTA Area */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <button
            onClick={onFindNearMe}
            disabled={isLoadingLocation || isSearching}
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 active:from-emerald-700 active:to-green-700 rounded-2xl shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoadingLocation || isSearching ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>{isLoadingLocation ? 'Accessing Your Location...' : 'Searching Libraries...'}</span>
              </>
            ) : (
              <>
                <span className="text-xl">📍</span>
                <span>Find Libraries Near Me</span>
                <Navigation className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          {/* Secondary Trust / Privacy Text */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Your location is only used to find nearby libraries.</span>
          </div>
        </div>

        {/* Fallback / Sample City Presets for testing & devices without GPS */}
        <div className="mt-10 pt-8 border-t border-slate-200/80 max-w-xl mx-auto">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            Or test with a sample city / manual search:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
              { name: 'London', lat: 51.5074, lon: -0.1278 },
              { name: 'New York', lat: 40.7128, lon: -74.006 },
              { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
            ].map((city) => (
              <button
                key={city.name}
                onClick={() => onSelectPresetLocation(city.lat, city.lon, city.name)}
                className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 hover:text-emerald-700 rounded-lg border border-slate-200 shadow-sm transition-all flex items-center gap-1"
              >
                <MapPin className="w-3 h-3 text-slate-400" />
                {city.name}
              </button>
            ))}
            <button
              onClick={onOpenManualLocation}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 transition-colors"
            >
              Custom Search...
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
