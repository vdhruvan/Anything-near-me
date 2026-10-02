import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getProvider, MockProvider } from './providers/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Haversine formula calculation
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(distanceKm) {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    provider: process.env.PLACES_PROVIDER || 'overpass',
    timestamp: new Date().toISOString()
  });
});

// Search nearby libraries endpoint
app.get('/api/libraries', async (req, res) => {
  try {
    const { lat, lon, radius = '5', provider: customProvider } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: 'Latitude and longitude query parameters are required.'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const radiusKm = parseFloat(radius);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusKm)) {
      return res.status(400).json({
        error: 'Invalid coordinates or radius supplied.'
      });
    }

    const provider = getProvider(customProvider);
    let libraries = [];
    let providerUsed = provider.name;
    let isFallback = false;

    try {
      libraries = await provider.searchNearby(latitude, longitude, radiusKm);
    } catch (providerError) {
      console.warn(`Primary provider (${provider.name}) failed:`, providerError.message);
      // Fallback to Mock provider to ensure continuity
      const fallbackProvider = new MockProvider();
      libraries = await fallbackProvider.searchNearby(latitude, longitude, radiusKm);
      providerUsed = `${provider.name} (failed, used Demo Dataset)`;
      isFallback = true;
    }

    // Attach accurate distance using Haversine formula and sort by distance nearest first
    const enrichedLibraries = libraries.map((lib) => {
      const distanceKm = calculateHaversineDistance(latitude, longitude, lib.lat, lib.lon);
      return {
        ...lib,
        distanceKm: Number(distanceKm.toFixed(2)),
        formattedDistance: formatDistance(distanceKm),
        directionsUrl: `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${lib.lat},${lib.lon}&travelmode=driving`,
        osmDirectionsUrl: `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${latitude}%2C${longitude}%3B${lib.lat}%2C${lib.lon}`
      };
    });

    // Default sorting: nearest first
    enrichedLibraries.sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({
      success: true,
      userLocation: { lat: latitude, lon: longitude },
      radiusKm,
      totalCount: enrichedLibraries.length,
      provider: providerUsed,
      isFallback,
      results: enrichedLibraries
    });
  } catch (error) {
    console.error('Error fetching nearby libraries:', error);
    res.status(500).json({
      error: 'An unexpected error occurred while searching for libraries.',
      details: error.message
    });
  }
});

// Geocoding endpoint to convert address/city to coordinates (optional manual search)
app.get('/api/geocode', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query required.' });
    }

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`;
    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'LibraryFinderApp/1.0 (nearby library discovery)'
      }
    });

    if (!response.ok) {
      throw new Error(`Nominatim HTTP ${response.status}`);
    }

    const data = await response.json();
    const results = data.map((item) => ({
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      type: item.type,
      importance: item.importance
    }));

    res.json({ success: true, results });
  } catch (err) {
    console.warn('Geocoding error:', err.message);
    res.status(500).json({ error: 'Geocoding lookup failed.' });
  }
});

// Serve static frontend in production
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Library Finder server running on http://localhost:${PORT}`);
});

