const ASTRO_COPILOT_API_URL =
  import.meta.env.VITE_ASTROCOPILOT_API_URL || 'http://localhost:8000/api/ask';

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
