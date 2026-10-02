import React, { useState } from 'react';
import { X, MapPin, Navigation, Phone, Globe, Clock, Check, Copy, Accessibility, Wifi, Building2, ExternalLink } from 'lucide-react';
import { getOpeningStatus } from '../utils/openingStatus.js';

export default function LibraryDetailModal({ library, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!library) return null;

  const opening = getOpeningStatus(library.openingHours, library.isOpenNow);

  const handleCopyAddress = () => {
    if (library.address) {
      navigator.clipboard.writeText(library.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-5 text-white flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs uppercase tracking-wider">
              {library.libraryType || 'Public Library'}
            </span>
            <h3 className="text-2xl font-bold mt-2 text-white leading-tight">
              {library.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/10 hover:bg-black/25 flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Distance and Status Banner */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
              <span className="text-base">📍</span>
              <span>{library.formattedDistance} from your location</span>
            </div>

            {opening && (
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  opening.status === 'open'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {opening.status === 'open' ? '🟢 Open now' : '🔴 Closed'}
              </span>
            )}
          </div>

          {/* Address Section */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address</label>
            <div className="flex items-start justify-between gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
              <div className="flex items-start gap-2.5 text-sm text-slate-700">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{library.address}</span>
              </div>
              <button
                onClick={handleCopyAddress}
                className="shrink-0 p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-xs flex items-center gap-1"
                title="Copy address to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Hours Section */}
          {library.openingHours && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Opening Hours</label>
              <div className="flex items-center gap-2.5 p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-sm text-slate-700">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{library.openingHours}</span>
              </div>
            </div>
          )}

          {/* Contact Details */}
          {(library.phone || library.website || library.email) && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact & Web</label>
              <div className="space-y-2">
                {library.phone && (
                  <a
                    href={`tel:${library.phone}`}
                    className="flex items-center gap-2.5 p-3 bg-slate-50/80 hover:bg-slate-100 rounded-xl border border-slate-100 text-sm text-slate-800 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{library.phone}</span>
                  </a>
                )}

                {library.website && (
                  <a
                    href={library.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-slate-50/80 hover:bg-slate-100 rounded-xl border border-slate-100 text-sm text-emerald-700 font-medium transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{library.website}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 shrink-0 text-slate-400" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Attributes and Accessibility */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Features & Accessibility</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">Operator</div>
                  <div className="font-semibold text-slate-800 truncate">{library.operator || 'Local Authority'}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center gap-2">
                <Accessibility className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">Wheelchair Access</div>
                  <div className="font-semibold text-slate-800">
                    {library.wheelchair === 'yes' ? 'Accessible' : library.wheelchair === 'limited' ? 'Limited' : 'Unspecified'}
                  </div>
                </div>
              </div>

              {library.internetAccess && (
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center gap-2 col-span-2">
                  <Wifi className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-semibold">Internet Access</div>
                    <div className="font-semibold text-slate-800">
                      {library.internetAccess === 'wlan' ? 'Free WiFi Available' : 'Available on premises'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            Close
          </button>

          <a
            href={library.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span>Get Directions</span>
          </a>
        </div>
      </div>
    </div>
  );
}
