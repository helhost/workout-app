import { useTheme } from '@/hooks';

export default function ThemeSwitch() {
  const { theme, changeTheme } = useTheme();
  const isDark = theme == 'dark';

  function toggle() {
    changeTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="ml-6 inline-flex items-center gap-2 rounded-md border border-border px-3 py-1 text-text hover:bg-primary-accent transition-colors cursor-pointer"
    >
      <span aria-hidden>{isDark ? '🌙' : '☀️'}</span>
      <span className="hidden sm:inline">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  )
};
