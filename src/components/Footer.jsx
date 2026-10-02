import React from 'react';
import { BookOpen, Heart, Shield, Globe } from 'lucide-react';

export default function Footer({ onOpenAbout }) {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-white font-bold text-base block">Library Finder</span>
              <span className="text-xs text-slate-400">Discovering public & academic libraries near you</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <button
              onClick={onOpenAbout}
              className="hover:text-emerald-400 transition-colors"
            >
              About & Privacy
            </button>
            <a
              href="https://www.openstreetmap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>OpenStreetMap</span>
            </a>
          </div>

          <div className="text-xs text-slate-500 text-center md:text-right">
            <span>Powered by OpenStreetMap &amp; Geolocation API</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
