import {
  defaultAwayTeam,
  defaultHomeTeam,
  type FormationId,
  type TeamState,
} from "@/lib/formations";
import {
  DEFAULT_AWAY_COLOR,
  DEFAULT_HOME_COLOR,
} from "@/lib/teamColors";
import type { DrawStroke } from "@/components/DrawingToolbar";

export type BoardState = {
  awayTeam: TeamState;
  homeTeam: TeamState;
  awayFormation: FormationId;
  homeFormation: FormationId;
  awayColor: string;
  homeColor: string;
  awayName: string;
  homeName: string;
  awayScore: number;
  homeScore: number;
  elapsed: number;
  isRunning: boolean;
  ballPosition: { x: number; y: number };
  drawStrokes: DrawStroke[];
  awayMemo: string;
  homeMemo: string;
};

export function createDefaultBoardState(): BoardState {
  return {
    awayTeam: defaultAwayTeam,
    homeTeam: defaultHomeTeam,
    awayFormation: "4-3-3",
    homeFormation: "4-3-3",
    awayColor: DEFAULT_AWAY_COLOR,
    homeColor: DEFAULT_HOME_COLOR,
    awayName: "左",
    homeName: "右",
    awayScore: 0,
    homeScore: 0,
    elapsed: 0,
    isRunning: false,
    ballPosition: { x: 50, y: 50 },
    drawStrokes: [],
    awayMemo: "",
    homeMemo: "",
  };
}

export function formatMatchTitle(state: BoardState): string {
  const left = state.awayName.trim() || "左";
  const right = state.homeName.trim() || "右";
  return `${left} vs ${right}`;
}

export function normalizeBoardState(partial: Partial<BoardState>): BoardState {
  const defaults = createDefaultBoardState();
  return {
    ...defaults,
    ...partial,
    awayMemo: partial.awayMemo ?? defaults.awayMemo,
    homeMemo: partial.homeMemo ?? defaults.homeMemo,
    isRunning: false,
  };
}
