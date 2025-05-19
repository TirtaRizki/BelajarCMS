
"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Laptop } from 'lucide-react'; // Laptop for System theme

const THEME_STORAGE_KEY = 'nextadminlite_theme';

type Theme = 'light' | 'dark' | 'system';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('system'); // Default to system

  useEffect(() => {
    // Load theme from localStorage on initial client-side render
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
      applyTheme(storedTheme);
    } else {
      // If no stored theme, apply system and listen for changes
      applyTheme('system');
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Only re-apply if current theme is 'system'
      const currentTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null || 'system';
      if (currentTheme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applyTheme = (selectedTheme: Theme) => {
    document.documentElement.classList.remove('light', 'dark');
    if (selectedTheme === 'light') {
      document.documentElement.classList.add('light');
    } else if (selectedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else { // System theme
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.add('light');
      }
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  };

  return (
    <div className="flex items-center space-x-2 rounded-lg bg-muted p-1 w-fit">
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleThemeChange('light')}
        className="rounded-md px-3 py-1.5"
        aria-pressed={theme === 'light'}
      >
        <Sun className="mr-2 h-4 w-4" />
        Light
      </Button>
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleThemeChange('dark')}
        className="rounded-md px-3 py-1.5"
        aria-pressed={theme === 'dark'}
      >
        <Moon className="mr-2 h-4 w-4" />
        Dark
      </Button>
      <Button
        variant={theme === 'system' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleThemeChange('system')}
        className="rounded-md px-3 py-1.5"
        aria-pressed={theme === 'system'}
      >
        <Laptop className="mr-2 h-4 w-4" />
        System
      </Button>
    </div>
  );
}
