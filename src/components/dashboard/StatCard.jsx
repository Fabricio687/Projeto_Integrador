// src/components/dashboard/StatCard.jsx
const StatCard = ({ title, value, subtitle, iconColor = 'bg-blue-100', Icon }) => {
    return (
      <div className="group relative bg-white rounded-xl border border-neutral-200 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
        {/* Ícone decorativo no topo */}
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${iconColor} mb-4`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        
        {/* Valor principal */}
        <div className="text-3xl font-bold text-neutral-900 mb-1">{value}</div>
        
        {/* Título */}
        <div className="text-sm font-medium text-neutral-700 mb-1">{title}</div>
        
        {/* Subtitle/hint */}
        <div className="text-xs text-neutral-500">{subtitle}</div>
      </div>
    );
  };
  
  export default StatCard;
  