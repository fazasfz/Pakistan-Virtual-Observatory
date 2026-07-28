// pvao-frontend/src/utils/formatCoordinates.js
export const getLocalCoordinates = () => {
  // Simplified placeholder coordinates for Islamabad (as per prompt example)
  return 'LAT 33.6844° N · LONG 73.0479° E — ISLAMABAD';
};

export const getLiveTime = () => {
  return new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
};
