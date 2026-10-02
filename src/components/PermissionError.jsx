import React, { useState } from 'react';
import { AlertCircle, RefreshCw, HelpCircle, ChevronDown, ChevronUp, MapPin } from 'lucide-react';

export default function PermissionError({ errorType, onRetry, onManualSearch }) {
  const [showHelp, setShowHelp] = useState(false);

  // Exact user-friendly messages specified in specification
  let title = 'Location Permission Required';
  let message = "We couldn't access your location. Please allow location access in your browser settings and try again.";

  if (errorType === 'denied') {
    title = 'Location Access Denied';
    message = "We couldn't access your location. Please allow location access in your browser settings and try again.";
  } else if (errorType === 'unavailable') {
    title = 'Location Unavailable';
    message = "Your current location could not be determined. Please check your device's location settings and try again.";
  } else if (errorType === 'timeout') {
    title = 'Request Timeout';
    message = "Finding your location is taking too long. Please try again.";
  }

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-amber-50/90 border border-amber-200 rounded-2xl shadow-sm text-slate-800">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-700 leading-relaxed font-medium">
            {message}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            <button
              onClick={onManualSearch}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl border border-slate-300 shadow-sm transition-colors"
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Enter Location Manually</span>
            </button>

            <button
              onClick={() => setShowHelp(!showHelp)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-900 hover:text-amber-950 underline transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How to allow location?</span>
              {showHelp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showHelp && (
            <div className="mt-4 pt-4 border-t border-amber-200/80 text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800">How to unblock location in your browser:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong className="text-slate-700">Chrome / Edge:</strong> Click the padlock or settings icon in the address bar (next to the URL), select <em>Location</em>, and change it to <em>Allow</em>. Then click <strong>Try Again</strong>.</li>
                <li><strong className="text-slate-700">Safari (Mac / iOS):</strong> Open Safari Preferences &gt; Websites &gt; Location &gt; set this site to Allow, or toggle Location Services in iOS Settings &gt; Safari &gt; Location.</li>
                <li><strong className="text-slate-700">Firefox:</strong> Click the permissions icon on the left of the address bar, remove the blocked location permission, and refresh.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
