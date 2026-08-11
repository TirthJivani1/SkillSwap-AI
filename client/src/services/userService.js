import API from './api';

export const getUsers = async (params = {}) => {
  const response = await API.get('/users', { params });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await API.get(`/users/${id}`);
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await API.put('/users/profile', profileData);
  return response.data;
};
