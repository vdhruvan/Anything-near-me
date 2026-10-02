import { LibraryProvider } from './LibraryProvider.js';

export class GooglePlacesProvider extends LibraryProvider {
  constructor(apiKey) {
    super('Google Places API');
    this.apiKey = apiKey || process.env.PLACES_API_KEY;
  }

  async searchNearby(lat, lon, radiusKm) {
    if (!this.apiKey || this.apiKey === 'your_api_key_here') {
      throw new Error('Google Places API key is missing or invalid in environment variables.');
    }

    const radiusMeters = Math.min(Math.round(radiusKm * 1000), 50000); // Google Places max radius 50km
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radiusMeters}&type=library&key=${encodeURIComponent(this.apiKey)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Places HTTP error ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places error: ${data.status} - ${data.error_message || ''}`);
    }

    const results = (data.results || []).map((place) => {
      let openNow = null;
      if (place.opening_hours && typeof place.opening_hours.open_now === 'boolean') {
        openNow = place.opening_hours.open_now;
      }

      return {
        id: `google-${place.place_id}`,
        name: place.name,
        lat: place.geometry.location.lat,
        lon: place.geometry.location.lng,
        address: place.vicinity || place.formatted_address || 'Address not available',
        phone: null, // requires Place Details
        website: null,
        openingHours: openNow !== null ? (openNow ? 'Open now' : 'Closed') : null,
        isOpenNow: openNow,
        libraryType: 'Public Library',
        rating: place.rating || null,
        userRatingsTotal: place.user_ratings_total || null,
        source: 'Google Places'
      };
    });

    return results;
  }
}
