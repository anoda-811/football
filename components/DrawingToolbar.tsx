"use client";

export type DrawTool = "pen" | "eraser" | null;

export type PenColor = "#ffffff" | "#facc15" | "#ef4444" | "#171717" | "#3b82f6";

export const PEN_COLOR_OPTIONS: Array<{ id: string; label: string; hex: PenColor }> = [
  { id: "white", label: "白", hex: "#ffffff" },
  { id: "yellow", label: "黄", hex: "#facc15" },
  { id: "red", label: "赤", hex: "#ef4444" },
  { id: "blue", label: "青", hex: "#3b82f6" },
  { id: "black", label: "黒", hex: "#171717" },
];

export type DrawStroke = {
  tool: "pen" | "eraser";
  points: Array<{ x: number; y: number }>;
  width: number;
  color?: PenColor;
};

type DrawingToolbarProps = {
  tool: DrawTool;
  penColor: PenColor;
  onToolChange: (tool: DrawTool) => void;
  onPenColorChange: (color: PenColor) => void;
  onReset: () => void;
  compact?: boolean;
  inline?: boolean;
};

function ToolButton({
  active,
  onClick,
  title,
  small = false,
  large = false,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  small?: boolean;
  large?: boolean;
  children: React.ReactNode;
}) {
  const sizeClass = large
    ? "h-9 w-9 sm:h-10 sm:w-10"
    : small
      ? "h-7 w-7"
      : "h-8 w-8 sm:h-9 sm:w-9";

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex items-center justify-center rounded-md border transition-colors ${sizeClass} ${
        active
          ? "border-green-600 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-950 dark:text-green-300"
          : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

export function DrawingToolbar({
  tool,
  penColor,
  onToolChange,
  onPenColorChange,
  onReset,
  compact = false,
  inline = false,
}: DrawingToolbarProps) {
  if (inline) {
    return (
      <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-1.5 py-1 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:gap-1.5 sm:px-2">
        <span className="text-[9px] font-bold text-gray-600 dark:text-gray-300 sm:text-[10px]">書き込み</span>
        <ToolButton
          small
          active={tool === "pen"}
          onClick={() => onToolChange(tool === "pen" ? null : "pen")}
          title="ペン"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
            <path d="M12 20l-8.5-8.5a2.1 2.1 0 0 1 0-3l3-3a2.1 2.1 0 0 1 3 0L15 8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 6l1 1" strokeLinecap="round" />
            <path d="M6 15l3 3" strokeLinecap="round" />
          </svg>
        </ToolButton>
        <ToolButton
          small
          active={tool === "eraser"}
          onClick={() => onToolChange(tool === "eraser" ? null : "eraser")}
          title="消しゴム"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
            <path d="M7 21h13" strokeLinecap="round" />
            <path d="M5 15l7-7 6 6-7 7H5v-6z" strokeLinejoin="round" />
          </svg>
        </ToolButton>
        {PEN_COLOR_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            title={opt.label}
            onClick={() => onPenColorChange(opt.hex)}
            className={`h-4 w-4 rounded-full border-2 transition-transform hover:scale-110 sm:h-[1.125rem] sm:w-[1.125rem] ${
              penColor === opt.hex ? "border-green-600 ring-1 ring-green-400" : "border-gray-300"
            }`}
            style={{ backgroundColor: opt.hex }}
            aria-label={`ペンの色: ${opt.label}`}
          />
        ))}
        <button
          type="button"
          onClick={onReset}
          title="書き込みをリセット"
          className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-[9px] font-semibold text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:text-[10px]"
        >
          リセット
        </button>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-gray-50 px-1.5 py-1.5 dark:border-gray-700 dark:bg-gray-900">
        <span className="text-center text-[9px] font-semibold text-gray-500 dark:text-gray-400 sm:text-[10px]">
          書き込み
        </span>
        <div className="flex justify-center gap-1">
          <ToolButton
            active={tool === "pen"}
            onClick={() => onToolChange(tool === "pen" ? null : "pen")}
            title="ペン"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
              <path d="M12 20l-8.5-8.5a2.1 2.1 0 0 1 0-3l3-3a2.1 2.1 0 0 1 3 0L15 8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 6l1 1" strokeLinecap="round" />
              <path d="M6 15l3 3" strokeLinecap="round" />
            </svg>
          </ToolButton>
          <ToolButton
            active={tool === "eraser"}
            onClick={() => onToolChange(tool === "eraser" ? null : "eraser")}
            title="消しゴム"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
              <path d="M7 21h13" strokeLinecap="round" />
              <path d="M5 15l7-7 6 6-7 7H5v-6z" strokeLinejoin="round" />
            </svg>
          </ToolButton>
        </div>
        <div className="flex flex-wrap justify-center gap-0.5">
          {PEN_COLOR_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              title={opt.label}
              onClick={() => onPenColorChange(opt.hex)}
              className={`h-4 w-4 rounded-full border-2 transition-transform hover:scale-110 sm:h-[1.125rem] sm:w-[1.125rem] ${
                penColor === opt.hex ? "border-green-600 ring-1 ring-green-400" : "border-gray-300"
              }`}
              style={{ backgroundColor: opt.hex }}
              aria-label={`ペンの色: ${opt.label}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={onReset}
          title="書き込みをリセット"
          className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-[9px] font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:text-[10px]"
        >
          リセット
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 dark:border-gray-700 dark:bg-gray-900">
      <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 sm:text-xs">書き込み</span>
      <ToolButton
        active={tool === "pen"}
        onClick={() => onToolChange(tool === "pen" ? null : "pen")}
        title="ペン"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
          <path d="M12 20l-8.5-8.5a2.1 2.1 0 0 1 0-3l3-3a2.1 2.1 0 0 1 3 0L15 8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 6l1 1" strokeLinecap="round" />
          <path d="M6 15l3 3" strokeLinecap="round" />
        </svg>
      </ToolButton>
      <ToolButton
        active={tool === "eraser"}
        onClick={() => onToolChange(tool === "eraser" ? null : "eraser")}
        title="消しゴム"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
          <path d="M7 21h13" strokeLinecap="round" />
          <path d="M5 15l7-7 6 6-7 7H5v-6z" strokeLinejoin="round" />
        </svg>
      </ToolButton>
      <div className="flex items-center gap-1">
        {PEN_COLOR_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            title={opt.label}
            onClick={() => onPenColorChange(opt.hex)}
            className={`h-5 w-5 rounded-full border-2 transition-transform hover:scale-110 sm:h-6 sm:w-6 ${
              penColor === opt.hex ? "border-green-600 ring-1 ring-green-400" : "border-gray-300"
            }`}
            style={{ backgroundColor: opt.hex }}
            aria-label={`ペンの色: ${opt.label}`}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={onReset}
        title="書き込みをリセット"
        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-[10px] font-semibold text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:text-xs"
      >
        リセット
      </button>
    </div>
  );
}
