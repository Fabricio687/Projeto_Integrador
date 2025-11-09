// src/components/exams/ExamCard.jsx
import Card from '../ui/Card';
import { formatDate, formatTime } from '../../utils/formatters';

export default function ExamCard({ exam, canManage, onEdit, onDelete }) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-neutral-900">{exam?.title}</div>
        <div className="text-xs text-neutral-500">
          {formatDate(exam?.date)} • {formatTime(exam?.date)} • Peso {exam?.weight ?? '-'} • Máx {exam?.maxGrade ?? '-'}
        </div>
        {exam?.description && (
          <div className="mt-1 text-sm text-neutral-700">{exam.description}</div>
        )}
      </div>
      {canManage && (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(exam)}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete?.(exam)}
            className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      )}
    </Card>
  );
}
