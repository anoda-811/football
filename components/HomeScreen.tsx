"use client";

import { DarkModeToggle } from "@/components/DarkModeToggle";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  createMatch,
  deleteMatch,
  formatUpdatedAt,
  listMatches,
  type MatchSummary,
} from "@/lib/matchStorage";

export function HomeScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMatches(listMatches());
    setReady(true);
  }, []);

  function refresh() {
    setMatches(listMatches());
  }

  function handleCreate() {
    const match = createMatch();
    router.push(`/board?id=${match.id}`);
  }

  function handleOpen(id: string) {
    router.push(`/board?id=${id}`);
  }

  function handleDelete(id: string, title: string) {
    if (!window.confirm(`「${title}」を削除しますか？`)) return;
    deleteMatch(id);
    refresh();
  }

  return (
    <div className="flex h-dvh flex-col bg-white dark:bg-gray-950">
      <main className="mx-auto flex h-full w-full max-w-lg flex-col px-6 py-10 sm:py-14">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-3xl shadow-md sm:h-20 sm:w-20 sm:text-4xl">
            ⚽
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
            Football Tactics
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
            試合ごとに戦術ボードを保存・管理
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-base font-semibold text-white shadow-md transition-colors hover:bg-green-700 active:bg-green-800 sm:h-14 sm:text-lg"
        >
          <span className="text-xl leading-none">＋</span>
          新規試合
        </button>

        <div className="mt-8 flex min-h-0 flex-1 flex-col">
          <h2 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300 sm:text-base">
            保存した試合
          </h2>

          {!ready ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">読み込み中…</p>
          ) : matches.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center dark:border-gray-700 dark:bg-gray-900">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                まだ保存された試合がありません
              </p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                「新規試合」から作成してください
              </p>
            </div>
          ) : (
            <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pb-2">
              {matches.map((match) => (
                <li key={match.id}>
                  <div className="flex items-stretch gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpen(match.id)}
                      className="flex min-w-0 flex-1 flex-col rounded-xl border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition-colors hover:border-green-300 hover:bg-green-50/40 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-green-700 dark:hover:bg-green-950/40"
                    >
                      <span className="truncate font-semibold text-gray-900 dark:text-gray-100">
                        {match.title}
                      </span>
                      <span className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {match.awayName} {match.awayScore} - {match.homeScore}{" "}
                        {match.homeName}
                      </span>
                      <span className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                        更新: {formatUpdatedAt(match.updatedAt)}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(match.id, match.title)}
                      className="shrink-0 rounded-xl border border-gray-200 px-3 text-xs text-gray-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-gray-700 dark:hover:border-red-900 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                      aria-label={`${match.title}を削除`}
                    >
                      削除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <section className="mt-6 shrink-0 rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">
            設定
          </h2>
          <DarkModeToggle />
        </section>
      </main>
    </div>
  );
}
