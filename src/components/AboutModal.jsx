import React from 'react';
import { X, BookOpen, ShieldCheck, Map, Calculator, HelpCircle, ExternalLink } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-6 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">About Library Finder</h3>
              <p className="text-xs text-slate-400">Discovering public & academic libraries worldwide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            aria-label="Close About"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-slate-700 text-sm leading-relaxed custom-scrollbar">
          <div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Our Mission</h4>
            <p>
              <strong>Library Finder</strong> empowers readers, students, researchers, and book lovers to instantly locate libraries in their vicinity. Whether you need a quiet study desk, free Wi-Fi, books to borrow, or local community archives, Library Finder helps you find the closest spots with verified distances and turnkey directions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Privacy First</span>
              </div>
              <p className="text-xs text-emerald-950/80">
                Your location coordinates are only read upon your explicit consent and are strictly processed on-the-fly to search nearby points. Your coordinates are never saved to a database or tracked.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span>Haversine Formula</span>
              </div>
              <p className="text-xs text-blue-950/80">
                Distances are computed using the spherical Haversine formula based on Earth's mean radius of 6,371 km. Distances below 1 km are displayed in meters (e.g. 350 m), and larger distances in kilometers.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
              <Map className="w-4 h-4 text-emerald-600" />
              <span>Data Architecture & Providers</span>
            </h4>
            <p className="text-xs text-slate-600 mb-2">
              The application uses a pluggable Provider Pattern architecture supporting:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 ml-1">
              <li><strong>OpenStreetMap Overpass API:</strong> Community-driven global library dataset with zero API key dependencies.</li>
              <li><strong>Google Places API:</strong> Configurable via server environment variables (<code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">PLACES_API_KEY</code>).</li>
              <li><strong>Offline / Demo Engine:</strong> Resilient fallback dataset ensuring continuity even during network drops.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Attribution & Open Source</span>
            </div>
            <p>
              Map data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-medium">OpenStreetMap</a> contributors.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
