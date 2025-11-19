// src/components/messages/MessageList.jsx
import { useState, useEffect } from 'react';
import messagesService from '../../services/messages.service';

export default function MessageList({ type = 'inbox' }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = type === 'inbox' 
          ? await messagesService.getInbox()
          : await messagesService.getSent();
        
        // Backend retorna { success, data, count }
        const messagesData = response.data?.data || response.data || [];
        setMessages(Array.isArray(messagesData) ? messagesData : []);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar mensagens');
        setLoading(false);
      }
    };

    fetchMessages();
  }, [type]);

  const handleDelete = async (id) => {
    try {
      await messagesService.deleteMessage(id);
      setMessages(messages.filter(message => message._id !== id));
    } catch (err) {
      setError('Erro ao excluir mensagem');
    }
  };

  if (loading) return <div className="flex justify-center p-8 text-neutral-600 dark:text-[#9CA3AF]">Carregando mensagens...</div>;
  if (error) return <div className="text-red-500 dark:text-red-400 p-4">{error}</div>;
  if (messages.length === 0) return <div className="p-4 text-gray-500 dark:text-[#9CA3AF]">Nenhuma mensagem encontrada</div>;

  return (
    <div className="divide-y divide-gray-200 dark:divide-[rgba(255,255,255,0.1)]">
      {messages.map((message) => (
        <div key={message._id} className="p-4 hover:bg-gray-50 dark:hover:bg-[rgba(255,255,255,0.05)] transition-all duration-250">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-[#E6EAF0]">{message.subject}</h3>
              <p className="text-sm text-gray-500 dark:text-[#9CA3AF]">
                {type === 'inbox' 
                  ? `De: ${message.sender?.name || 'Usuário'} ${message.sender?.email ? `(${message.sender.email})` : ''}`
                  : `Para: ${message.receiver?.name || 'Usuário'} ${message.receiver?.email ? `(${message.receiver.email})` : ''}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 dark:text-[#6B7280]">
                {new Date(message.createdAt).toLocaleDateString()}
              </span>
              <button 
                onClick={() => handleDelete(message._id)}
                className="text-red-500 dark:text-red-400 text-sm hover:text-red-700 dark:hover:text-red-300 transition-all duration-250"
              >
                Excluir
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-[#D1D5DB] line-clamp-2">{message.content}</p>
          {!message.read && type === 'inbox' && (
            <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-400 rounded-full">
              Não lida
            </span>
          )}
        </div>
      ))}
    </div>
  );
}