// src/services/exams.service.js
import api from './api';

const examsService = {
  listByCourse: async (courseId) => {
    try {
      const response = await api.get(`/exams/course/${courseId}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar provas:', error);
      throw error;
    }
  },
  create: (payload) => api.post('/exams', payload),
  update: (id, payload) => api.put(`/exams/${id}`, payload),
  remove: (id) => api.delete(`/exams/${id}`),
};

export default examsService;
