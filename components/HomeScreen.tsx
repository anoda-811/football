"use client";

import { AppListBackButton } from "@/components/AppListBackButton";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  createMatch,
  deleteMatch,
  formatUpdatedAt,
  listMatches,
  updateMatchTitle,
  type MatchSummary,
} from "@/lib/matchStorage";

export function HomeScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [ready, setReady] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matches;
    return matches.filter((match) => match.title.toLowerCase().includes(q));
  }, [matches, searchQuery]);

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

  function startEdit(match: MatchSummary) {
    setEditingId(match.id);
    setEditTitle(match.title);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
  }

  function commitEdit() {
    if (!editingId) return;
    if (updateMatchTitle(editingId, editTitle)) {
      refresh();
    }
    cancelEdit();
  }

  return (
    <div className="flex h-dvh flex-col bg-white dark:bg-gray-950">
      <header className="shrink-0 border-b border-gray-200 px-4 py-2 dark:border-gray-800 sm:px-6">
        <AppListBackButton />
      </header>
      <main className="mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col px-6 py-6 sm:py-8">
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
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 sm:text-base">
              保存した試合
            </h2>
            {ready && matches.length > 0 && (
              <span className="shrink-0 text-[11px] text-gray-400 dark:text-gray-500">
                {searchQuery.trim()
                  ? `${filteredMatches.length} / ${matches.length}件`
                  : `${matches.length}件`}
              </span>
            )}
          </div>

          {ready && matches.length > 0 && (
            <div className="relative mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="試合名で検索"
                aria-label="試合名で検索"
                autoComplete="off"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-9 pl-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-green-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-green-600"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md px-2 py-0.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="検索をクリア"
                >
                  ✕
                </button>
              )}
            </div>
          )}

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
          ) : filteredMatches.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center dark:border-gray-700 dark:bg-gray-900">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                「{searchQuery.trim()}」に一致する試合がありません
              </p>
            </div>
          ) : (
            <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pb-2">
              {filteredMatches.map((match) => (
                <li key={match.id}>
                  {editingId === match.id ? (
                    <div className="rounded-xl border border-green-300 bg-white px-3 py-3 dark:border-green-700 dark:bg-gray-900">
                      <label className="mb-1 block text-[11px] font-medium text-gray-500 dark:text-gray-400">
                        試合名
                      </label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEdit();
                          if (e.key === "Escape") cancelEdit();
                        }}
                        autoFocus
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900 outline-none focus:border-green-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                      />
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          キャンセル
                        </button>
                        <button
                          type="button"
                          onClick={commitEdit}
                          disabled={!editTitle.trim()}
                          className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-40"
                        >
                          保存
                        </button>
                      </div>
                    </div>
                  ) : (
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
                        onClick={() => startEdit(match)}
                        className="shrink-0 rounded-xl border border-gray-200 px-3 text-xs text-gray-500 transition-colors hover:border-green-200 hover:bg-green-50 hover:text-green-700 dark:border-gray-700 dark:hover:border-green-800 dark:hover:bg-green-950/50 dark:hover:text-green-400"
                        aria-label={`${match.title}の名前を編集`}
                      >
                        編集
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
                  )}
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
