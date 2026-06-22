"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TacticsBoard } from "@/components/TacticsBoard";
import { createMatch, getMatch } from "@/lib/matchStorage";

export function BoardPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [matchId, setMatchId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | null>(null);

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) {
      const match = createMatch();
      router.replace(`/board?id=${match.id}`);
      return;
    }
    if (!getMatch(id)) {
      const match = createMatch();
      router.replace(`/board?id=${match.id}`);
      return;
    }
    setMatchId(id);
    setReady(true);
  }, [router, searchParams]);

  if (!ready || !matchId) {
    return (
      <div className="flex h-dvh items-center justify-center bg-white text-sm text-gray-400 dark:bg-gray-950 dark:text-gray-500">
        読み込み中…
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-white dark:bg-gray-950">
      <header className="shrink-0 border-b border-gray-200 px-2 py-1 dark:border-gray-800 sm:px-3">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xs text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 sm:text-sm"
          >
            ← ホーム
          </Link>
          <h1 className="text-base font-bold text-gray-900 dark:text-gray-100 sm:text-lg">
            戦術ボード
          </h1>
          <span className="w-12 text-right text-[10px] text-gray-400 dark:text-gray-500 sm:w-14 sm:text-xs">
            {saveStatus === "saving" ? "保存中…" : saveStatus === "saved" ? "保存済み" : ""}
          </span>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col px-1 py-0 pb-0.5 sm:px-2 sm:pb-1">
        <TacticsBoard matchId={matchId} onSaveStatus={setSaveStatus} />
      </main>
    </div>
  );
}
