// src/components/dashboard/EventItem.jsx
const EventItem = ({ type, title, date, onClick }) => {
    const borderColor = type === 'Aula' ? 'border-blue-500' : 'border-orange-500';
    const badgeBg = type === 'Aula' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700';
  
    return (
      <div
        onClick={onClick}
        className={`group flex items-center justify-between p-4 bg-white border-l-4 ${borderColor} rounded-lg border border-neutral-200/60 shadow-sm transition-all duration-200 hover:bg-neutral-50 hover:shadow-md cursor-pointer`}
      >
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-neutral-900 mb-1 group-hover:text-blue-700 transition-colors">
            {title}
          </h4>
          <p className="text-xs text-neutral-500">{date}</p>
        </div>
        
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${badgeBg}`}>
          {type}
        </span>
      </div>
    );
  };
  
  export default EventItem;
  