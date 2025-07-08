'use client'

import { Theme } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const allowedAccents = [
  'orange', 'gold', 'bronze', 'brown', 'yellow', 'lime', 'green', 'teal', 'cyan', 'blue', 'indigo', 'purple', 'pink', 'red', 'ruby', 'crimson'
];
const allowedBackgrounds = [
  'sage', 'olive', 'sand', 'tomato', 'gray', 'mauve', 'auto', 'slate'
];
const allowedAppearances = ['light', 'dark'];

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [accent, setAccent] = useState('orange');
  const [background, setBackground] = useState('sage');
  const [appearance, setAppearance] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const updateTheme = () => {
      const a = localStorage.getItem('accent') || 'orange';
      const b = localStorage.getItem('background') || 'sage';
      const ap = localStorage.getItem('appearance') || 'dark';
      setAccent(allowedAccents.includes(a) ? a : 'orange');
      setBackground(allowedBackgrounds.includes(b) ? b : 'sage');
      setAppearance(allowedAppearances.includes(ap) ? (ap as 'light' | 'dark') : 'dark');
    };
    updateTheme();
    window.addEventListener('theme-updated', updateTheme);
    return () => window.removeEventListener('theme-updated', updateTheme);
  }, []);

  // Always set the correct class on <body>
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('theme-light', 'theme-dark');
      document.body.classList.add(appearance === 'light' ? 'theme-light' : 'theme-dark');
    }
  }, [appearance]);

  return (
    <Theme accentColor={accent as any} grayColor={background as any} appearance={appearance} radius="large">
      {children}
    </Theme>
  );
} 