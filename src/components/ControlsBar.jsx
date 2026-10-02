import React from 'react';
import { Search, ArrowUpDown, Filter, Sparkles, Map, List } from 'lucide-react';

export default function ControlsBar({
  radiusKm,
  totalFound,
  filteredCount,
  searchQuery,
  onSearchChange,
  distanceFilter,
  onDistanceFilterChange,
  sortOption,
  onSortChange,
  expansionMessage,
  activeView,
  onViewChange
}) {
  const distanceOptions = [1, 5, 10, 25];

  return (
    <div id="results-section" className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Section required by spec */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Libraries Near You
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
              <span>Showing libraries within <strong className="text-slate-800">{radiusKm} km</strong> of your location</span>
              <span className="text-slate-300">•</span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {totalFound} {totalFound === 1 ? 'library' : 'libraries'} found
              </span>
              {searchQuery && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600">
                    ({filteredCount} matching filter)
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Mobile view switcher (List vs Map) */}
          <div className="flex items-center gap-2 lg:hidden self-start md:self-auto">
            <span className="text-xs font-medium text-slate-500 mr-1">View:</span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 shadow-sm">
              <button
                onClick={() => onViewChange('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeView === 'list'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
              <button
                onClick={() => onViewChange('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeView === 'map'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Auto-expansion communication banner */}
        {expansionMessage && (
          <div className="mb-6 p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 text-sm flex items-center gap-2.5 shadow-sm">
            <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="font-medium">{expansionMessage}</span>
          </div>
        )}

        {/* Search & Filter Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="🔎 Search libraries by name or address..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-medium text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Distance Filter Radios / Buttons */}
          <div className="md:col-span-4 flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3 text-slate-400" />
              Within:
            </span>
            <div className="flex items-center gap-1.5">
              {distanceOptions.map((radius) => {
                const isSelected = distanceFilter === radius;
                return (
                  <button
                    key={radius}
                    onClick={() => onDistanceFilterChange(radius)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-semibold'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {radius} km
                  </button>
                );
              })}
              {distanceFilter && (
                <button
                  onClick={() => onDistanceFilterChange(null)}
                  className="px-2 py-1 text-xs text-slate-400 hover:text-slate-600"
                  title="Reset distance filter"
                >
                  All
                </button>
              )}
            </div>
          </div>

          {/* Sorting Dropdown */}
          <div className="md:col-span-3 flex items-center justify-end gap-2">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
              <select
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer shadow-sm appearance-none"
              >
                <option value="distance-asc">Distance: nearest first</option>
                <option value="distance-desc">Distance: farthest first</option>
                <option value="name-asc">Name: A–Z</option>
                <option value="name-desc">Name: Z–A</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
