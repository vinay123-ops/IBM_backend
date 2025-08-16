import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const API_KEY = process.env.TOMTOM_API_KEY;
const BASE_URL = 'https://api.tomtom.com';

app.use(express.json());

// Validate position format (lat,lon)
const validatePosition = (position) => {
  const regex = /^-?\d+\.\d+,-?\d+\.\d+$/;
  return regex.test(position);
};

// Validate route locations format (lat1,lon1:lat2,lon2[:lat3,lon3...])
const validateRouteLocations = (locations) => {
  const regex = /^-?\d+\.\d+,-?\d+\.\d+(:-?\d+\.\d+,-?\d+\.\d+)*$/;
  return regex.test(locations);
};

// Geocode API
app.get('/search/geocode/:query', async (req, res, next) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/2/geocode/${encodeURIComponent(req.params.query)}.json`, {
      params: {
        key: API_KEY,
        ...req.query,
      },
    });
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

// Reverse Geocode API
app.get('/search/reverse-geocode/:position', async (req, res, next) => {
  try {
    if (!validatePosition(req.params.position)) {
      return res.status(400).json({ error: 'Invalid position format. Use lat,lon (e.g., 52.376372,4.900627)' });
    }
    const response = await axios.get(`${BASE_URL}/search/2/reverseGeocode/${req.params.position}.json`, {
      params: {
        key: API_KEY,
        ...req.query,
      },
    });
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

// Fuzzy Search API
app.get('/search/fuzzy-search/:query', async (req, res, next) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/2/search/${encodeURIComponent(req.params.query)}.json`, {
      params: {
        key: API_KEY,
        ...req.query,
      },
    });
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

// POI Search API
app.get('/search/poi-search/:query', async (req, res, next) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/2/poiSearch/${encodeURIComponent(req.params.query)}.json`, {
      params: {
        key: API_KEY,
        ...req.query,
      },
    });
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

// Nearby Search API
app.get('/search/nearby-search', async (req, res, next) => {
  try {
    if (!req.query.lat || !req.query.lon) {
      return res.status(400).json({ error: 'lat and lon query parameters are required' });
    }
    const response = await axios.get(`${BASE_URL}/search/2/nearbySearch/.json`, {
      params: {
        key: API_KEY,
        ...req.query,
      },
    });
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

// Calculate Route API
app.get('/routing/calculate-route/:routePlanningLocations', async (req, res, next) => {
  try {
    if (!validateRouteLocations(req.params.routePlanningLocations)) {
      return res.status(400).json({ error: 'Invalid route locations format. Use lat1,lon1:lat2,lon2[:lat3,lon3...]' });
    }
    const response = await axios.get(`${BASE_URL}/routing/1/calculateRoute/${req.params.routePlanningLocations}/json`, {
      params: {
        key: API_KEY,
        ...req.query,
      },
    });
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

// Calculate Reachable Range API
app.get('/routing/calculate-reachable-range/:origin', async (req, res, next) => {
  try {
    if (!validatePosition(req.params.origin)) {
      return res.status(400).json({ error: 'Invalid origin format. Use lat,lon (e.g., 52.376372,4.900627)' });
    }
    const response = await axios.get(`${BASE_URL}/routing/1/calculateReachableRange/${req.params.origin}/json`, {
      params: {
        key: API_KEY,
        ...req.query,
      },
    });
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

// Traffic Incident Details API
app.get('/traffic/incident-details', async (req, res, next) => {
  try {
    if (!req.query.bbox) {
      return res.status(400).json({ error: 'bbox query parameter is required' });
    }
    const response = await axios.get(`${BASE_URL}/traffic/services/5/incidentDetails`, {
      params: {
        key: API_KEY,
        ...req.query,
      },
    });
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

// Static Map Image API
app.get('/map/static-image', async (req, res, next) => {
  try {
    const format = req.query.format || 'png';
    const contentType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const response = await axios.get(`${BASE_URL}/map/1/staticimage`, {
      params: {
        key: API_KEY,
        ...req.query,
      },
      responseType: 'arraybuffer',
    });
    res.set('Content-Type', contentType);
    res.send(response.data);
  } catch (error) {
    next(error);
  }
});

// Error-handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.response?.status || 500;
  const message = err.response?.data?.message || err.message || 'Something broke!';
  res.status(status).json({ error: message });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

