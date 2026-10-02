import { LibraryProvider } from './LibraryProvider.js';

// Multiple public Overpass API mirrors for high availability
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
];

export class OverpassProvider extends LibraryProvider {
  constructor() {
    super('OpenStreetMap Overpass API');
  }

  async searchNearby(lat, lon, radiusKm) {
    const radiusMeters = Math.round(radiusKm * 1000);

    // Overpass QL query looking for amenity=library (nodes, ways, relations)
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="library"](around:${radiusMeters},${lat},${lon});
        way["amenity"="library"](around:${radiusMeters},${lat},${lon});
        relation["amenity"="library"](around:${radiusMeters},${lat},${lon});
      );
      out center tags;
    `;

    let lastError = null;

    for (const endpoint of OVERPASS_ENDPOINTS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 18000);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'LibraryFinderApp/1.0 (nearby library discovery)',
          },
          body: `data=${encodeURIComponent(query)}`,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} from ${endpoint}`);
        }

        const data = await response.json();
        return this.normalizeResults(data.elements || [], lat, lon);
      } catch (err) {
        lastError = err;
        console.warn(`Overpass query failed on ${endpoint}:`, err.message);
        // Continue to next mirror endpoint
      }
    }

    throw lastError || new Error('All Overpass API endpoints failed');
  }

  normalizeResults(elements, userLat, userLon) {
    const results = [];

    for (const item of elements) {
      const tags = item.tags || {};
      
      // Determine coordinates (node has lat/lon, way/relation with 'out center' has center.lat/lon)
      const lat = item.lat || (item.center && item.center.lat);
      const lon = item.lon || (item.center && item.center.lon);

      if (lat === undefined || lon === undefined) continue;

      const name = tags.name || tags['name:en'] || tags.operator || tags.description || 'Public Library';

      // Build structured address
      const addressParts = [];
      if (tags['addr:housenumber']) addressParts.push(tags['addr:housenumber']);
      if (tags['addr:street']) addressParts.push(tags['addr:street']);
      if (tags['addr:suburb']) addressParts.push(tags['addr:suburb']);
      if (tags['addr:city'] || tags['addr:town'] || tags['addr:village']) {
        addressParts.push(tags['addr:city'] || tags['addr:town'] || tags['addr:village']);
      }
      if (tags['addr:state']) addressParts.push(tags['addr:state']);
      if (tags['addr:postcode']) addressParts.push(tags['addr:postcode']);

      let address = tags['addr:full'] || addressParts.join(', ');
      if (!address) {
        address = 'Address details not listed on OpenStreetMap';
      }

      // Website & Phone
      const website = tags.website || tags['contact:website'] || tags.url || null;
      const phone = tags.phone || tags['contact:phone'] || null;
      const email = tags.email || tags['contact:email'] || null;

      // Opening hours
      const openingHours = tags.opening_hours || null;

      // Library type / category
      let libraryType = 'Public Library';
      if (tags.operator_type === 'academic' || tags.library_type === 'academic' || tags.school) {
        libraryType = 'Academic / University Library';
      } else if (tags.library_type === 'national') {
        libraryType = 'National / State Library';
      } else if (tags.access === 'private') {
        libraryType = 'Private / Restricted Library';
      } else if (tags.books) {
        libraryType = `Library (${tags.books} books approx.)`;
      }

      // Accessibility & Amenities
      const wheelchair = tags.wheelchair || null;
      const internetAccess = tags.internet_access || tags['internet_access:fee'] || null;
      const fee = tags.fee || null;

      results.push({
        id: `osm-${item.type}-${item.id}`,
        osmId: item.id,
        name,
        lat,
        lon,
        address,
        phone,
        website,
        email,
        openingHours,
        libraryType,
        operator: tags.operator || null,
        wheelchair,
        internetAccess,
        fee,
        source: 'OpenStreetMap',
        rawTags: tags
      });
    }

    return results;
  }
}
