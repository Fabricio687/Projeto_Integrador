// src/pages/MessagesPage.jsx
import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import MessageList from '../components/messages/MessageList';
import MessageForm from '../components/messages/MessageForm';
import { Mail, Send } from 'lucide-react';

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [showComposeForm, setShowComposeForm] = useState(false);

  const handleMessageSent = () => {
    setShowComposeForm(false);
    // Recarregar a lista de mensagens enviadas se estiver nessa aba
    if (activeTab === 'sent') {
      setActiveTab('inbox');
      setTimeout(() => setActiveTab('sent'), 100);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-[#E6EAF0]">Mensagens</h1>
            <p className="text-sm text-neutral-600 dark:text-[#9CA3AF] mt-1">
              Gerencie suas mensagens e comunique-se com professores e colegas
            </p>
          </div>
          <Button onClick={() => setShowComposeForm(!showComposeForm)}>
            {showComposeForm ? 'Cancelar' : 'Nova Mensagem'}
          </Button>
        </div>
      </Card>

      {showComposeForm && (
        <Card>
          <h2 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-[#E6EAF0]">Enviar Nova Mensagem</h2>
          <MessageForm onMessageSent={handleMessageSent} />
        </Card>
      )}

      <Card>
        <div className="border-b border-neutral-200 dark:border-[rgba(255,255,255,0.1)]">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'inbox'
                  ? 'border-blue-500 dark:border-accent-blue text-blue-600 dark:text-accent-blue'
                  : 'border-transparent text-neutral-500 dark:text-[#9CA3AF] hover:text-neutral-700 dark:hover:text-[#E6EAF0] hover:border-neutral-300 dark:hover:border-[rgba(255,255,255,0.2)]'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Caixa de Entrada
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'sent'
                  ? 'border-blue-500 dark:border-accent-blue text-blue-600 dark:text-accent-blue'
                  : 'border-transparent text-neutral-500 dark:text-[#9CA3AF] hover:text-neutral-700 dark:hover:text-[#E6EAF0] hover:border-neutral-300 dark:hover:border-[rgba(255,255,255,0.2)]'
              }`}
            >
              <Send className="w-4 h-4 inline mr-2" />
              Enviadas
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'inbox' ? (
            <MessageList type="inbox" />
          ) : (
            <MessageList type="sent" />
          )}
        </div>
      </Card>
    </div>
  );
}