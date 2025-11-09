// src/services/lessons.service.js
import api from './api';

const lessonsService = {
  listByCourse: (courseId) => api.get(`/lessons/course/${courseId}`),
  create: (payload) => api.post('/lessons', payload),
  update: (id, payload) => api.put(`/lessons/${id}`, payload),
  remove: (id) => api.delete(`/lessons/${id}`),
};

export default lessonsService;
