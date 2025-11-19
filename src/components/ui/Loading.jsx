// src/components/ui/Loading.jsx
export default function Loading({ text = 'Carregando...' }) {
    return (
      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-[#9CA3AF]">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-blue-600 dark:bg-accent-blue"></span>
        {text}
      </div>
    );
  }
  