/**
 * Base abstract class for Library Data Providers.
 * Implementing classes must implement `searchNearby(lat, lon, radiusKm)`.
 */
export class LibraryProvider {
  constructor(name) {
    this.name = name;
  }

  /**
   * Search for libraries near the given coordinates within radiusKm.
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @param {number} radiusKm - Search radius in kilometers
   * @returns {Promise<Array<NormalizedLibrary>>}
   */
  async searchNearby(lat, lon, radiusKm) {
    throw new Error('searchNearby must be implemented by subclass');
  }
}
