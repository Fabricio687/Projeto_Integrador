// src/components/ui/Button.jsx
export default function Button({ 
  className = '', 
  variant = 'primary', 
  size = 'md',
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-250 ease-in-out disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variants = {
    primary: 'bg-accent-blue text-white hover:bg-[#4AB0E8] hover:shadow-glow-blue focus:ring-accent-blue dark:bg-accent-blue dark:hover:bg-[#4AB0E8] shadow-soft-dark',
    secondary: 'bg-accent-purple text-white hover:bg-[#9249E6] hover:shadow-glow-purple focus:ring-accent-purple dark:bg-accent-purple dark:hover:bg-[#9249E6] shadow-soft-dark',
    outline: 'bg-transparent text-neutral-700 dark:text-[#E6EAF0] border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] hover:bg-neutral-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:border-accent-blue dark:hover:border-accent-blue focus:ring-accent-blue',
    danger: 'bg-accent-red text-white hover:bg-[#E55A5A] focus:ring-accent-red dark:bg-accent-red dark:hover:bg-[#E55A5A] shadow-soft-dark',
    ghost: 'bg-transparent text-neutral-700 dark:text-[#E6EAF0] hover:bg-neutral-100 dark:hover:bg-[rgba(255,255,255,0.05)] focus:ring-accent-blue',
  };

  const variantClasses = variants[variant] || variants.primary;
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <button
      className={`${baseClasses} ${sizeClass} ${variantClasses} ${className}`}
      style={{
        transform: 'scale(1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      {...props}
    />
  );
}
  