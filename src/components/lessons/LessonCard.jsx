// src/components/lessons/LessonCard.jsx
import Card from '../ui/Card';
import { formatDate, formatTime } from '../../utils/formatters';

export default function LessonCard({ lesson, canManage, onEdit, onDelete }) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-neutral-900">{lesson?.title}</div>
        <div className="text-xs text-neutral-500">
          {formatDate(lesson?.date)} • {formatTime(lesson?.date)}
        </div>
        {lesson?.description && (
          <div className="mt-1 text-sm text-neutral-700">{lesson.description}</div>
        )}
      </div>
      {canManage && (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(lesson)}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete?.(lesson)}
            className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      )}
    </Card>
  );
}
