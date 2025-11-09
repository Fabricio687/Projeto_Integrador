// src/components/ui/Loading.jsx
export default function Loading({ text = 'Carregando...' }) {
    return (
      <div className="flex items-center gap-2 text-sm text-neutral-600">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-blue-600"></span>
        {text}
      </div>
    );
  }
  