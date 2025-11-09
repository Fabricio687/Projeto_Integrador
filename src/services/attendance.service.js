import api from './api';

const attendanceService = {
  /**
   * Obter todas as faltas do aluno autenticado
   * @returns {Promise} Promessa com as faltas e estatísticas
   */
  getMyAttendances: async () => {
    try {
      const response = await api.get('/attendance/my-attendances');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar faltas:', error);
      throw error;
    }
  },

  /**
   * Obter faltas por curso
   * @param {string} courseId ID do curso
   * @returns {Promise} Promessa com as faltas do curso
   */
  getAttendancesByCourse: async (courseId) => {
    try {
      const response = await api.get(`/attendance/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar faltas do curso:', error);
      throw error;
    }
  }
};

export default attendanceService;




