// src/components/ui/Input.jsx
export default function Input({ label, error, className = '', ...props }) {
    return (
      <label className="block">
        {label && <span className="mb-1 block text-sm text-neutral-700 dark:text-[#E6EAF0]">{label}</span>}
        <input
          className={`
            w-full 
            rounded-lg 
            border 
            border-neutral-300 
            dark:border-[rgba(255,255,255,0.1)]
            bg-white 
            dark:bg-[rgba(30,38,54,0.6)]
            px-4 
            py-2 
            text-sm 
            text-neutral-900 
            dark:text-[#E6EAF0]
            outline-none 
            ring-0 
            transition-all 
            duration-250
            placeholder:text-neutral-400 
            dark:placeholder:text-[#9CA3AF]
            focus:border-accent-blue 
            focus:ring-2 
            focus:ring-accent-blue 
            focus:ring-offset-0
            ${className}
          `}
          {...props}
        />
        {error && <span className="mt-1 block text-xs text-accent-red">{error}</span>}
      </label>
    );
  }
  