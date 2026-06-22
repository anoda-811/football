import {
  createDefaultBoardState,
  formatMatchTitle,
  type BoardState,
} from "@/lib/boardState";

const STORAGE_KEY = "football-tactics-matches";

export type SavedMatch = {
  id: string;
  title: string;
  updatedAt: number;
  data: BoardState;
};

export type MatchSummary = {
  id: string;
  title: string;
  updatedAt: number;
  awayName: string;
  homeName: string;
  awayScore: number;
  homeScore: number;
};

function readAll(): SavedMatch[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedMatch[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(matches: SavedMatch[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
}

export function listMatches(): MatchSummary[] {
  return readAll()
    .map((match) => ({
      id: match.id,
      title: match.title,
      updatedAt: match.updatedAt,
      awayName: match.data.awayName,
      homeName: match.data.homeName,
      awayScore: match.data.awayScore,
      homeScore: match.data.homeScore,
    }))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getMatch(id: string): SavedMatch | null {
  return readAll().find((match) => match.id === id) ?? null;
}

export function createMatch(title?: string): SavedMatch {
  const data = createDefaultBoardState();
  const match: SavedMatch = {
    id: crypto.randomUUID(),
    title: title?.trim() || formatMatchTitle(data),
    updatedAt: Date.now(),
    data,
  };
  const matches = readAll();
  matches.push(match);
  writeAll(matches);
  return match;
}

export function saveMatch(match: SavedMatch) {
  const matches = readAll();
  const index = matches.findIndex((item) => item.id === match.id);
  const next: SavedMatch = { ...match, updatedAt: Date.now() };
  if (index === -1) {
    matches.push(next);
  } else {
    matches[index] = next;
  }
  writeAll(matches);
}

export function deleteMatch(id: string) {
  writeAll(readAll().filter((match) => match.id !== id));
}

export function formatUpdatedAt(timestamp: number): string {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}
