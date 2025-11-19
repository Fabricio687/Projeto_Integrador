// src/components/lessons/LessonCard.jsx
import Card from '../ui/Card';
import { formatDate, formatTime } from '../../utils/formatters';

export default function LessonCard({ lesson, canManage, onEdit, onDelete }) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-neutral-900 dark:text-[#E6EAF0]">{lesson?.title}</div>
        <div className="text-xs text-neutral-500 dark:text-[#9CA3AF]">
          {formatDate(lesson?.date)} • {formatTime(lesson?.date)}
        </div>
        {lesson?.description && (
          <div className="mt-1 text-sm text-neutral-700 dark:text-[#D1D5DB]">{lesson.description}</div>
        )}
      </div>
      {canManage && (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(lesson)}
            className="rounded-md border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[rgba(30,38,54,0.6)] px-3 py-1.5 text-sm text-neutral-700 dark:text-[#E6EAF0] hover:bg-neutral-50 dark:hover:bg-[rgba(255,255,255,0.05)] transition-all duration-250"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete?.(lesson)}
            className="rounded-md bg-red-600 dark:bg-accent-red px-3 py-1.5 text-sm text-white hover:bg-red-700 dark:hover:bg-[#E55A5A] transition-all duration-250"
          >
            Excluir
          </button>
        </div>
      )}
    </Card>
  );
}
