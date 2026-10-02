import { LibraryProvider } from './LibraryProvider.js';

export class MockProvider extends LibraryProvider {
  constructor() {
    super('Demonstration / Offline Mock Provider');
  }

  async searchNearby(lat, lon, radiusKm) {
    // Generate realistic library data placed near the requested user coordinates
    const templates = [
      {
        name: 'City Central Library & Learning Hub',
        offsetLat: 0.007,
        offsetLon: 0.005,
        address: '14 Elm Avenue, Cultural Quarter',
        phone: '+1 (555) 234-5678',
        website: 'https://www.citycentrallibrary.org',
        openingHours: 'Mo-Sa 09:00-20:00; Su 11:00-17:00',
        isOpenNow: true,
        libraryType: 'Metropolitan Public Library',
        operator: 'Municipal Library Board',
        wheelchair: 'yes',
        internetAccess: 'wlan',
        fee: 'no'
      },
      {
        name: 'St. Jude Community Library & Study Center',
        offsetLat: -0.012,
        offsetLon: 0.009,
        address: '88 High Street, West End',
        phone: '+1 (555) 876-5432',
        website: 'https://stjudecommunitylibrary.net',
        openingHours: 'Mo-Fr 08:30-18:00',
        isOpenNow: true,
        libraryType: 'Community Branch',
        operator: 'Public Libraries Trust',
        wheelchair: 'yes',
        internetAccess: 'wlan',
        fee: 'no'
      },
      {
        name: 'Heritage Archives & Reference Library',
        offsetLat: 0.018,
        offsetLon: -0.014,
        address: '302 Old College Road',
        phone: '+1 (555) 432-1098',
        website: 'https://heritagearchives.edu/library',
        openingHours: 'Tu-Sa 10:00-16:00',
        isOpenNow: false,
        libraryType: 'Academic / Reference Library',
        operator: 'Historical Society',
        wheelchair: 'limited',
        internetAccess: 'wlan',
        fee: 'no'
      },
      {
        name: 'Oakwood Children & Youth Reading Corner',
        offsetLat: -0.025,
        offsetLon: -0.021,
        address: '45 Parklands Way',
        phone: '+1 (555) 345-6789',
        website: null,
        openingHours: 'Mo-Sa 09:30-17:30',
        isOpenNow: true,
        libraryType: 'Public Library',
        operator: 'District Council',
        wheelchair: 'yes',
        internetAccess: 'wlan',
        fee: 'no'
      },
      {
        name: 'University Science & Engineering Memorial Library',
        offsetLat: 0.038,
        offsetLon: 0.029,
        address: 'Campus Gate 4, University Boulevard',
        phone: '+1 (555) 901-2345',
        website: 'https://university.edu/libraries/stem',
        openingHours: 'Mo-Su 24/7',
        isOpenNow: true,
        libraryType: 'Academic / University Library',
        operator: 'State University',
        wheelchair: 'yes',
        internetAccess: 'wlan',
        fee: 'no'
      },
      {
        name: 'East District Public Lending Library',
        offsetLat: 0.062,
        offsetLon: -0.045,
        address: '772 Market Street, East Town',
        phone: '+1 (555) 654-3210',
        website: 'https://eastlibraries.gov',
        openingHours: 'Mo-Fr 09:00-19:00',
        isOpenNow: false,
        libraryType: 'Public Library',
        operator: 'City Council',
        wheelchair: 'yes',
        internetAccess: 'yes',
        fee: 'no'
      },
      {
        name: 'Southside Tech & Digital Media Library',
        offsetLat: -0.085,
        offsetLon: 0.071,
        address: '12 Innovation Park Avenue',
        phone: '+1 (555) 789-0123',
        website: 'https://southsidelibrary.org',
        openingHours: 'Mo-Sa 10:00-21:00',
        isOpenNow: true,
        libraryType: 'Public Library',
        operator: 'Digital Media Foundation',
        wheelchair: 'yes',
        internetAccess: 'wlan',
        fee: 'no'
      }
    ];

    // Filter by radiusKm
    return templates.map((tmpl, idx) => {
      const libraryLat = Number((lat + tmpl.offsetLat).toFixed(6));
      const libraryLon = Number((lon + tmpl.offsetLon).toFixed(6));

      return {
        id: `mock-${idx + 1}`,
        name: tmpl.name,
        lat: libraryLat,
        lon: libraryLon,
        address: tmpl.address,
        phone: tmpl.phone,
        website: tmpl.website,
        openingHours: tmpl.openingHours,
        isOpenNow: tmpl.isOpenNow,
        libraryType: tmpl.libraryType,
        operator: tmpl.operator,
        wheelchair: tmpl.wheelchair,
        internetAccess: tmpl.internetAccess,
        fee: tmpl.fee,
        source: 'Demo Dataset'
      };
    });
  }
}
