const ASTRO_COPILOT_API_URL =
  import.meta.env.VITE_ASTROCOPILOT_API_URL || (typeof window !== 'undefined' && window.location.port === '5173' ? 'http://localhost:8000/api/ask' : '/api/ask');

export const fetchAstroCopilotStream = async (userMessage) => {
  return fetch(ASTRO_COPILOT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: userMessage,
      source: 'main_vao',
    }),
  });
};
