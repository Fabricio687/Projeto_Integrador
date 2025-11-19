import { useState, useEffect } from 'react';
import coursesService from '../../services/courses.service';
import Loading from './Loading';

/**
 * Componente responsivo para seleção de cursos
 * @param {Object} props
 * @param {string} props.value - ID do curso selecionado
 * @param {function} props.onChange - Função chamada quando um curso é selecionado
 * @param {string} props.className - Classes adicionais para o componente
 * @param {boolean} props.required - Se o campo é obrigatório
 * @param {string} props.placeholder - Texto placeholder para o select
 */
const CourseSelector = ({
  value,
  onChange,
  className = '',
  required = false,
  placeholder = 'Selecione um curso',
  disabled = false
}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await coursesService.getAll();
        setCourses(res.data?.data || []);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar cursos:', err);
        setError('Não foi possível carregar a lista de cursos');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full rounded-md border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] bg-neutral-50 dark:bg-[rgba(255,255,255,0.05)] px-3 py-2 text-sm text-neutral-500 dark:text-[#9CA3AF] flex items-center">
          <div className="mr-2 h-4 w-4">
            <Loading size="sm" />
          </div>
          Carregando cursos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full rounded-md border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/20 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <select
        value={value || ''}
        onChange={onChange}
        className="w-full rounded-md border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[rgba(30,38,54,0.6)] px-3 py-2 text-sm text-neutral-900 dark:text-[#E6EAF0] outline-none focus:border-blue-500 dark:focus:border-accent-blue focus:ring focus:ring-blue-100 dark:focus:ring-accent-blue/20 transition-all duration-200"
        required={required}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {courses.map((course) => (
          <option key={course._id} value={course._id}>
            {course.code} - {course.name}
          </option>
        ))}
      </select>
      
      {/* Indicador de seta personalizado para melhor UX */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500 dark:text-[#9CA3AF]">
        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
};

export default CourseSelector;