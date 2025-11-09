// src/components/grades/GradesList.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gradesService from '../../services/grades.service';
import Loading from '../ui/Loading';
import GradeCard from './GradeCard';
import Button from '../ui/Button';
import { Plus } from 'lucide-react';

const weightedAverage = (grades) => {
  let sum = 0;
  let w = 0;
  grades.forEach((g) => {
    const weight = Number(g.weight) || 1;
    // Backend usa 'grade' em vez de 'value'
    const value = Number(g.grade) || Number(g.value) || 0;
    sum += value * weight;
    w += weight;
  });
  return w ? (sum / w) : null;
};

export default function GradesList({ mode = 'mine', studentId, canManage = false }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [avg, setAvg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setErr(null);
    try {
      let response;
      if (mode === 'student' && studentId) {
        response = await gradesService.listByStudent(studentId);
      } else if (mode === 'all' || canManage) {
        // Professores e admins veem todas as notas usando o endpoint /grades
        response = await gradesService.getAll();
      } else {
        // Alunos veem apenas suas notas
        response = await gradesService.listMine();
      }
      
      // Backend agora retorna { success, data, count }
      const grades = response.data?.data || response.data || [];
      setItems(grades);
      // Calcular média apenas para alunos (não faz sentido para todas as notas)
      if (mode === 'mine' || (mode === 'student' && studentId)) {
        setAvg(weightedAverage(grades));
      } else {
        setAvg(null);
      }
    } catch (e) {
      const errorMsg = e?.response?.data?.message || e?.message || 'Falha ao carregar notas';
      setErr(errorMsg);
      console.error('Erro ao carregar notas:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, studentId, canManage]);

  const total = useMemo(() => items.length, [items]);

  const handleEdit = (grade) => {
    navigate('/grades/new', { state: { grade } });
  };

  const handleDelete = async (grade) => {
    if (!confirm(`Tem certeza que deseja excluir a nota de ${grade.student?.name || 'este aluno'}?`)) {
      return;
    }

    try {
      setDeleting(grade._id);
      await gradesService.remove(grade._id);
      // Recarregar lista
      await fetchData();
    } catch (error) {
      console.error('Erro ao deletar nota:', error);
      alert(error?.response?.data?.message || 'Erro ao deletar nota');
    } finally {
      setDeleting(null);
    }
  };

  const handleAdd = () => {
    navigate('/grades/new');
  };

  if (loading) return <Loading text="Carregando notas..." />;
  if (err) return <div className="text-sm text-red-600">{err}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-600">
          Total de atividades: <span className="font-medium text-neutral-800">{total}</span>
          {avg !== null && (
            <span className="ml-3">
              Média ponderada: <span className="font-medium text-neutral-800">{avg.toFixed(1)}</span>
            </span>
          )}
        </div>
        {canManage && (
          <Button onClick={handleAdd} className="text-sm px-3 py-1.5">
            <Plus className="w-4 h-4 mr-2" />
            Nova Nota
          </Button>
        )}
      </div>
      
      {!items.length ? (
        <div className="text-sm text-neutral-600 text-center py-8">
          Nenhuma nota encontrada.
          {canManage && (
            <div className="mt-2">
              <Button onClick={handleAdd} variant="outline" className="text-sm px-3 py-1.5">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar primeira nota
              </Button>
            </div>
          )}
        </div>
      ) : (
        items.map((g) => (
          <GradeCard
            key={g._id}
            grade={g}
            canManage={canManage}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={deleting === g._id}
          />
        ))
      )}
    </div>
  );
}
