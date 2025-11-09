import api from './api';

const coursesService = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (payload) => api.post('/courses', payload),
  update: (id, payload) => api.put(`/courses/${id}`, payload),
  remove: (id) => api.delete(`/courses/${id}`),
  addStudent: (courseId, studentId) => api.post(`/courses/${courseId}/students`, { studentId }),
  removeStudent: (courseId, studentId) => api.delete(`/courses/${courseId}/students`, { data: { studentId } }),
};

export default coursesService;


