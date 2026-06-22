"use client";

import { useTheme } from "@/components/ThemeProvider";

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
          ダークモード
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          画面の明るさを切り替えます
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="ダークモード"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          isDark ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs shadow transition-transform ${
            isDark ? "translate-x-5" : "translate-x-0"
          }`}
        >
          {isDark ? "🌙" : "☀️"}
        </span>
      </button>
    </div>
  );
}
