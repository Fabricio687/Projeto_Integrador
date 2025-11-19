// src/components/grades/GradeCard.jsx
import Card from '../ui/Card';
import { formatDate, formatGrade } from '../../utils/formatters';

export default function GradeCard({ grade, canManage, onEdit, onDelete, isDeleting = false }) {
  return (
    <Card className="flex items-center justify-between">
      <div className="flex-1">
        <div className="text-sm font-medium text-neutral-900 dark:text-[#E6EAF0]">
          {grade?.courseName || grade?.course?.name || grade?.title || 'Atividade'}
        </div>
        <div className="text-xs text-neutral-500 dark:text-[#9CA3AF]">
          {formatDate(grade?.date)} • {grade?.type || 'Avaliação'} • Peso {grade?.weight ? (Number(grade.weight) * 100).toFixed(0) + '%' : '-'}
          {grade?.student?.name && (
            <span className="ml-2">• Aluno: {grade.student.name}</span>
          )}
        </div>
        <div className="mt-1 text-sm text-neutral-700 dark:text-[#D1D5DB]">
          Nota: <span className="font-semibold">{formatGrade(grade?.grade || grade?.value)}</span>
          {grade?.maxGrade ? (
            <span className="text-neutral-500 dark:text-[#9CA3AF]"> / {formatGrade(grade.maxGrade)}</span>
          ) : null}
          {grade?.description && (
            <div className="mt-1 text-xs text-neutral-500 dark:text-[#9CA3AF]">{grade.description}</div>
          )}
        </div>
      </div>
      {canManage && (
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit?.(grade)}
            className="rounded-md border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[rgba(30,38,54,0.6)] px-3 py-1.5 text-sm text-neutral-700 dark:text-[#E6EAF0] hover:bg-neutral-50 dark:hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-50 transition-all duration-250"
            disabled={isDeleting}
          >
            Editar
          </button>
          <button
            onClick={() => onDelete?.(grade)}
            className="rounded-md bg-red-600 dark:bg-accent-red px-3 py-1.5 text-sm text-white hover:bg-red-700 dark:hover:bg-[#E55A5A] disabled:opacity-50 transition-all duration-250"
            disabled={isDeleting}
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      )}
    </Card>
  );
}
