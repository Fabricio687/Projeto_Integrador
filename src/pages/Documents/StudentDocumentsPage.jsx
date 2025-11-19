import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import documentsService from '../../services/documents.service';
import usersService from '../../services/users.service';
import coursesService from '../../services/courses.service';
import { FileText, Download, Search, Filter, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const categoryLabels = {
  atestado: 'Atestado Médico',
  declaração: 'Declaração',
  histórico: 'Histórico Escolar',
  boleto: 'Boleto',
  contrato: 'Contrato',
  curriculo: 'Currículo',
  outro: 'Outro',
};

export default function StudentDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    studentId: '',
    courseId: '',
    category: '',
    search: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [filters]);

  const fetchInitialData = async () => {
    try {
      const [studentsRes, coursesRes] = await Promise.all([
        usersService.getAll({ role: 'student' }),
        coursesService.getAll(),
      ]);

      if (studentsRes.success) {
        setStudents(studentsRes.data || []);
      }
      if (coursesRes.success) {
        setCourses(coursesRes.data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar dados iniciais:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentsService.getStudentDocuments(filters);
      
      if (response.success) {
        setDocuments(response.data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (document) => {
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3100';
    const fileUrl = `${baseUrl}${document.fileUrl}`;
    window.open(fileUrl, '_blank');
  };

  const filteredDocuments = documents.filter(doc => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        doc.title.toLowerCase().includes(searchLower) ||
        doc.user?.name?.toLowerCase().includes(searchLower) ||
        doc.user?.email?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  if (loading && documents.length === 0) {
    return (
      <div className="p-6">
        <Loading text="Carregando documentos..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-[#E6EAF0] mb-2">
          Documentos dos Alunos
        </h1>
        <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">
          Visualize e gerencie documentos enviados pelos alunos
        </p>
      </div>

      {/* Filtros */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-[#E6EAF0] mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                type="text"
                placeholder="Nome, email..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-[#E6EAF0] mb-2">
              Aluno
            </label>
            <select
              value={filters.studentId}
              onChange={(e) => setFilters(prev => ({ ...prev, studentId: e.target.value }))}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg bg-white dark:bg-[rgba(30,38,54,0.6)] text-neutral-900 dark:text-[#E6EAF0] focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-250"
            >
              <option value="">Todos os alunos</option>
              {students.map(student => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-[#E6EAF0] mb-2">
              Curso
            </label>
            <select
              value={filters.courseId}
              onChange={(e) => setFilters(prev => ({ ...prev, courseId: e.target.value }))}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg bg-white dark:bg-[rgba(30,38,54,0.6)] text-neutral-900 dark:text-[#E6EAF0] focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-250"
            >
              <option value="">Todos os cursos</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-[#E6EAF0] mb-2">
              Categoria
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg bg-white dark:bg-[rgba(30,38,54,0.6)] text-neutral-900 dark:text-[#E6EAF0] focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-250"
            >
              <option value="">Todas as categorias</option>
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Lista de Documentos */}
      {filteredDocuments.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="w-16 h-16 text-neutral-400 dark:text-[#6B7280] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-[#E6EAF0] mb-2">
              Nenhum documento encontrado
            </h3>
            <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">
              Não há documentos que correspondam aos filtros selecionados.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDocuments.map((document) => (
            <Card key={document._id} hover className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-accent-blue/10 dark:bg-accent-blue/20 rounded-lg">
                      <FileText className="w-6 h-6 text-accent-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-[#E6EAF0]">
                        {document.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-neutral-600 dark:text-[#9CA3AF]">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{document.user?.name || 'Aluno'}</span>
                        </div>
                        {document.course && (
                          <span>• {document.course.name}</span>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(new Date(document.createdAt), "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {document.description && (
                    <p className="text-sm text-neutral-600 dark:text-[#9CA3AF] mb-3">
                      {document.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-accent-purple/10 dark:bg-accent-purple/20 text-accent-purple rounded text-xs font-medium">
                      {categoryLabels[document.category] || document.category}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-[#6B7280]">
                      {document.fileName}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(document)}
                  className="ml-4 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-[#4AB0E8] transition-all duration-250 flex items-center gap-2 shadow-soft-dark"
                >
                  <Download className="w-4 h-4" />
                  Baixar
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

