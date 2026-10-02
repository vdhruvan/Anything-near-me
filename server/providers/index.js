import { OverpassProvider } from './OverpassProvider.js';
import { GooglePlacesProvider } from './GooglePlacesProvider.js';
import { MockProvider } from './MockProvider.js';

export function getProvider(requestedProvider) {
  const providerName = (requestedProvider || process.env.PLACES_PROVIDER || 'overpass').toLowerCase();

  switch (providerName) {
    case 'google':
      return new GooglePlacesProvider(process.env.PLACES_API_KEY);
    case 'mock':
      return new MockProvider();
    case 'overpass':
    case 'osm':
    default:
      return new OverpassProvider();
  }
}

export { OverpassProvider, GooglePlacesProvider, MockProvider };
