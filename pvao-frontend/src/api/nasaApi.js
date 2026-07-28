// pvao-frontend/src/api/nasaApi.js
import axios from 'axios';

// Since this is frontend only, we are directly calling NASA for APOD for the Landing Page demo.
// In production, this should proxy through the pvao-backend to protect API keys.
const NASA_API_KEY = 'DEMO_KEY';
const BASE_URL = 'https://api.nasa.gov';

export const fetchAPOD = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/planetary/apod`, {
      params: {
        api_key: NASA_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching APOD:', error);
    throw error;
  }
};
