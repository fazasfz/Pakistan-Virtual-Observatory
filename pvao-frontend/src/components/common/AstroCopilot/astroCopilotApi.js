import axiosClient from '../../../api/axiosClient';

export const askAstroCopilot = (question, history) =>
  axiosClient.post('/astro-copilot/ask', { question, history }).then((res) => res.data);
