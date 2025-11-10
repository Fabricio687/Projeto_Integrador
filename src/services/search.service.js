import api from './api';

const searchService = {
  /**
   * Buscar em cursos, aulas, provas e eventos
   * @param {string} query - Termo de busca
   * @returns {Promise} Promessa com os resultados da busca
   */
  search: async (query) => {
    try {
      const response = await api.get('/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar:', error);
      throw error;
    }
  }
};

export default searchService;

