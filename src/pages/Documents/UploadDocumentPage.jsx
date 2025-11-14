import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import documentsService from '../../services/documents.service';
import coursesService from '../../services/courses.service';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const categoryOptions = [
  { value: 'atestado', label: 'Atestado Médico' },
  { value: 'declaração', label: 'Declaração' },
  { value: 'histórico', label: 'Histórico Escolar' },
  { value: 'boleto', label: 'Boleto' },
  { value: 'contrato', label: 'Contrato' },
  { value: 'curriculo', label: 'Currículo' },
  { value: 'outro', label: 'Outro' },
];

export default function UploadDocumentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'outro',
    courseId: '',
  });
  const [courses, setCourses] = useState([]);

  React.useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await coursesService.getAll();
      if (response.success) {
        setCourses(response.data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validar tamanho (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('Arquivo muito grande! Tamanho máximo: 10MB');
        return;
      }
      setFile(selectedFile);
      if (!formData.title) {
        setFormData(prev => ({ ...prev, title: selectedFile.name }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Selecione um arquivo para enviar');
      return;
    }

    try {
      setLoading(true);
      
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('category', formData.category);
      if (formData.courseId) {
        uploadFormData.append('courseId', formData.courseId);
      }

      const response = await documentsService.uploadDocument(uploadFormData);
      
      if (response.success) {
        toast.success('Documento enviado com sucesso!');
        navigate('/documents');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao enviar documento';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-[#E6EAF0] mb-2">
          Enviar Documento
        </h1>
        <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">
          Envie documentos pessoais, atestados, currículo e outros arquivos
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload de Arquivo */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-[#E6EAF0] mb-2">
              Arquivo *
            </label>
            <div className="mt-2">
              {!file ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg cursor-pointer hover:border-accent-blue dark:hover:border-accent-blue transition-all duration-250 bg-neutral-50 dark:bg-[rgba(30,38,54,0.4)]">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-neutral-400 dark:text-[#9CA3AF]" />
                    <p className="mb-2 text-sm text-neutral-600 dark:text-[#9CA3AF]">
                      <span className="font-semibold">Clique para fazer upload</span> ou arraste o arquivo
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-[#6B7280]">
                      PDF, DOC, DOCX, imagens (máx. 10MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.xls,.xlsx"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-500/20 border border-green-200 dark:border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-[#E6EAF0]">
                        {file.name}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-[#9CA3AF]">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-2 text-neutral-500 dark:text-[#9CA3AF] hover:text-accent-red transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-[#E6EAF0] mb-2">
              Título *
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Atestado Médico - Janeiro 2024"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-[#E6EAF0] mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição opcional do documento..."
              rows={4}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg bg-white dark:bg-[rgba(30,38,54,0.6)] text-neutral-900 dark:text-[#E6EAF0] placeholder-neutral-400 dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-250 resize-none"
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-[#E6EAF0] mb-2">
              Categoria *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg bg-white dark:bg-[rgba(30,38,54,0.6)] text-neutral-900 dark:text-[#E6EAF0] focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-250"
              required
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Curso (opcional) */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-[#E6EAF0] mb-2">
              Curso (opcional)
            </label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg bg-white dark:bg-[rgba(30,38,54,0.6)] text-neutral-900 dark:text-[#E6EAF0] focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-250"
            >
              <option value="">Selecione um curso (opcional)</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
          </div>

          {/* Botões */}
          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !file}
              className="flex-1"
            >
              {loading ? 'Enviando...' : 'Enviar Documento'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/documents')}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

