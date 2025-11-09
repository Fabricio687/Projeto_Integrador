import api from './api';

const usersService = {
  getAll: (role) => api.get(`/users${role ? `?role=${role}` : ''}`),
  getById: (id) => api.get(`/users/${id}`),
  create: (payload) => api.post('/users', payload),
  update: (id, payload) => api.put(`/users/${id}`, payload),
  remove: (id) => api.delete(`/users/${id}`),
};

export default usersService;


