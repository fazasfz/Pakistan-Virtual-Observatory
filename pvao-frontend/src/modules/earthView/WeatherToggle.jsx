import React from 'react';
import './weatherToggle.css';

const WeatherToggle = ({ active, onChange }) => (
  <button
    className={`earthview-weather-btn ${active ? 'earthview-weather-btn--active' : ''}`}
    onClick={() => onChange(!active)}
  >
    CLOUDS
  </button>
);

export default WeatherToggle;