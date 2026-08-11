import { useState, useEffect } from 'react';
import { fetchLiveData, fetchFeatures } from '../api/lunarObservatoryApi';

export const useLunarData = () => {
  const [liveData, setLiveData] = useState(null);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const [data, fData] = await Promise.all([
          fetchLiveData(),
          fetchFeatures()
        ]);
        
        if (mounted) {
          setLiveData(data);
          setFeatures(fData);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error("Failed to fetch lunar data:", err);
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    // Optionally set up polling if we want live updates without refresh
    const intervalId = setInterval(loadData, 60000); // refresh every minute

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return { liveData, features, loading, error };
};
