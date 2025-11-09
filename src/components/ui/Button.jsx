// src/components/ui/Button.jsx
export default function Button({ className = '', variant = 'primary', ...props }) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition disabled:cursor-not-allowed disabled:opacity-70';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const variantClasses = variants[variant] || variants.primary;

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    />
  );
}
  