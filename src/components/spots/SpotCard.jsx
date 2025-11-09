// src/components/spots/SpotCard.jsx
import Card from '../ui/Card';

export default function SpotCard({ spot, onReserve, onCancel, canManage, onEdit, onDelete }) {
  const available = spot?.available !== false; // assume true se não vier
  return (
    <Card className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-neutral-900">{spot?.name || 'Vaga'}</div>
        {spot?.description && <div className="mt-1 text-sm text-neutral-700">{spot.description}</div>}
        <div className="mt-1 text-xs text-neutral-500">
          Status: {available ? 'Disponível' : 'Indisponível'}
        </div>
      </div>

      <div className="flex gap-2">
        {onReserve && available && (
          <button
            onClick={() => onReserve(spot)}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            Reservar
          </button>
        )}
        {onCancel && (
          <button
            onClick={() => onCancel(spot)}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            Cancelar
          </button>
        )}
        {canManage && (
          <>
            <button
              onClick={() => onEdit?.(spot)}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete?.(spot)}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
            >
              Excluir
            </button>
          </>
        )}
      </div>
    </Card>
  );
}
