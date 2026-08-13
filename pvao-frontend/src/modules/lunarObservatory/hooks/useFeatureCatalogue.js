import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../../../api/axiosClient';

export const useFeatureCatalogue = (viewMode = '3D') => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [nearbyFeatures, setNearbyFeatures] = useState([]);

  useEffect(() => {
    const fetchFeatures = async () => {
      setLoading(true);
      try {
        const dataset = viewMode === '3D' ? 'curated' : 'full';
        const url = activeCategory !== 'All' 
          ? `/lunar-observatory/features?category=${activeCategory}&dataset=${dataset}`
          : `/lunar-observatory/features?dataset=${dataset}`;
        const response = await axiosClient.get(url);
        setFeatures(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatures();
  }, [activeCategory, viewMode]);

  useEffect(() => {
    const fetchFeatureDetails = async () => {
      if (!selectedFeatureId) {
        setSelectedFeature(null);
        setNearbyFeatures([]);
        return;
      }
      try {
        const [featureRes, nearbyRes] = await Promise.all([
          axiosClient.get(`/lunar-observatory/features/${selectedFeatureId}`),
          axiosClient.get(`/lunar-observatory/features/${selectedFeatureId}/nearby`)
        ]);
        setSelectedFeature(featureRes.data);
        setNearbyFeatures(nearbyRes.data);
      } catch (err) {
        console.error("Failed to load feature details", err);
      }
    };
    fetchFeatureDetails();
  }, [selectedFeatureId]);

  const filteredFeatures = useMemo(() => {
    return features.filter(f => 
      f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [features, searchTerm]);

  useEffect(() => {
    if (filteredFeatures.length > 0 && !selectedFeatureId && !loading) {
      setSelectedFeatureId(filteredFeatures[0].id);
    }
  }, [filteredFeatures, selectedFeatureId, loading]);

  return {
    features: filteredFeatures,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    selectedFeatureId,
    setSelectedFeatureId,
    selectedFeature,
    nearbyFeatures,
  };
};
