import type { TeamPresetCategory } from "./types";

/** 新規試合のデフォルト（プリセット未適用） */
export const DEFAULT_BENCH_SIZE = 9;

/** W杯などナショナル: 26人登録 → スタメン11 + ベンチ15 */
export const NATIONAL_BENCH_SIZE = 15;

/** クラブ戦想定: スタメン11 + ベンチ9 */
export const CLUB_BENCH_SIZE = 9;

export const NATIONAL_SQUAD_SIZE = 11 + NATIONAL_BENCH_SIZE;
export const CLUB_SQUAD_SIZE = 11 + CLUB_BENCH_SIZE;

export function getBenchSizeForCategory(category: TeamPresetCategory): number {
  return category === "national" ? NATIONAL_BENCH_SIZE : CLUB_BENCH_SIZE;
}
