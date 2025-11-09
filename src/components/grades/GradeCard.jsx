// src/components/grades/GradeCard.jsx
import Card from '../ui/Card';
import { formatDate, formatGrade } from '../../utils/formatters';

export default function GradeCard({ grade, canManage, onEdit, onDelete, isDeleting = false }) {
  return (
    <Card className="flex items-center justify-between">
      <div className="flex-1">
        <div className="text-sm font-medium text-neutral-900">
          {grade?.courseName || grade?.course?.name || grade?.title || 'Atividade'}
        </div>
        <div className="text-xs text-neutral-500">
          {formatDate(grade?.date)} • {grade?.type || 'Avaliação'} • Peso {grade?.weight ? (Number(grade.weight) * 100).toFixed(0) + '%' : '-'}
          {grade?.student?.name && (
            <span className="ml-2">• Aluno: {grade.student.name}</span>
          )}
        </div>
        <div className="mt-1 text-sm text-neutral-700">
          Nota: <span className="font-semibold">{formatGrade(grade?.grade || grade?.value)}</span>
          {grade?.maxGrade ? (
            <span className="text-neutral-500"> / {formatGrade(grade.maxGrade)}</span>
          ) : null}
          {grade?.description && (
            <div className="mt-1 text-xs text-neutral-500">{grade.description}</div>
          )}
        </div>
      </div>
      {canManage && (
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit?.(grade)}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            disabled={isDeleting}
          >
            Editar
          </button>
          <button
            onClick={() => onDelete?.(grade)}
            className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 disabled:opacity-50"
            disabled={isDeleting}
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      )}
    </Card>
  );
}
