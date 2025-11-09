// src/services/exams.service.js
import api from './api';

const examsService = {
  listByCourse: (courseId) => api.get(`/exams/course/${courseId}`),
  create: (payload) => api.post('/exams', payload),
  update: (id, payload) => api.put(`/exams/${id}`, payload),
  remove: (id) => api.delete(`/exams/${id}`),
};

export default examsService;
