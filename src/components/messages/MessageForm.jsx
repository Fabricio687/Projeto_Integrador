// src/components/messages/MessageForm.jsx
import { useState, useEffect, useRef } from 'react';
import messagesService from '../../services/messages.service';

export default function MessageForm({ onMessageSent }) {
  const [formData, setFormData] = useState({
    receiverEmail: '',
    subject: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimeoutRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    // Fechar sugestões quando clicar fora
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchUsers = async (email) => {
    if (!email || email.length < 2) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    // Limpar timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Aguardar um pouco antes de buscar (debounce)
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const response = await messagesService.searchUsersByEmail(email);
        // Backend retorna { success, data } e o service já retorna response.data
        setSearchResults(response?.data || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'receiverEmail') {
      handleSearchUsers(value);
    }
  };

  const selectUser = (user) => {
    setFormData(prev => ({ ...prev, receiverEmail: user.email }));
    setShowSuggestions(false);
    setSearchResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await messagesService.sendMessage(formData);
      setSuccess(true);
      setFormData({ receiverEmail: '', subject: '', content: '' });
      setSearchResults([]);
      setShowSuggestions(false);
      if (onMessageSent) onMessageSent();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao enviar mensagem. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={formRef} className="relative">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="receiverEmail" className="block text-sm font-medium text-gray-700">
            Email do Destinatário
          </label>
          <input
            type="email"
            id="receiverEmail"
            name="receiverEmail"
            value={formData.receiverEmail}
            onChange={handleChange}
            required
            autoComplete="off"
            placeholder="Digite o email do destinatário..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {showSuggestions && searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  onClick={() => selectUser(user)}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="text-xs text-gray-400 capitalize">{user.role}</div>
                </div>
              ))}
            </div>
          )}
          {searchLoading && (
            <div className="absolute right-3 top-8 text-sm text-gray-400">
              Buscando...
            </div>
          )}
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Assunto
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Mensagem
          </label>
          <textarea
            id="content"
            name="content"
            rows={4}
            value={formData.content}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">Mensagem enviada com sucesso!</p>}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar Mensagem'}
        </button>
      </form>
    </div>
  );
}