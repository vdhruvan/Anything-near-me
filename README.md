# Library Finder 📚📍

A modern, responsive, privacy-respecting web application that helps users discover public and academic libraries near their current location with accurate distance calculations, interactive maps, and turn-by-turn directions.

---

## 🌟 Key Features

- **📍 Privacy-First Geolocation**:
  - Uses the native HTML5 `navigator.geolocation` API with `enableHighAccuracy: true`, `timeout: 10000`, and `maximumAge: 300000`.
  - Geolocation permission is **only requested on explicit user action** (clicking "Find Libraries Near Me"), never on initial page load.
  - Location is never stored, tracked, or logged on servers.
  - Complete error handling with friendly user guidance for **Permission Denied**, **Location Unavailable**, and **Request Timeout**, with a one-click **Try Again** button.
  
- **🗺️ Interactive Split Map & List View**:
  - Desktop view features a side-by-side layout: Library results on the left, interactive Leaflet map on the right.
  - Custom pulsing blue marker for the user's location with accuracy radius.
  - Custom green book markers for libraries that turn blue and enlarge when active.
  - Clicking a library card smoothly pans and opens the map popup; clicking a map marker scrolls directly to the library card.
  - Fully responsive mobile design with quick List ↔ Map view toggling.

- **📏 Accurate Distance Calculation (Haversine Formula)**:
  - Calculates great-circle spherical distances using Earth's mean radius of 6,371 km.
  - User-friendly formatting:
    - Below 1 km: displayed in meters (e.g. `350 m`, `820 m`)
    - 1 km and above: displayed in kilometers (e.g. `1.2 km`, `4.8 km`)

- **🔍 Smart Search, Radius Expansion & Filtering**:
  - Configurable search radius (default: `5 km`).
  - Automatic progressive radius expansion (`5 km` ➔ `10 km` ➔ `25 km`) if few libraries are found, with a clear user notification:
    > *"We couldn't find many libraries within 5 km, so we're showing libraries within 10 km."*
  - Instant live search input (`🔎 Search libraries`) filtering by library name, address, or operator.
  - Quick distance filter pills: `1 km`, `5 km`, `10 km`, `25 km`.
  - Sorting controls:
    - Distance: nearest first (default)
    - Distance: farthest first
    - Name: A–Z
    - Name: Z–A

- **🏛️ Rich Library Information Cards**:
  - Library Name
  - Distance badge (`📍 1.2 km away`)
  - Address
  - Real-time opening status (`🟢 Open now` / `🔴 Closed`), only displayed when verified (never invented)
  - Opening hours, phone number, website link, wheelchair accessibility, and Wi-Fi badges
  - **View Details**: modal with full information, address copying, and accessibility metadata
  - **Get Directions**: one-click navigation via Google Maps or OpenStreetMap

- **🔌 Swappable Provider Architecture**:
  - Built using the **Provider Pattern** (`LibraryProvider` interface) so the data provider can be easily changed:
    1. **OpenStreetMap Overpass API** (default, free worldwide coverage, zero API keys required).
    2. **Google Places API** (supported via environment variable `PLACES_API_KEY`).
    3. **Demonstration / Mock Provider** (instant fallback ensuring continuity even during network drops or in test environments).

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- npm (v9+)

### Installation

```bash
cd library-finder
npm install
```

### Running the Application

You can start the full application (Express backend + Vite static serving) on `http://localhost:3001`:

```bash
npm run server
```

Or run frontend development mode with Vite hot-reloading:

```bash
npm run dev
```

Then open your browser to [http://localhost:3001](http://localhost:3001) or [http://localhost:5173](http://localhost:5173).

---

## ⚙️ Configuration & Environment Variables

Environment variables are managed in `.env` (a `.env.example` template is provided). Secret API keys should **never** be committed to source control.

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Express server port |
| `PLACES_PROVIDER` | `overpass` | Provider to use (`overpass`, `google`, or `mock`) |
| `PLACES_API_KEY` | *(empty)* | Google Places API key (if `PLACES_PROVIDER=google`) |
| `DEFAULT_SEARCH_RADIUS_KM` | `5` | Initial search radius in kilometers |
| `MIN_RESULTS_THRESHOLD` | `3` | Minimum libraries required before expanding radius |

---

## 📡 API Endpoints

### 1. `GET /api/libraries`
Returns nearby libraries for the given coordinates and radius.
- **Parameters**:
  - `lat` (required, float): Latitude
  - `lon` (required, float): Longitude
  - `radius` (optional, float, default: `5`): Search radius in km
  - `provider` (optional, string): Provider override (`overpass`, `google`, `mock`)
- **Sample Response**:
  ```json
  {
    "success": true,
    "userLocation": { "lat": 12.9716, "lon": 77.5946 },
    "radiusKm": 5,
    "totalCount": 12,
    "provider": "OpenStreetMap Overpass API",
    "results": [
      {
        "id": "osm-node-12345",
        "name": "State Central Library",
        "lat": 12.9723,
        "lon": 77.5921,
        "address": "Cubbon Park, Bengaluru",
        "distanceKm": 0.32,
        "formattedDistance": "320 m",
        "directionsUrl": "https://www.google.com/maps/dir/?...",
        "openingHours": "Tu-Su 08:30-19:30"
      }
    ]
  }
  ```

### 2. `GET /api/geocode?q={searchQuery}`
Geocodes an address, city, or postal code to coordinates using OpenStreetMap Nominatim.

### 3. `GET /api/health`
Returns system status, active provider, and server timestamp.

---

## 📐 Haversine Formula Implementation

```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's mean radius in km

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
```

---

## ♿ Accessibility & Usability

- Semantic HTML5 structure (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`).
- Full keyboard navigation and visible focus rings (`focus:ring-2 focus:ring-emerald-500`).
- Clear ARIA labels on all icon buttons and interactive controls.
- Screen-reader friendly distance representations and error alerts.
- High color contrast meeting WCAG AA standards.
