// src/components/dashboard/StatsCard.jsx
import Card from '../ui/Card';

export default function StatsCard({ title, value, hint, accent = 'blue' }) {
  const accents = {
    blue: 'from-blue-600 to-indigo-600',
    green: 'from-emerald-600 to-green-600',
    orange: 'from-orange-500 to-amber-600',
    violet: 'from-violet-600 to-fuchsia-600',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${accents[accent]} opacity-20`} />
      <div className="relative">
        <div className="text-sm text-neutral-500">{title}</div>
        <div className="mt-1 text-2xl font-semibold text-neutral-900">{value}</div>
        {hint && <div className="mt-1 text-xs text-neutral-500">{hint}</div>}
      </div>
    </Card>
  );
}
