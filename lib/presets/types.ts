import type { FormationId, PlayerInfo } from "@/lib/formations";

export type TeamPresetCategory = "national" | "club";

export type TeamPresetCategoryInfo = {
  id: TeamPresetCategory;
  label: string;
};

export type TeamPreset = {
  id: string;
  category: TeamPresetCategory;
  displayName: string;
  keywords: string[];
  formation: FormationId;
  note: string;
  starters: PlayerInfo[];
  subs: PlayerInfo[];
};

export type SquadPool = {
  gk: PlayerInfo[];
  df: PlayerInfo[];
  mf: PlayerInfo[];
  fw: PlayerInfo[];
};
