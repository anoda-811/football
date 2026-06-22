"use client";

type ScoreboardProps = {
  awayName: string;
  homeName: string;
  awayScore: number;
  homeScore: number;
  awayColor: string;
  homeColor: string;
  elapsed: number;
  isRunning: boolean;
  onAwayNameChange: (name: string) => void;
  onHomeNameChange: (name: string) => void;
  onAwayScoreChange: (score: number) => void;
  onHomeScoreChange: (score: number) => void;
  onToggleRunning: () => void;
  onReset: () => void;
};

function formatMatchTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes >= 90) {
    const extra = minutes - 90;
    return extra > 0
      ? `90+${extra}:${seconds.toString().padStart(2, "0")}`
      : `90:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function clampScore(value: number): number {
  return Math.min(99, Math.max(0, value));
}

const TEAM_NAME_ZONE =
  "flex min-w-0 flex-1 items-center justify-center";

export function Scoreboard({
  awayName,
  homeName,
  awayScore,
  homeScore,
  awayColor,
  homeColor,
  elapsed,
  isRunning,
  onAwayNameChange,
  onHomeNameChange,
  onAwayScoreChange,
  onHomeScoreChange,
  onToggleRunning,
  onReset,
}: ScoreboardProps) {
  return (
    <div className="w-full shrink-0">
      <div className="rounded-lg bg-gray-900 px-2 py-2 shadow-md sm:px-3 sm:py-2">
        <div className="flex items-center justify-center gap-0.5 sm:gap-1">
          <div className={TEAM_NAME_ZONE}>
            <input
              type="text"
              value={awayName}
              onChange={(e) => onAwayNameChange(e.target.value)}
              className="w-full min-w-0 truncate bg-transparent px-0.5 text-center text-xs font-bold text-white outline-none sm:text-sm"
              placeholder="左"
              aria-label="左サイドのチーム名"
            />
          </div>
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full sm:h-3 sm:w-3"
            style={{ backgroundColor: awayColor }}
          />

          <div className="flex shrink-0 items-center gap-0.5 font-mono text-base font-bold text-white sm:gap-1 sm:text-lg">
            <input
              type="number"
              min={0}
              max={99}
              value={awayScore}
              onChange={(e) =>
                onAwayScoreChange(clampScore(parseInt(e.target.value, 10) || 0))
              }
              className="w-7 bg-transparent text-center outline-none sm:w-8 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              aria-label="左サイドのスコア"
            />
            <span className="text-white/40">-</span>
            <input
              type="number"
              min={0}
              max={99}
              value={homeScore}
              onChange={(e) =>
                onHomeScoreChange(clampScore(parseInt(e.target.value, 10) || 0))
              }
              className="w-7 bg-transparent text-center outline-none sm:w-8 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              aria-label="右サイドのスコア"
            />
          </div>

          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full sm:h-3 sm:w-3"
            style={{ backgroundColor: homeColor }}
          />
          <div className={TEAM_NAME_ZONE}>
            <input
              type="text"
              value={homeName}
              onChange={(e) => onHomeNameChange(e.target.value)}
              className="w-full min-w-0 truncate bg-transparent px-0.5 text-center text-xs font-bold text-white outline-none sm:text-sm"
              placeholder="右"
              aria-label="右サイドのチーム名"
            />
          </div>
        </div>

        <div className="mt-1.5 flex items-center justify-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleRunning}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 sm:h-8 sm:w-8"
              aria-label={isRunning ? "タイムを停止" : "タイムを開始"}
              title={isRunning ? "停止" : "開始"}
            >
              {isRunning ? (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 sm:h-8 sm:w-8"
              aria-label="タイムをリセット"
              title="リセット"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {isRunning && (
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          )}

          <span className="font-mono text-lg font-bold tracking-wider text-white sm:text-xl">
            {formatMatchTime(elapsed)}
          </span>
        </div>
      </div>
    </div>
  );
}
