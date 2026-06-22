"use client";

import { FORMATION_OPTIONS, type FormationId } from "@/lib/formations";
import { TEAM_COLOR_OPTIONS } from "@/lib/teamColors";
import { TeamPresetPicker } from "./TeamPresetPicker";

type TeamSettingsProps = {
  label: string;
  side: "left" | "right";
  teamName: string;
  teamColor: string;
  formation: FormationId;
  onTeamNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
  onFormationChange: (id: FormationId) => void;
  onPresetSelect?: (presetId: string) => void;
};

export function TeamSettings({
  label,
  side,
  teamName,
  teamColor,
  formation,
  onTeamNameChange,
  onColorChange,
  onFormationChange,
  onPresetSelect,
}: TeamSettingsProps) {
  const alignClass =
    side === "right"
      ? "items-end pr-2 text-right sm:pr-3"
      : "items-start text-left";

  return (
    <div
      className={`flex w-[7.5rem] shrink-0 flex-col gap-1.5 sm:w-32 ${alignClass}`}
    >
      <span
        className="w-full text-xs font-bold leading-tight sm:text-sm"
        style={{ color: teamColor }}
      >
        {label}
      </span>

      <input
        type="text"
        value={teamName}
        onChange={(e) => onTeamNameChange(e.target.value)}
        className={`w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-800 outline-none focus:border-green-600 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 sm:text-sm ${side === "right" ? "text-right" : ""}`}
        placeholder="チーム名"
      />

      <select
        value={formation}
        onChange={(e) => onFormationChange(e.target.value as FormationId)}
        className={`w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-800 outline-none focus:border-green-600 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 sm:text-sm ${side === "right" ? "text-right" : ""}`}
      >
        {FORMATION_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>

      {onPresetSelect && (
        <TeamPresetPicker side={side} onSelect={onPresetSelect} />
      )}

      <div
        className={`grid grid-cols-6 gap-1.5 ${side === "right" ? "ml-auto w-fit" : "w-full"}`}
      >
        {TEAM_COLOR_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            title={opt.label}
            onClick={() => onColorChange(opt.hex)}
            className={`h-6 w-6 rounded-full border transition-transform hover:scale-110 sm:h-7 sm:w-7 ${teamColor === opt.hex ? "border-gray-800 ring-1 ring-gray-400 dark:border-gray-200" : "border-gray-300 dark:border-gray-600"}`}
            style={{ backgroundColor: opt.hex }}
            aria-label={`${opt.label}ユニフォーム`}
          />
        ))}
      </div>
    </div>
  );
}
