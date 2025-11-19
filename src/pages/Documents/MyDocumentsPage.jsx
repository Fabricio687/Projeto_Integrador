import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import documentsService from '../../services/documents.service';
import { FileText, Upload, Download, Trash2, Eye, Calendar, Folder } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

const categoryLabels = {
  atestado: 'Atestado Médico',
  declaração: 'Declaração',
  histórico: 'Histórico Escolar',
  boleto: 'Boleto',
  contrato: 'Contrato',
  curriculo: 'Currículo',
  outro: 'Outro',
};

const categoryColors = {
  atestado: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
  declaração: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
  histórico: 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400',
  boleto: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  contrato: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',
  curriculo: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400',
  outro: 'bg-neutral-100 dark:bg-neutral-500/20 text-neutral-700 dark:text-neutral-400',
};

export default function MyDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await documentsService.getMyDocuments();
      
      if (response.success) {
        setDocuments(response.data || []);
      }
    } catch (err) {
      setError('Erro ao carregar documentos. Tente novamente.');
      console.error('Erro ao buscar documentos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este documento?')) {
      return;
    }

    try {
      await documentsService.deleteDocument(id);
      toast.success('Documento deletado com sucesso!');
      fetchDocuments();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao deletar documento';
      toast.error(message);
    }
  };

  const handleDownload = (document) => {
    // Construir URL completa do arquivo
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3100';
    const fileUrl = `${baseUrl}${document.fileUrl}`;
    window.open(fileUrl, '_blank');
  };

  const filteredDocuments = filter === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === filter);

  const categories = [...new Set(documents.map(doc => doc.category))];

  if (loading) {
    return (
      <div className="p-6">
        <Loading text="Carregando documentos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-12">
            <p className="text-accent-red mb-4">{error}</p>
            <Button onClick={fetchDocuments}>Tentar Novamente</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-[#E6EAF0] mb-2">
            Meus Documentos
          </h1>
          <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">
            Gerencie seus documentos pessoais, atestados e currículo
          </p>
        </div>
        <Link to="/documents/upload">
          <Button variant="primary" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Enviar Documento
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      {categories.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-250 ${
                filter === 'all'
                  ? 'bg-accent-blue text-white shadow-soft-dark'
                  : 'bg-neutral-100 dark:bg-[rgba(255,255,255,0.05)] text-neutral-700 dark:text-[#9CA3AF] hover:bg-neutral-200 dark:hover:bg-[rgba(255,255,255,0.1)]'
              }`}
            >
              Todos ({documents.length})
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-250 ${
                  filter === category
                    ? 'bg-accent-blue text-white shadow-soft-dark'
                    : 'bg-neutral-100 dark:bg-[rgba(255,255,255,0.05)] text-neutral-700 dark:text-[#9CA3AF] hover:bg-neutral-200 dark:hover:bg-[rgba(255,255,255,0.1)]'
                }`}
              >
                {categoryLabels[category] || category} ({documents.filter(d => d.category === category).length})
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Lista de Documentos */}
      {filteredDocuments.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Folder className="w-16 h-16 text-neutral-400 dark:text-[#6B7280] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-[#E6EAF0] mb-2">
              Nenhum documento encontrado
            </h3>
            <p className="text-sm text-neutral-600 dark:text-[#9CA3AF] mb-6">
              {filter === 'all' 
                ? 'Você ainda não enviou nenhum documento.'
                : `Nenhum documento na categoria "${categoryLabels[filter] || filter}".`}
            </p>
            <Link to="/documents/upload">
              <Button variant="primary">
                <Upload className="w-4 h-4 mr-2" />
                Enviar Primeiro Documento
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((document) => (
            <Card key={document._id} hover className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent-blue/10 dark:bg-accent-blue/20 rounded-lg">
                    <FileText className="w-6 h-6 text-accent-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-[#E6EAF0] text-sm">
                      {document.title}
                    </h3>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${categoryColors[document.category] || categoryColors.outro}`}>
                      {categoryLabels[document.category] || document.category}
                    </span>
                  </div>
                </div>
              </div>

              {document.description && (
                <p className="text-sm text-neutral-600 dark:text-[#9CA3AF] mb-4 line-clamp-2">
                  {document.description}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-[#6B7280] mb-4">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(document.createdAt), "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
                </span>
              </div>

              {document.course && (
                <div className="text-xs text-neutral-600 dark:text-[#9CA3AF] mb-4">
                  Curso: {document.course.name}
                </div>
              )}

              <div className="flex items-center gap-2 pt-4 border-t border-neutral-200 dark:border-[rgba(255,255,255,0.1)]">
                <button
                  onClick={() => handleDownload(document)}
                  className="flex-1 px-3 py-2 bg-accent-blue/10 dark:bg-accent-blue/20 text-accent-blue rounded-lg hover:bg-accent-blue/20 dark:hover:bg-accent-blue/30 transition-all duration-250 flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Baixar
                </button>
                <button
                  onClick={() => handleDelete(document._id)}
                  className="px-3 py-2 bg-accent-red/10 dark:bg-accent-red/20 text-accent-red rounded-lg hover:bg-accent-red/20 dark:hover:bg-accent-red/30 transition-all duration-250"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

