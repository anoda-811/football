"use client";

type AnalysisMemoPanelProps = {
  side: "left" | "right";
  open: boolean;
  title: string;
  teamColor: string;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
};

export function MemoBackdrop({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <button
      type="button"
      aria-label="メモを閉じる"
      onClick={onClose}
      className="fixed inset-0 z-40 bg-black/20"
    />
  );
}

export function AnalysisMemoPanel({
  side,
  open,
  title,
  teamColor,
  value,
  onChange,
  onClose,
}: AnalysisMemoPanelProps) {
  const slideFromLeft = side === "left";

  return (
    <aside
      className={`fixed top-0 bottom-0 z-50 flex w-[min(18rem,78vw)] max-w-full flex-col overflow-x-hidden border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-out dark:border-gray-700 dark:bg-gray-900 sm:w-72 ${
        slideFromLeft
          ? `left-0 border-r ${open ? "translate-x-0" : "-translate-x-full"}`
          : `right-0 border-l ${open ? "translate-x-0" : "translate-x-full"}`
      } ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="h-1" style={{ backgroundColor: teamColor }} />
        <div className="flex min-w-0 items-center justify-between px-3 py-2.5">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">
              分析メモ
            </p>
            <h2
              className="truncate text-sm font-bold sm:text-base"
              style={{ color: teamColor }}
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="戦術分析・メモを入力…"
        className="min-h-0 flex-1 resize-none overflow-x-hidden overflow-y-auto border-none bg-transparent px-3 py-3 text-sm leading-relaxed wrap-break-word text-gray-800 outline-none dark:text-gray-100"
      />
    </aside>
  );
}

type MemoToggleButtonProps = {
  side: "left" | "right";
  active: boolean;
  teamColor: string;
  hasContent: boolean;
  onClick: () => void;
};

export function MemoToggleButton({
  side,
  active,
  teamColor,
  hasContent,
  onClick,
}: MemoToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${side === "left" ? "左" : "右"}サイドの分析メモ`}
      aria-pressed={active}
      className={`absolute bottom-2 z-30 flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold shadow-lg transition-all hover:scale-[1.03] sm:text-sm ${
        side === "left" ? "left-2" : "right-2"
      } ${
        active
          ? "z-[60] border-green-600 bg-green-600 text-white dark:border-green-500 dark:bg-green-600"
          : "border-gray-300 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
      }`}
      style={!active ? { boxShadow: `0 4px 14px ${teamColor}33` } : undefined}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
        <path d="M4 6h16M4 12h10M4 18h14" strokeLinecap="round" />
      </svg>
      メモ
      {hasContent && !active && (
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: teamColor }}
          aria-hidden
        />
      )}
    </button>
  );
}
