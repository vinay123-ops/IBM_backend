const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;
const API_KEY = 'XU7ywpBTzrvpxOPrwgzm7fthzPXL2REz';
const BASE_URL = 'https://api.tomtom.com';

app.use(express.json());

// Middleware to handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Geocode API
app.get('/search/geocode/:query', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/2/geocode/${encodeURIComponent(req.params.query)}.json`, {
      params: {
        key: API_KEY,
        ...req.query  // Pass all optional query parameters like storeResult, typeahead, limit, etc.
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Reverse Geocode API
app.get('/search/reverse-geocode/:position', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/2/reverseGeocode/${req.params.position}.json`, {
      params: {
        key: API_KEY,
        ...req.query  // returnSpeedLimit, heading, radius, etc.
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Fuzzy Search API
app.get('/search/fuzzy-search/:query', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/2/search/${encodeURIComponent(req.params.query)}.json`, {
      params: {
        key: API_KEY,
        ...req.query  // typeahead, limit, ofs, etc.
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// POI Search API
app.get('/search/poi-search/:query', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/2/poiSearch/${encodeURIComponent(req.params.query)}.json`, {
      params: {
        key: API_KEY,
        ...req.query  // typeahead, limit, ofs, countrySet, etc.
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Nearby Search API
app.get('/search/nearby-search', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/2/nearbySearch/.json`, {
      params: {
        key: API_KEY,
        ...req.query  // lat, lon, radius, limit, etc.
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Calculate Route API (handles both basic and waypoint routing as the endpoint is the same)
app.get('/routing/calculate-route/:routePlanningLocations', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/routing/1/calculateRoute/${req.params.routePlanningLocations}/json`, {
      params: {
        key: API_KEY,
        ...req.query  // maxAlternatives, alternativeType, etc.
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Calculate Reachable Range API
app.get('/routing/calculate-reachable-range/:origin', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/routing/1/calculateReachableRange/${req.params.origin}/json`, {
      params: {
        key: API_KEY,
        ...req.query  // fuelBudgetInLiters, energyBudgetInkWh, etc.
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Traffic Incident Details API
app.get('/traffic/incident-details', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/traffic/services/5/incidentDetails`, {
      params: {
        key: API_KEY,
        ...req.query  // bbox, fields, language, etc.
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Static Map Image API
app.get('/map/static-image', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/map/1/staticimage`, {
      params: {
        key: API_KEY,
        ...req.query  // center, bbox, zoom, width, height, etc.
      },
      responseType: 'arraybuffer'  // Since it's an image, handle as binary
    });
    res.set('Content-Type', 'image/png');  // Assuming PNG, adjust based on format param
    res.send(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
