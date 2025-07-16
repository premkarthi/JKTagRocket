'use client';

import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setDark(true);
    }
  }, []);

  const toggleMode = () => {
    const isDark = !dark;
    setDark(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleMode}
      aria-label="Toggle Dark Mode"
      style={{
        fontSize: '1.25rem',
        padding: '4px 8px',
        cursor: 'pointer',
        border: '1px solid #ccc',
        borderRadius: '6px',
        background: dark ? '#111' : '#fff',
        color: dark ? '#fff' : '#000',
        transition: 'all 0.3s ease',
      }}
    >
      {dark ? '🌞 Light' : '🌙 Dark'}
    </button>
  );
}
