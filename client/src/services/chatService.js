import API from './api';

export const getConversations = async () => {
  const response = await API.get('/messages/conversations');
  return response.data;
};

export const getMessages = async (userId) => {
  const response = await API.get(`/messages/${userId}`);
  return response.data;
};

export const sendMessage = async (receiverId, content) => {
  const response = await API.post('/messages', { receiverId, content });
  return response.data;
};
