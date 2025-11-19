import api from './api';

const usersService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.role) params.append('role', filters.role);
    if (filters.course) params.append('course', filters.course);
    const queryString = params.toString();
    return api.get(`/users${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => api.get(`/users/${id}`),
  create: (payload) => api.post('/users', payload),
  update: (id, payload) => api.put(`/users/${id}`, payload),
  remove: (id) => api.delete(`/users/${id}`),
};

export default usersService;


