import API from './api';

export const getSessions = async () => {
  const response = await API.get('/sessions');
  return response.data;
};

export const createSession = async (sessionData) => {
  const response = await API.post('/sessions', sessionData);
  return response.data;
};

export const updateSession = async (sessionId, updateData) => {
  const response = await API.put(`/sessions/${sessionId}`, updateData);
  return response.data;
};

export const deleteSession = async (sessionId) => {
  const response = await API.delete(`/sessions/${sessionId}`);
  return response.data;
};
