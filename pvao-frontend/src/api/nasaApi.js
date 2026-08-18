// pvao-frontend/src/api/nasaApi.js
import axios from 'axios';

// Since this is frontend only, we are directly calling NASA for APOD for the Landing Page demo.
// In production, this should proxy through the pvao-backend to protect API keys.
const NASA_API_KEY = 'DEMO_KEY';
const BASE_URL = 'http://localhost:8000/api/v1';

export const fetchAPOD = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/apod`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.warn('NASA API error (possibly rate limit). Using fallback APOD data.');
      const fallbacks = [
        {
          title: "The Milky Way over the Pinnacles",
          url: "https://apod.nasa.gov/apod/image/2308/PinnaclesMilkyWay_Goh_960.jpg",
          explanation: "A stunning view of the Milky Way galaxy stretching over the Pinnacles in Australia. This is a fallback image.",
          media_type: "image",
        },
        {
          title: "Andromeda Galaxy",
          url: "https://apod.nasa.gov/apod/image/2308/Andromeda_Gendler_960.jpg",
          explanation: "The majestic Andromeda Galaxy, our closest large galactic neighbor. This is a fallback image.",
          media_type: "image",
        },
        {
          title: "The Orion Nebula",
          url: "https://apod.nasa.gov/apod/image/2307/Orion_webb_960.jpg",
          explanation: "A breathtaking view of the Orion Nebula's star-forming region. This is a fallback image.",
          media_type: "image",
        }
      ];
      const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      return randomFallback;
    }
    console.error('Error fetching APOD:', error);
    throw error;
  }
};
