import type { FormationId, PlayerInfo } from "@/lib/formations";
import type { SquadPool, TeamPreset, TeamPresetCategory } from "./types";

export function p(number: number, name: string): PlayerInfo {
  return { number, name };
}

/** "背番号|名前" 形式 */
export function parsePlayer(entry: string): PlayerInfo {
  const [number, ...rest] = entry.split("|");
  return { number: Number(number), name: rest.join("|") };
}

export function poolFromEntries(entries: {
  gk: string[];
  df: string[];
  mf: string[];
  fw: string[];
}): SquadPool {
  return {
    gk: entries.gk.map(parsePlayer),
    df: entries.df.map(parsePlayer),
    mf: entries.mf.map(parsePlayer),
    fw: entries.fw.map(parsePlayer),
  };
}

export function lineupFromPool(pool: SquadPool): {
  starters: PlayerInfo[];
  subs: PlayerInfo[];
} {
  const starters = [
    pool.gk[0],
    ...pool.df.slice(0, 4),
    ...pool.mf.slice(0, 3),
    ...pool.fw.slice(0, 3),
  ].filter(Boolean);

  const subCandidates = [
    pool.gk[1],
    pool.gk[2],
    ...pool.df.slice(4),
    ...pool.mf.slice(3),
    ...pool.fw.slice(3),
  ].filter(Boolean);

  const subs: PlayerInfo[] = [];
  for (const player of subCandidates) {
    if (subs.length >= 7) break;
    if (!subs.some((item) => item.name === player.name)) {
      subs.push(player);
    }
  }

  while (subs.length < 7) {
    subs.push(p(12 + subs.length, `SUB${subs.length + 1}`));
  }

  return { starters, subs };
}

export function createPreset(
  id: string,
  category: TeamPresetCategory,
  displayName: string,
  keywords: string[],
  note: string,
  pool: SquadPool,
  formation: FormationId = "4-3-3",
): TeamPreset {
  const { starters, subs } = lineupFromPool(pool);
  return {
    id,
    category,
    displayName,
    keywords,
    formation,
    note,
    starters,
    subs,
  };
}
