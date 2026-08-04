import axiosClient from '../../../api/axiosClient';

export const askAstroCopilot = (question) =>
  axiosClient.post('/astro-copilot/ask', { question }).then((res) => res.data);
