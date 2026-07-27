// src/utils/api.ts
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';
export const fetchJson = async (endpoint: string) => {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }
  return response.json();
};
