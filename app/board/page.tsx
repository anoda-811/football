import { Suspense } from "react";
import { BoardPageClient } from "@/components/BoardPageClient";

export default function BoardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center bg-white text-sm text-gray-400 dark:bg-gray-950 dark:text-gray-500">
          読み込み中…
        </div>
      }
    >
      <BoardPageClient />
    </Suspense>
  );
}
