// src/components/exams/ExamsList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import examsService from '../../services/exams.service';
import ExamCard from './ExamCard';
import Loading from '../ui/Loading';

export default function ExamsList({ courseId, canManage = false }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setErr(null);
    try {
      const response = await examsService.listByCourse(courseId);
      // Backend retorna { success, data, count }
      const exams = response.data?.data || response.data?.exams || [];
      setItems(exams);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Falha ao carregar provas');
      console.error('Erro ao carregar provas:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchData();
  }, [courseId]);

  if (!courseId) return <div className="text-sm text-neutral-600 dark:text-[#9CA3AF]">Selecione um curso para ver as provas.</div>;
  if (loading) return <Loading text="Carregando provas..." />;
  if (err) return <div className="text-sm text-red-600 dark:text-red-400">{err}</div>;
  if (!items.length) return <div className="text-sm text-neutral-600 dark:text-[#9CA3AF]">Nenhuma prova encontrada.</div>;

  const handleEdit = (exam) => {
    navigate('/exams/new', { state: { exam, courseId } });
  };

  const handleDelete = async (exam) => {
    if (!confirm(`Tem certeza que deseja excluir a prova "${exam.title}"?`)) return;
    try {
      await examsService.remove(exam._id);
      fetchData(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao deletar prova:', error);
      alert('Erro ao deletar prova');
    }
  };

  return (
    <div className="space-y-3">
      {items.map((exam) => (
        <ExamCard
          key={exam._id}
          exam={exam}
          canManage={canManage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
