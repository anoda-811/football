"use client";

import { useMemo, useState } from "react";
import {
  PRESET_CATEGORIES,
  searchTeamPresets,
  type TeamPresetCategory,
} from "@/lib/teamPresets";

type TeamPresetPickerProps = {
  side: "left" | "right";
  onSelect: (presetId: string) => void;
};

export function TeamPresetPicker({ side, onSelect }: TeamPresetPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<TeamPresetCategory>("national");

  const results = useMemo(
    () => searchTeamPresets(query, category),
    [query, category],
  );

  const alignClass = side === "right" ? "text-right" : "text-left";

  function handleSelect(presetId: string) {
    onSelect(presetId);
    setOpen(false);
    setQuery("");
  }

  return (
    <div className={`relative w-full ${alignClass}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`w-full rounded border border-dashed border-gray-300 bg-gray-50 px-2 py-1 text-[10px] font-semibold text-gray-600 transition-colors hover:border-green-400 hover:bg-green-50/50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-green-600 dark:hover:bg-green-950/30 sm:text-xs ${side === "right" ? "text-right" : "text-left"}`}
      >
        メンバー選択
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="メンバー選択を閉じる"
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div
            className={`absolute top-full z-50 mt-1 w-[11.5rem] rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900 sm:w-52 ${
              side === "right" ? "right-0" : "left-0"
            }`}
          >
            <div className="flex gap-1">
              {PRESET_CATEGORIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id)}
                  className={`flex-1 rounded px-1.5 py-0.5 text-[10px] font-semibold transition-colors ${
                    category === item.id
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={category === "club" ? "バルサ、メッシ…" : "日本、スペイン…"}
              className="mt-1.5 w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-800 outline-none focus:border-green-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              autoFocus
            />
            <ul className="mt-1.5 max-h-44 overflow-y-auto">
              {results.length === 0 ? (
                <li className="px-1 py-2 text-center text-[10px] text-gray-400">
                  見つかりません
                </li>
              ) : (
                results.map((preset) => (
                  <li key={preset.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(preset.id)}
                      className="flex w-full flex-col rounded-md px-2 py-1.5 text-left transition-colors hover:bg-green-50 dark:hover:bg-green-950/40"
                    >
                      <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                        {preset.displayName}
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        {preset.note} · {preset.formation}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
