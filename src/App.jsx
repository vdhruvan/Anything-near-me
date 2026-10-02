import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import PermissionError from './components/PermissionError.jsx';
import ControlsBar from './components/ControlsBar.jsx';
import LibraryList from './components/LibraryList.jsx';
import MapView from './components/MapView.jsx';
import LibraryDetailModal from './components/LibraryDetailModal.jsx';
import AboutModal from './components/AboutModal.jsx';
import LocationPickerModal from './components/LocationPickerModal.jsx';
import Footer from './components/Footer.jsx';
import { fetchNearbyLibraries, SEARCH_RADIUS_KM } from './services/libraryService.js';

export default function App() {
  // Location and search states
  const [userLocation, setUserLocation] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [permissionError, setPermissionError] = useState(null); // 'denied' | 'unavailable' | 'timeout'

  // Results states
  const [libraries, setLibraries] = useState([]);
  const [searchRadius, setSearchRadius] = useState(SEARCH_RADIUS_KM);
  const [radiusUsed, setRadiusUsed] = useState(SEARCH_RADIUS_KM);
  const [expansionMessage, setExpansionMessage] = useState(null);

  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [distanceFilter, setDistanceFilter] = useState(null); // null means all within search radius
  const [sortOption, setSortOption] = useState('distance-asc'); // 'distance-asc' | 'distance-desc' | 'name-asc' | 'name-desc'

  // Active / selected library & modals
  const [selectedLibraryId, setSelectedLibraryId] = useState(null);
  const [detailModalLibrary, setDetailModalLibrary] = useState(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

  // Responsive view toggle: 'list' or 'map' on mobile screens
  const [activeMobileView, setActiveMobileView] = useState('list');

  /**
   * Request native browser geolocation and execute search.
   * Only triggered on explicit user action (button click).
   */
  const handleFindNearMe = () => {
    setPermissionError(null);

    if (!('geolocation' in navigator)) {
      setPermissionError('unavailable');
      return;
    }

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      // Success Callback
      (position) => {
        setIsLoadingLocation(false);
        const { latitude, longitude, accuracy } = position.coords;
        const loc = { lat: latitude, lon: longitude, accuracy };
        setUserLocation(loc);
        setCityName('Current Location');
        performSearch(latitude, longitude, SEARCH_RADIUS_KM);
      },
      // Error Callback
      (error) => {
        setIsLoadingLocation(false);
        console.warn('Geolocation error code:', error.code);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setPermissionError('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            setPermissionError('unavailable');
            break;
          case error.TIMEOUT:
            setPermissionError('timeout');
            break;
          default:
            setPermissionError('unavailable');
            break;
        }
      },
      // Options specified by prompt
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  /**
   * Search for nearby libraries with coordinates
   */
  const performSearch = async (lat, lon, radius) => {
    setIsSearching(true);
    setPermissionError(null);
    try {
      const data = await fetchNearbyLibraries(lat, lon, radius, true);
      setLibraries(data.libraries || []);
      setRadiusUsed(data.radiusUsed);
      setExpansionMessage(data.expansionMessage);

      if (data.libraries && data.libraries.length > 0) {
        setSelectedLibraryId(data.libraries[0].id);
      }

      // Smooth scroll down to results section
      setTimeout(() => {
        const el = document.getElementById('results-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Failed to search libraries:', err);
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Handle user choosing a manual or preset city
   */
  const handleSelectPresetLocation = (lat, lon, name) => {
    setPermissionError(null);
    setUserLocation({ lat, lon, accuracy: null });
    setCityName(name);
    performSearch(lat, lon, SEARCH_RADIUS_KM);
  };

  /**
   * Handle changing the distance filter (1km, 5km, 10km, 25km)
   */
  const handleDistanceFilterChange = (radius) => {
    if (distanceFilter === radius) {
      setDistanceFilter(null);
    } else {
      setDistanceFilter(radius);
      // If user selects a filter larger than currently loaded radius, fetch more
      if (userLocation && radius > radiusUsed) {
        performSearch(userLocation.lat, userLocation.lon, radius);
      }
    }
  };

  /**
   * Reset the application state
   */
  const handleReset = () => {
    setUserLocation(null);
    setLibraries([]);
    setPermissionError(null);
    setSearchQuery('');
    setDistanceFilter(null);
    setCityName(null);
    setExpansionMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter and Sort libraries
  const filteredAndSortedLibraries = useMemo(() => {
    let list = [...libraries];

    // Filter by search query (name or address)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((lib) => {
        const nameMatch = lib.name && lib.name.toLowerCase().includes(q);
        const addrMatch = lib.address && lib.address.toLowerCase().includes(q);
        const opMatch = lib.operator && lib.operator.toLowerCase().includes(q);
        return nameMatch || addrMatch || opMatch;
      });
    }

    // Filter by distance
    if (distanceFilter) {
      list = list.filter((lib) => lib.distanceKm <= distanceFilter);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortOption === 'distance-asc') {
        return a.distanceKm - b.distanceKm;
      }
      if (sortOption === 'distance-desc') {
        return b.distanceKm - a.distanceKm;
      }
      if (sortOption === 'name-asc') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortOption === 'name-desc') {
        return (b.name || '').localeCompare(a.name || '');
      }
      return 0;
    });

    return list;
  }, [libraries, searchQuery, distanceFilter, sortOption]);

  const selectedLibrary = useMemo(() => {
    return libraries.find((lib) => lib.id === selectedLibraryId) || null;
  }, [libraries, selectedLibraryId]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      {/* Navigation Header */}
      <Navbar
        onReset={handleReset}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
        hasLocation={!!userLocation}
        userCityName={cityName}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onFindNearMe={handleFindNearMe}
          onSelectPresetLocation={handleSelectPresetLocation}
          onOpenManualLocation={() => setIsLocationPickerOpen(true)}
          isLoadingLocation={isLoadingLocation}
          isSearching={isSearching}
          hasLocation={!!userLocation}
        />

        {/* Permission Error Banner */}
        {permissionError && (
          <div className="px-4">
            <PermissionError
              errorType={permissionError}
              onRetry={handleFindNearMe}
              onManualSearch={() => setIsLocationPickerOpen(true)}
            />
          </div>
        )}

        {/* Results Section */}
        {userLocation && (
          <div>
            <ControlsBar
              radiusKm={distanceFilter || radiusUsed}
              totalFound={libraries.length}
              filteredCount={filteredAndSortedLibraries.length}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              distanceFilter={distanceFilter}
              onDistanceFilterChange={handleDistanceFilterChange}
              sortOption={sortOption}
              onSortChange={setSortOption}
              expansionMessage={expansionMessage}
              activeView={activeMobileView}
              onViewChange={setActiveMobileView}
            />

            {/* Split Layout: List on Left, Map on Right (Desktop) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Library Results List */}
                <div
                  className={`lg:col-span-6 xl:col-span-5 ${
                    activeMobileView === 'map' ? 'hidden lg:block' : 'block'
                  }`}
                >
                  <div className="max-h-[calc(100vh-230px)] overflow-y-auto pr-1 custom-scrollbar">
                    <LibraryList
                      libraries={filteredAndSortedLibraries}
                      selectedLibraryId={selectedLibraryId}
                      onSelectLibrary={(lib) => setSelectedLibraryId(lib.id)}
                      onViewDetails={(lib) => setDetailModalLibrary(lib)}
                      isLoading={isSearching}
                    />
                  </div>
                </div>

                {/* Right Column: Interactive Map */}
                <div
                  className={`lg:col-span-6 xl:col-span-7 sticky top-20 ${
                    activeMobileView === 'list' ? 'hidden lg:block' : 'block'
                  }`}
                >
                  <div className="h-[520px] lg:h-[calc(100vh-230px)]">
                    <MapView
                      userLocation={userLocation}
                      libraries={filteredAndSortedLibraries}
                      selectedLibrary={selectedLibrary}
                      onSelectLibrary={(lib) => {
                        setSelectedLibraryId(lib.id);
                        // Scroll corresponding card into view on desktop
                        const cardEl = document.getElementById(`lib-card-${lib.id}`);
                        if (cardEl) {
                          cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <LibraryDetailModal
        library={detailModalLibrary}
        onClose={() => setDetailModalLibrary(null)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onSelectLocation={handleSelectPresetLocation}
      />

      {/* Footer */}
      <Footer onOpenAbout={() => setIsAboutOpen(true)} />
    </div>
  );
}
