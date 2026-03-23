"use client";

import { cn } from '@/utils/cn';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useTheme } from "next-themes";
import { SunIcon } from './icons/sun';
import { MoonIcon } from './icons/moon';

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();

  // Only compute theme after mount
  const effectiveTheme =
    mounted && theme === "system" && resolvedTheme
      ? resolvedTheme
      : mounted
        ? theme
        : null;

  const nextTheme = effectiveTheme === "dark" ? "light" : "dark";

  const label = effectiveTheme ? `Switch to ${nextTheme} mode` : "Toggle theme";

  const toggleTheme = () => {
    if (!mounted || !nextTheme) return;
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={effectiveTheme === "dark"}
      disabled={!mounted}
      onClick={toggleTheme}
      className={cn(
        "shrink-0 flex items-center justify-center p-3 rounded-full border border-solid transition-colors",
        "border-black/8 dark:border-white/14",
        mounted
          ? "cursor-pointer hover:border-transparent hover:bg-black/4 dark:hover:bg-[#1a1a1a]"
          : "cursor-default pointer-events-none",
      )}
    >
      <SunIcon />
      <MoonIcon />
    </button>
  );
}