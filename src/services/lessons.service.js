// src/services/lessons.service.js
import api from './api';

const lessonsService = {
  listByCourse: async (courseId) => {
    try {
      const response = await api.get(`/lessons/course/${courseId}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar aulas:', error);
      throw error;
    }
  },
  create: (payload) => api.post('/lessons', payload),
  update: (id, payload) => api.put(`/lessons/${id}`, payload),
  remove: (id) => api.delete(`/lessons/${id}`),
};

export default lessonsService;
