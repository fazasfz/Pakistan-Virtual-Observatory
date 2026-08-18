/**
 * Lunar Observatory API client.
 * Fetches live lunar telemetry (phase, illumination) and moon surface feature catalogues from the backend.
 */
import axiosClient from '../../../api/axiosClient';

export const fetchLiveData = async (targetDate = null) => {
  const url = targetDate ? `/lunar-observatory/live-data?datetime=${targetDate.toISOString()}` : '/lunar-observatory/live-data';
  const response = await axiosClient.get(url);
  return response.data;
};

export const fetchFeatures = async () => {
  const response = await axiosClient.get('/lunar-observatory/features');
  return response.data;
};
