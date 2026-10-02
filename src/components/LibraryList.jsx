import React from 'react';
import LibraryCard from './LibraryCard.jsx';
import { SearchX, BookOpen } from 'lucide-react';

export default function LibraryList({
  libraries,
  selectedLibraryId,
  onSelectLibrary,
  onViewDetails,
  isLoading
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
            <div className="flex justify-between items-start mb-3">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-200 rounded w-28" />
                <div className="h-6 bg-slate-200 rounded w-3/4" />
              </div>
              <div className="h-6 bg-slate-200 rounded w-20" />
            </div>
            <div className="h-4 bg-slate-100 rounded w-5/6 mb-4" />
            <div className="flex gap-2">
              <div className="h-8 bg-slate-100 rounded flex-1" />
              <div className="h-8 bg-slate-200 rounded flex-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (libraries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center my-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-800">No libraries match your search</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Try adjusting your search terms or expanding the search distance filter above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {libraries.map((library) => (
        <div
          key={library.id}
          id={`lib-card-${library.id}`}
        >
          <LibraryCard
            library={library}
            isSelected={selectedLibraryId === library.id}
            onSelect={() => onSelectLibrary(library)}
            onViewDetails={onViewDetails}
          />
        </div>
      ))}
    </div>
  );
}
