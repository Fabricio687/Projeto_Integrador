import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        relative
        inline-flex
        items-center
        justify-center
        w-10
        h-10
        rounded-lg
        bg-neutral-100
        dark:bg-[rgba(255,255,255,0.05)]
        text-neutral-700
        dark:text-[#E6EAF0]
        border
        border-neutral-300
        dark:border-[rgba(255,255,255,0.1)]
        hover:bg-neutral-200
        dark:hover:bg-[rgba(255,255,255,0.1)]
        hover:border-accent-blue
        dark:hover:border-accent-blue
        transition-all
        duration-250
        ease-in-out
        focus:outline-none
        focus:ring-2
        focus:ring-accent-blue
        focus:ring-offset-2
        shadow-soft
        dark:shadow-soft-dark
      "
      aria-label="Alternar tema"
      title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`
            absolute
            w-5
            h-5
            transition-all
            duration-250
            ease-in-out
            ${theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}
          `}
        />
        <Moon
          className={`
            absolute
            w-5
            h-5
            transition-all
            duration-250
            ease-in-out
            ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
          `}
        />
      </div>
    </button>
  );
}

