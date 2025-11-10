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
  },

  /**
   * Obter alunos de um curso (para professores)
   * @param {string} courseId ID do curso
   * @returns {Promise} Promessa com os alunos do curso
   */
  getCourseStudents: async (courseId) => {
    try {
      const response = await api.get(`/attendance/course/${courseId}/students`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar alunos do curso:', error);
      throw error;
    }
  },

  /**
   * Criar registro de presença
   * @param {Object} data - Dados do registro de presença
   * @returns {Promise} Promessa com o registro criado
   */
  createAttendance: async (data) => {
    try {
      const response = await api.post('/attendance', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar registro de presença:', error);
      throw error;
    }
  },

  /**
   * Criar múltiplos registros de presença
   * @param {Object} data - Dados dos registros (courseId, date, attendances)
   * @returns {Promise} Promessa com os registros criados
   */
  createMultipleAttendances: async (data) => {
    try {
      const response = await api.post('/attendance/multiple', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar registros de presença:', error);
      throw error;
    }
  }
};

export default attendanceService;




