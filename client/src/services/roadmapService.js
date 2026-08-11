import API from './api';

export const getMyRoadmaps = async () => {
  const response = await API.get('/roadmaps/my');
  return response.data;
};

export const createRoadmap = async (skillTitle) => {
  const response = await API.post('/roadmaps', { skillTitle });
  return response.data;
};

export const toggleTopicCompletion = async (roadmapId, topicId, completed) => {
  const response = await API.put(`/roadmaps/${roadmapId}/topic`, { topicId, completed });
  return response.data;
};

export const deleteRoadmap = async (roadmapId) => {
  const response = await API.delete(`/roadmaps/${roadmapId}`);
  return response.data;
};
