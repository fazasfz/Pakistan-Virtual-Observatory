import axiosClient from '../../../api/axiosClient';

export const fetchLiveData = async () => {
  const response = await axiosClient.get('/lunar-observatory/live-data');
  return response.data;
};

export const fetchFeatures = async () => {
  const response = await axiosClient.get('/lunar-observatory/features');
  return response.data;
};
