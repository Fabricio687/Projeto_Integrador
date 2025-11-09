// src/services/messages.service.js
import api from './api';

/**
 * Serviço para gerenciar mensagens
 */
const messagesService = {
  /**
   * Buscar usuários por email (para autocomplete)
   * @param {string} email Email ou parte do email para buscar
   * @returns {Promise} Promessa com os usuários encontrados
   */
  searchUsersByEmail: async (email) => {
    try {
      const response = await api.get(`/messages/search-users?email=${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },

  /**
   * Obter mensagens recebidas
   * @returns {Promise} Promessa com as mensagens recebidas
   */
  getInbox: async () => {
    try {
      const response = await api.get('/messages/inbox');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar mensagens recebidas:', error);
      throw error;
    }
  },

  /**
   * Obter mensagens enviadas
   * @returns {Promise} Promessa com as mensagens enviadas
   */
  getSent: async () => {
    try {
      const response = await api.get('/messages/sent');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar mensagens enviadas:', error);
      throw error;
    }
  },

  /**
   * Obter mensagem por ID
   * @param {string} id ID da mensagem
   * @returns {Promise} Promessa com a mensagem
   */
  getMessage: async (id) => {
    try {
      const response = await api.get(`/messages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar mensagem:', error);
      throw error;
    }
  },

  /**
   * Enviar mensagem
   * @param {Object} messageData Dados da mensagem
   * @param {string} messageData.receiverEmail Email do destinatário
   * @param {string} messageData.subject Assunto da mensagem
   * @param {string} messageData.content Conteúdo da mensagem
   * @param {Array} messageData.attachments Anexos (opcional)
   * @returns {Promise} Promessa com a mensagem enviada
   */
  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/messages', messageData);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  },

  /**
   * Excluir mensagem
   * @param {string} id ID da mensagem
   * @returns {Promise} Promessa com o resultado da exclusão
   */
  deleteMessage: async (id) => {
    try {
      const response = await api.delete(`/messages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir mensagem:', error);
      throw error;
    }
  }
};

export default messagesService;