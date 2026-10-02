import React from 'react';
import { BookOpen, MapPin, Info, Compass } from 'lucide-react';

export default function Navbar({ onReset, onOpenAbout, onOpenLocationPicker, hasLocation, userCityName }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={onReset}
          className="flex items-center gap-2.5 group text-left focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-1 -ml-1"
          aria-label="Library Finder Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
              Library Finder
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Nearby Discovery
            </span>
          </div>
        </button>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1 sm:gap-3">
          <button
            onClick={onReset}
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Home
          </button>

          {hasLocation && (
            <button
              onClick={() => {
                const el = document.getElementById('results-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Nearby Libraries</span>
            </button>
          )}

          <button
            onClick={onOpenAbout}
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Info className="w-4 h-4" />
            <span>About</span>
          </button>

          <button
            onClick={onOpenLocationPicker}
            className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-2 rounded-lg transition-colors"
            title="Search custom location or sample city"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>{userCityName ? `Location: ${userCityName}` : 'Change Location'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
