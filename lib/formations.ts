import { DEFAULT_BENCH_SIZE } from "@/lib/presets/squadSizes";

export { DEFAULT_BENCH_SIZE };

export type PlayerInfo = {
  number: number;
  name: string;
};

export type PitchSlot = {
  slotId: string;
  x: number;
  y: number;
  player: PlayerInfo;
};

export type BenchSlot = {
  slotId: string;
  player: PlayerInfo;
};

export type TeamState = {
  pitch: PitchSlot[];
  bench: BenchSlot[];
};

export type FormationId =
  | "4-3-3"
  | "4-4-2"
  | "4-2-3-1"
  | "3-5-2"
  | "3-4-2-1";

export type FormationOption = {
  id: FormationId;
  label: string;
};

export const FORMATION_OPTIONS: FormationOption[] = [
  { id: "4-3-3", label: "4-3-3" },
  { id: "4-4-2", label: "4-4-2" },
  { id: "4-2-3-1", label: "4-2-3-1" },
  { id: "3-5-2", label: "3-5-2" },
  { id: "3-4-2-1", label: "3-4-2-1" },
];

type Position = { x: number; y: number };

// Left-half coordinates (away team). x: 5–45, midfield at 50.
const FORMATION_POSITIONS: Record<FormationId, Position[]> = {
  "4-3-3": [
    { x: 8, y: 50 },
    { x: 20, y: 12 },
    { x: 18, y: 38 },
    { x: 18, y: 62 },
    { x: 20, y: 88 },
    { x: 32, y: 22 },
    { x: 34, y: 50 },
    { x: 32, y: 78 },
    { x: 42, y: 18 },
    { x: 44, y: 50 },
    { x: 42, y: 82 },
  ],
  "4-4-2": [
    { x: 8, y: 50 },
    { x: 20, y: 12 },
    { x: 18, y: 38 },
    { x: 18, y: 62 },
    { x: 20, y: 88 },
    { x: 30, y: 15 },
    { x: 32, y: 38 },
    { x: 32, y: 62 },
    { x: 30, y: 85 },
    { x: 42, y: 38 },
    { x: 42, y: 62 },
  ],
  "4-2-3-1": [
    { x: 8, y: 50 },
    { x: 20, y: 12 },
    { x: 18, y: 38 },
    { x: 18, y: 62 },
    { x: 20, y: 88 },
    { x: 30, y: 38 },
    { x: 30, y: 62 },
    { x: 38, y: 18 },
    { x: 40, y: 50 },
    { x: 38, y: 82 },
    { x: 44, y: 50 },
  ],
  "3-5-2": [
    { x: 8, y: 50 },
    { x: 18, y: 28 },
    { x: 18, y: 50 },
    { x: 18, y: 72 },
    { x: 28, y: 8 },
    { x: 32, y: 35 },
    { x: 30, y: 50 },
    { x: 32, y: 65 },
    { x: 28, y: 92 },
    { x: 42, y: 38 },
    { x: 42, y: 62 },
  ],
  "3-4-2-1": [
    { x: 8, y: 50 },
    { x: 18, y: 28 },
    { x: 18, y: 50 },
    { x: 18, y: 72 },
    { x: 28, y: 12 },
    { x: 32, y: 38 },
    { x: 32, y: 62 },
    { x: 28, y: 88 },
    { x: 40, y: 26 },
    { x: 40, y: 74 },
    { x: 44, y: 50 },
  ],
};

const starterNames = [
  "GK",
  "DF",
  "DF",
  "DF",
  "DF",
  "MF",
  "MF",
  "MF",
  "FW",
  "FW",
  "FW",
];

export function getFormationPositions(
  formationId: FormationId,
  side: "away" | "home",
): Position[] {
  const left = FORMATION_POSITIONS[formationId];
  if (side === "away") return left;
  return left.map((p) => ({ x: 100 - p.x, y: p.y }));
}

export function buildTeam(
  prefix: string,
  side: "away" | "home",
  formationId: FormationId = "4-3-3",
  benchSize: number = DEFAULT_BENCH_SIZE,
): TeamState {
  const positions = getFormationPositions(formationId, side);
  const pitch: PitchSlot[] = positions.map((pos, i) => ({
    slotId: `${prefix}-pitch-${i + 1}`,
    x: pos.x,
    y: pos.y,
    player: { number: i + 1, name: starterNames[i] },
  }));

  const bench: BenchSlot[] = Array.from({ length: benchSize }, (_, i) => ({
    slotId: `${prefix}-bench-${i + 1}`,
    player: { number: 12 + i, name: "SUB" },
  }));

  return { pitch, bench };
}

export const defaultAwayTeam = buildTeam("away", "away");
export const defaultHomeTeam = buildTeam("home", "home");

export function applyFormationToTeam(
  team: TeamState,
  formationId: FormationId,
  side: "away" | "home",
): TeamState {
  const positions = getFormationPositions(formationId, side);
  return {
    ...team,
    pitch: team.pitch.map((slot, i) => ({
      ...slot,
      x: positions[i].x,
      y: positions[i].y,
    })),
  };
}

export function mirrorPitchPosition(x: number, y: number) {
  return { x: 100 - x, y: 100 - y };
}

/** 後半の陣地入れ替え: 攻守方向の反転（左右＋上下） */
export function mirrorTeamPositions(team: TeamState): TeamState {
  return {
    ...team,
    pitch: team.pitch.map((slot) => {
      const pos = mirrorPitchPosition(slot.x, slot.y);
      return { ...slot, ...pos };
    }),
  };
}
