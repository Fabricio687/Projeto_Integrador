// src/services/grades.service.js
import api from './api';

const gradesService = {
  // Notas do aluno autenticado
  listMine: () => api.get('/grades/me'),
  // Todas as notas (staff vê todas, student vê apenas as suas)
  getAll: () => api.get('/grades'),
  // Staff: notas por aluno
  listByStudent: (studentId) => api.get(`/grades/student/${studentId}`),
  create: (payload) => api.post('/grades', payload),
  update: (id, payload) => api.put(`/grades/${id}`, payload),
  remove: (id) => api.delete(`/grades/${id}`),
};

export default gradesService;
