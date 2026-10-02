import React from 'react';
import { MapPin, Navigation, Phone, Globe, Clock, ExternalLink, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { getOpeningStatus } from '../utils/openingStatus.js';

export default function LibraryCard({
  library,
  isSelected,
  onSelect,
  onViewDetails,
}) {
  const opening = getOpeningStatus(library.openingHours, library.isOpenNow);

  return (
    <div
      onClick={onSelect}
      className={`group relative bg-white rounded-2xl border p-5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
        isSelected
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20'
          : 'border-slate-200/90 hover:border-emerald-300'
      }`}
    >
      {/* Top Row: Library Name and Distance Badge */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {library.libraryType || 'Public Library'}
            </span>
            
            {/* Opening status - only show when available, never invent! */}
            {opening && (
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  opening.status === 'open'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {opening.status === 'open' ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>🟢 {opening.label}</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>🔴 {opening.label}</span>
                  </>
                )}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
            {library.name}
          </h3>
        </div>

        {/* Distance Badge */}
        <div className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold shadow-xs">
          <span>📍</span>
          <span>{library.formattedDistance} away</span>
        </div>
      </div>

      {/* Address */}
      <div className="flex items-start gap-2 text-sm text-slate-600 mb-3.5">
        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span className="line-clamp-2">{library.address}</span>
      </div>

      {/* Additional Information (when available) */}
      <div className="space-y-1.5 text-xs text-slate-600 mb-4 pt-3 border-t border-slate-100">
        {library.openingHours && (
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              <strong>Hours:</strong> {library.openingHours}
            </span>
          </div>
        )}

        {library.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <a
              href={`tel:${library.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="hover:text-emerald-600 hover:underline truncate"
            >
              {library.phone}
            </a>
          </div>
        )}

        {library.website && (
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <a
              href={library.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1 truncate font-medium"
            >
              <span>Visit Website</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
        )}

        {library.wheelchair && library.wheelchair === 'yes' && (
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="text-xs">♿ Wheelchair accessible</span>
          </div>
        )}
      </div>

      {/* Action Buttons required by spec */}
      <div className="flex items-center gap-2.5 pt-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(library);
          }}
          className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-colors text-center"
        >
          View Details
        </button>

        <a
          href={library.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-colors text-center flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Get Directions</span>
        </a>
      </div>
    </div>
  );
}
