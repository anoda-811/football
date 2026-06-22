import type { FormationId, TeamState } from "@/lib/formations";
import { buildTeam } from "@/lib/formations";
import type { PlayerInfo } from "@/lib/formations";
import {
  getTeamPreset,
  searchTeamPresets,
  PRESET_CATEGORIES,
  TEAM_PRESETS,
  type TeamPreset,
  type TeamPresetCategory,
  type TeamPresetCategoryInfo,
} from "@/lib/presets";

export type { TeamPreset, TeamPresetCategory, TeamPresetCategoryInfo };
export { getTeamPreset, searchTeamPresets, PRESET_CATEGORIES, TEAM_PRESETS };

export function applyPlayersToTeam(
  team: TeamState,
  starters: PlayerInfo[],
  subs: PlayerInfo[],
): TeamState {
  return {
    pitch: team.pitch.map((slot, index) => ({
      ...slot,
      player: starters[index] ?? slot.player,
    })),
    bench: team.bench.map((slot, index) => ({
      ...slot,
      player: subs[index] ?? slot.player,
    })),
  };
}

export function buildTeamFromPreset(
  prefix: string,
  side: "away" | "home",
  preset: TeamPreset,
): TeamState {
  const base = buildTeam(
    prefix,
    side,
    preset.formation as FormationId,
    preset.benchSize,
  );
  return applyPlayersToTeam(base, preset.starters, preset.subs);
}
