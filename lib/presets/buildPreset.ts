import type { FormationId, PlayerInfo } from "@/lib/formations";
import { getBenchSizeForCategory } from "./squadSizes";
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

function flattenPool(pool: SquadPool): PlayerInfo[] {
  return [...pool.gk, ...pool.df, ...pool.mf, ...pool.fw];
}

function playerKey(player: PlayerInfo): string {
  return `${player.number}:${player.name}`;
}

export function lineupFromPool(
  pool: SquadPool,
  benchSize: number,
): {
  starters: PlayerInfo[];
  subs: PlayerInfo[];
} {
  const starters = [
    pool.gk[0],
    ...pool.df.slice(0, 4),
    ...pool.mf.slice(0, 3),
    ...pool.fw.slice(0, 3),
  ].filter(Boolean);

  const starterKeys = new Set(starters.map(playerKey));
  const subs: PlayerInfo[] = [];

  for (const player of flattenPool(pool)) {
    if (subs.length >= benchSize) break;
    const key = playerKey(player);
    if (starterKeys.has(key)) continue;
    if (subs.some((item) => playerKey(item) === key)) continue;
    subs.push(player);
  }

  while (subs.length < benchSize) {
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
  const benchSize = getBenchSizeForCategory(category);
  const { starters, subs } = lineupFromPool(pool, benchSize);
  return {
    id,
    category,
    displayName,
    keywords,
    formation,
    note,
    benchSize,
    starters,
    subs,
  };
}
