import api from './api';

const coursesService = {
  getAll: async () => {
    try {
      const response = await api.get('/courses');
      // Retornar no formato esperado
      if (response.data?.success && response.data?.data) {
        return { success: true, data: response.data.data };
      } else if (response.data?.data) {
        return { success: true, data: response.data.data };
      } else if (Array.isArray(response.data)) {
        return { success: true, data: response.data };
      }
      return response.data || { success: false, data: [] };
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      return { success: false, data: [], error: error.message };
    }
  },
  getById: (id) => api.get(`/courses/${id}`),
  create: (payload) => api.post('/courses', payload),
  update: (id, payload) => api.put(`/courses/${id}`, payload),
  remove: (id) => api.delete(`/courses/${id}`),
  addStudent: (courseId, studentId) => api.post(`/courses/${courseId}/students`, { studentId }),
  removeStudent: (courseId, studentId) => api.delete(`/courses/${courseId}/students`, { data: { studentId } }),
};

export default coursesService;


