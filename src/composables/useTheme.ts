import { ref, watchEffect } from 'vue';

export type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
    return 'dark';
  }
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  } catch {
    /* localStorage unavailable */
  }
  return 'light';
}

/**
 * Reads/sets the app color theme. The initial `.dark` class is applied by an
 * inline script in index.html (before paint); this module-scoped state keeps
 * it in sync across every consumer and persists the user's choice.
 */
const theme = ref<Theme>(getInitialTheme());

watchEffect(() => {
  const root = document.documentElement;
  root.classList.toggle('dark', theme.value === 'dark');
  try {
    localStorage.setItem('theme', theme.value);
  } catch {
    /* ignore */
  }
});

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
}

export function useTheme() {
  return { theme, setTheme: (t: Theme) => (theme.value = t), toggleTheme };
}
