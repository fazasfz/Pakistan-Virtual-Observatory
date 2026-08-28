/**
 * Custom hook to interface with the backend for celestial object searches.
 * Queries NED for object info and MAST for available imagery.
 * Returns: info, images, loading, error states, and search function.
 */
import { useState } from 'react';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1') + '/deep-sky-explorer';

/**
 * useObjectSearch
 * Handles searching for a celestial object via the backend,
 * which queries NED (info) and MAST (imagery).
 */
export function useObjectSearch() {
  const [info, setInfo] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (objectName) => {
    if (!objectName) return;
    setLoading(true);
    setError(null);
    setInfo(null);
    setImages([]);

    try {
      const infoRes = await fetch(`${API_BASE}/object/${encodeURIComponent(objectName)}`);
      const infoData = await infoRes.json();

      if (infoData.error) {
        setError(infoData.error);
      } else {
        setInfo(infoData);
      }

      const imagesRes = await fetch(`${API_BASE}/object/${encodeURIComponent(objectName)}/images`);
      const imagesData = await imagesRes.json();
      setImages(imagesData.results || []);
    } catch (err) {
      setError('Could not reach the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return { search, info, images, loading, error };
}
