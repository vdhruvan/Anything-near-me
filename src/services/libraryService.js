import { calculateDistance, formatDistance } from '../utils/distance.js';

export const SEARCH_RADIUS_KM = 5;
export const RADIUS_STEPS = [5, 10, 25];
export const MIN_LIBRARIES_THRESHOLD = 3;

/**
 * Fetch nearby libraries with automatic radius expansion support.
 * @param {number} lat - User latitude
 * @param {number} lon - User longitude
 * @param {number} requestedRadius - Target search radius in km
 * @param {boolean} autoExpand - Whether to progressively expand radius if results are low
 * @returns {Promise<{
 *   libraries: Array,
 *   radiusUsed: number,
 *   initialRadius: number,
 *   wasExpanded: boolean,
 *   expansionMessage: string|null,
 *   provider: string
 * }>}
 */
export async function fetchNearbyLibraries(lat, lon, requestedRadius = SEARCH_RADIUS_KM, autoExpand = true) {
  let currentRadius = requestedRadius;
  let attempts = [currentRadius];

  // If autoExpand is enabled and currentRadius is 5km, we can try 10km then 25km if results < MIN_LIBRARIES_THRESHOLD
  if (autoExpand && currentRadius === 5) {
    attempts = [5, 10, 25];
  } else if (autoExpand && currentRadius === 10) {
    attempts = [10, 25];
  }

  let finalResults = [];
  let radiusUsed = currentRadius;
  let expansionMessage = null;
  let providerUsed = 'OpenStreetMap';

  for (let i = 0; i < attempts.length; i++) {
    const attemptRadius = attempts[i];
    try {
      const response = await fetchLibrariesFromApi(lat, lon, attemptRadius);
      finalResults = response.results;
      providerUsed = response.provider;
      radiusUsed = attemptRadius;

      if (!autoExpand || finalResults.length >= MIN_LIBRARIES_THRESHOLD || i === attempts.length - 1) {
        if (attemptRadius > requestedRadius && finalResults.length > 0) {
          expansionMessage = `We couldn't find many libraries within ${requestedRadius} km, so we're showing libraries within ${attemptRadius} km.`;
        }
        break;
      }
    } catch (err) {
      console.warn(`Search failed at ${attemptRadius} km:`, err);
      if (i === attempts.length - 1) {
        // Last attempt failed, try direct client fallback
        const fallback = await clientSideFallback(lat, lon, attemptRadius);
        finalResults = fallback.results;
        providerUsed = fallback.provider;
        radiusUsed = attemptRadius;
      }
    }
  }

  // Ensure all results have computed distance and sorting
  const processedLibraries = finalResults.map((lib) => {
    const dist = calculateDistance(lat, lon, lib.lat, lib.lon);
    return {
      ...lib,
      distanceKm: Number(dist.toFixed(2)),
      formattedDistance: formatDistance(dist),
      directionsUrl: lib.directionsUrl || `https://www.google.com/maps/dir/?api=1&origin=${lat},${lon}&destination=${lib.lat},${lib.lon}&travelmode=driving`,
      osmDirectionsUrl: lib.osmDirectionsUrl || `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${lat}%2C${lon}%3B${lib.lat}%2C${lib.lon}`
    };
  });

  // Sort by distance nearest first by default
  processedLibraries.sort((a, b) => a.distanceKm - b.distanceKm);

  return {
    libraries: processedLibraries,
    radiusUsed,
    initialRadius: requestedRadius,
    wasExpanded: radiusUsed > requestedRadius,
    expansionMessage,
    provider: providerUsed
  };
}

/**
 * Call the backend /api/libraries endpoint
 */
async function fetchLibrariesFromApi(lat, lon, radius) {
  const url = `/api/libraries?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&radius=${encodeURIComponent(radius)}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API returned status ${response.status}`);
  }

  return await response.json();
}

/**
 * Direct client-side Overpass query or mock fallback if backend is unreachable
 */
async function clientSideFallback(lat, lon, radiusKm) {
  const radiusMeters = Math.round(radiusKm * 1000);
  const query = `
    [out:json][timeout:20];
    (
      node["amenity"="library"](around:${radiusMeters},${lat},${lon});
      way["amenity"="library"](around:${radiusMeters},${lat},${lon});
    );
    out center tags;
  `;

  try {
    const resp = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (resp.ok) {
      const data = await resp.json();
      const results = (data.elements || []).map((el) => {
        const tags = el.tags || {};
        const elLat = el.lat || (el.center && el.center.lat);
        const elLon = el.lon || (el.center && el.center.lon);
        return {
          id: `osm-${el.id}`,
          name: tags.name || tags['name:en'] || 'Public Library',
          lat: elLat,
          lon: elLon,
          address: tags['addr:street'] ? `${tags['addr:housenumber'] || ''} ${tags['addr:street']}, ${tags['addr:city'] || ''}`.trim() : 'Address not listed',
          phone: tags.phone || null,
          website: tags.website || null,
          openingHours: tags.opening_hours || null,
          libraryType: tags.operator_type === 'academic' ? 'Academic Library' : 'Public Library',
          wheelchair: tags.wheelchair || null,
          source: 'OpenStreetMap (Direct)'
        };
      }).filter((lib) => lib.lat && lib.lon);

      return { results, provider: 'OpenStreetMap (Direct)' };
    }
  } catch (e) {
    console.warn('Direct OSM fallback failed, generating mock dataset', e);
  }

  // Final mock fallback
  const mockDataset = [
    {
      id: 'mock-1',
      name: 'City Central Library',
      lat: lat + 0.006,
      lon: lon + 0.004,
      address: '123 Main Street, Central Plaza',
      phone: '+1 (555) 019-2834',
      website: 'https://www.citycentrallibrary.org',
      openingHours: 'Mo-Sa 09:00-20:00',
      isOpenNow: true,
      libraryType: 'Public Library',
      wheelchair: 'yes',
      source: 'Demo Dataset'
    },
    {
      id: 'mock-2',
      name: 'Community Reading Room & Archives',
      lat: lat - 0.012,
      lon: lon + 0.008,
      address: '45 Heritage Boulevard, West District',
      phone: '+1 (555) 014-9821',
      website: 'https://communityread.org',
      openingHours: 'Mo-Fr 10:00-18:00',
      isOpenNow: true,
      libraryType: 'Community Branch',
      wheelchair: 'yes',
      source: 'Demo Dataset'
    },
    {
      id: 'mock-3',
      name: 'University Science & Reference Library',
      lat: lat + 0.021,
      lon: lon - 0.015,
      address: 'Campus Quadrangle, University Road',
      phone: '+1 (555) 018-7743',
      website: 'https://univ.edu/library',
      openingHours: 'Mo-Su 24/7',
      isOpenNow: true,
      libraryType: 'Academic / University Library',
      wheelchair: 'yes',
      source: 'Demo Dataset'
    }
  ];

  return { results: mockDataset, provider: 'Demo Dataset' };
}
