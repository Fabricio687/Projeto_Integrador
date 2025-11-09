// src/components/grades/GradeChart.jsx
// Gráfico simples via inline SVG para não depender de libs
export default function GradeChart({ grades = [] }) {
    if (!grades.length) return null;
  
    const values = grades.map((g) => Number(g.value) || 0);
    const max = Math.max(10, ...values);
    const w = 320;
    const h = 120;
    const stepX = w / Math.max(1, values.length - 1);
    const points = values
      .map((v, i) => {
        const x = i * stepX;
        const y = h - (v / max) * h;
        return `${x},${y}`;
      })
      .join(' ');
  
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="mb-2 text-sm font-medium text-neutral-900">Evolução das notas</div>
        <svg width={w} height={h} className="text-blue-600">
          <polyline fill="none" stroke="currentColor" strokeWidth="2" points={points} />
        </svg>
      </div>
    );
  }
  