import API from './api';

export const getConnections = async () => {
  const response = await API.get('/connections');
  return response.data;
};

export const sendConnectionRequest = async (recipientId, note = '') => {
  const response = await API.post('/connections/request', { recipientId, note });
  return response.data;
};

export const acceptConnection = async (connectionId) => {
  const response = await API.put(`/connections/${connectionId}/accept`);
  return response.data;
};

export const rejectConnection = async (connectionId) => {
  const response = await API.put(`/connections/${connectionId}/reject`);
  return response.data;
};

export const removeConnection = async (connectionId) => {
  const response = await API.delete(`/connections/${connectionId}`);
  return response.data;
};
