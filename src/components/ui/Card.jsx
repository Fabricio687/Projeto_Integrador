// src/components/ui/Card.jsx
export default function Card({ className = '', children }) {
    return (
      <div className={`rounded-xl border border-neutral-200 bg-white p-4 shadow-sm ${className}`}>
        {children}
      </div>
    );
  }
  