// src/components/lessons/LessonSchedule.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import lessonsService from '../../services/lessons.service';
import Loading from '../ui/Loading';
import LessonCard from './LessonCard';

export default function LessonSchedule({ courseId, canManage = false }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setErr(null);
    try {
      const response = await lessonsService.listByCourse(courseId);
      // Backend retorna { success, data, count }
      const lessons = response.data?.data || response.data?.lessons || [];
      setItems(lessons);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Falha ao carregar aulas');
      console.error('Erro ao carregar aulas:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchData();
  }, [courseId]);

  if (!courseId) {
    return <div className="text-sm text-neutral-600 dark:text-[#9CA3AF]">Selecione um curso para ver as aulas.</div>;
  }

  if (loading) return <Loading text="Carregando aulas..." />;
  if (err) return <div className="text-sm text-red-600 dark:text-red-400">{err}</div>;
  if (!items.length) return <div className="text-sm text-neutral-600 dark:text-[#9CA3AF]">Nenhuma aula encontrada.</div>;

  const handleEdit = (lesson) => {
    navigate('/lessons/new', { state: { lesson, courseId } });
  };

  const handleDelete = async (lesson) => {
    if (!confirm(`Tem certeza que deseja excluir a aula "${lesson.title}"?`)) return;
    try {
      await lessonsService.remove(lesson._id);
      fetchData(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao deletar aula:', error);
      alert('Erro ao deletar aula');
    }
  };

  return (
    <div className="space-y-3">
      {items.map((lesson) => (
        <LessonCard
          key={lesson._id}
          lesson={lesson}
          canManage={canManage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
