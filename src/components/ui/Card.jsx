// src/components/ui/Card.jsx
export default function Card({ className = '', children, hover = false }) {
  const hoverClasses = hover 
    ? 'hover:scale-[1.02] hover:shadow-soft-dark transition-all duration-250 ease-in-out-cubic' 
    : '';
  
  return (
    <div 
      className={`
        rounded-xl 
        border 
        bg-white dark:bg-[rgba(30,38,54,0.8)]
        border-neutral-200 dark:border-[rgba(255,255,255,0.1)]
        p-4 
        shadow-soft
        dark:shadow-soft-dark
        ${hoverClasses}
        ${className}
      `}
      style={{
        backdropFilter: 'blur(10px)',
      }}
    >
      {children}
    </div>
  );
}
  