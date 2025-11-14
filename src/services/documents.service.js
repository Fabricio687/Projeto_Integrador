import api from './api';

const documentsService = {
  /**
   * Obter documentos do usuário autenticado
   */
  getMyDocuments: async () => {
    try {
      const response = await api.get('/documents/my-documents');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      throw error;
    }
  },

  /**
   * Upload de documento
   */
  uploadDocument: async (formData) => {
    try {
      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }
  },

  /**
   * Obter documento por ID
   */
  getDocument: async (id) => {
    try {
      const response = await api.get(`/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar documento:', error);
      throw error;
    }
  },

  /**
   * Obter documentos de alunos (para professores/admins)
   */
  getStudentDocuments: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.studentId) params.append('studentId', filters.studentId);
      if (filters.courseId) params.append('courseId', filters.courseId);
      if (filters.category) params.append('category', filters.category);
      
      const response = await api.get(`/documents/students/all?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar documentos de alunos:', error);
      throw error;
    }
  },

  /**
   * Deletar documento
   */
  deleteDocument: async (id) => {
    try {
      const response = await api.delete(`/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
      throw error;
    }
  },

  /**
   * Atualizar documento
   */
  updateDocument: async (id, data) => {
    try {
      const response = await api.put(`/documents/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      throw error;
    }
  },
};

export default documentsService;

