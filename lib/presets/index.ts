import { ARSENAL_PRESET } from "./club/arsenal";
import { BARCELONA_MSN_PRESET } from "./club/barcelona-msn";
import { WC2026_PRESETS } from "./national/wc2026";
import type { TeamPreset, TeamPresetCategory, TeamPresetCategoryInfo } from "./types";

export type { TeamPreset, TeamPresetCategory, TeamPresetCategoryInfo } from "./types";

export const PRESET_CATEGORIES: TeamPresetCategoryInfo[] = [
  { id: "national", label: "ナショナル" },
  { id: "club", label: "クラブ" },
];

export const TEAM_PRESETS: TeamPreset[] = [
  ...WC2026_PRESETS,
  ARSENAL_PRESET,
  BARCELONA_MSN_PRESET,
];

export function getTeamPreset(id: string): TeamPreset | undefined {
  return TEAM_PRESETS.find((preset) => preset.id === id);
}

export function searchTeamPresets(
  query: string,
  category?: TeamPresetCategory,
): TeamPreset[] {
  const q = query.trim().toLowerCase();
  let list = category
    ? TEAM_PRESETS.filter((preset) => preset.category === category)
    : TEAM_PRESETS;

  if (!q) return list;

  return list.filter(
    (preset) =>
      preset.displayName.toLowerCase().includes(q) ||
      preset.keywords.some((keyword) => keyword.toLowerCase().includes(q)),
  );
}
