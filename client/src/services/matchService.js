import API from './api';

export const getRecommendations = async () => {
  const response = await API.get('/recommendations');
  return response.data;
};

export const getMatchByUserId = async (userId) => {
  const response = await API.get(`/recommendations/${userId}`);
  return response.data;
};
