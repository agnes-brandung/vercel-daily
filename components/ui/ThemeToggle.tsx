"use client";

import { useHasMounted } from '@/hooks/useHasMounted';
import { useTheme } from "next-themes";
import { IconButton } from '@/ui/IconButton';
import { SunIcon } from './icons/sun';
import { MoonIcon } from './icons/moon';

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();

  // If the theme is system, use the resolved theme
  // Only compute effective theme after mount
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

  // Until mounted is true, the toggle no longer renders those dark:-driven SVGs—only a fixed-size placeholder span—then renders both icons after mount. Server and first client render now agree on that subtree; disabled={!mounted} still avoids acting before hydration.
  return (
    <IconButton
      title={label}
      aria-label={label}
      aria-pressed={effectiveTheme === "dark"}
      onClick={toggleTheme}
    >
      {mounted ? (
        <>
          <SunIcon />
          <MoonIcon />
        </>
      ) : (
        <span className="inline-block size-6 shrink-0" aria-hidden />
      )}
    </IconButton>
  );
}
