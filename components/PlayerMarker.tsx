"use client";

import { useRef, useState } from "react";
import type { PlayerInfo } from "@/lib/formations";
import { getTextColorForBg } from "@/lib/teamColors";

const DRAG_THRESHOLD = 6;

type PlayerMarkerProps = {
  player: PlayerInfo;
  teamColor: string;
  variant: "pitch" | "bench";
  selected?: boolean;
  x?: number;
  y?: number;
  dragBounds?: { minX: number; maxX: number };
  onNameChange: (name: string) => void;
  onNumberChange: (number: number) => void;
  onSelect?: () => void;
  onPositionChange?: (x: number, y: number) => void;
  pitchRef?: React.RefObject<HTMLDivElement | null>;
};

export function PlayerMarker({
  player,
  teamColor,
  variant,
  selected = false,
  x = 50,
  y = 50,
  dragBounds = { minX: 3, maxX: 97 },
  onNameChange,
  onNumberChange,
  onSelect,
  onPositionChange,
  pitchRef,
}: PlayerMarkerProps) {
  const dragOffset = useRef({ x: 0, y: 0 });
  const pointerStart = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [editingNumber, setEditingNumber] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [numberDraft, setNumberDraft] = useState(String(player.number));

  const textColor = getTextColorForBg(teamColor);
  const isLight = textColor === "#171717";
  const borderClass = selected
    ? isLight
      ? "border-yellow-500 ring-2 ring-yellow-500"
      : "border-yellow-400 ring-2 ring-yellow-400"
    : isLight
      ? "border-gray-400"
      : "border-white";

  function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
  }

  function commitNumber() {
    const parsed = parseInt(numberDraft, 10);
    if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 99) {
      onNumberChange(parsed);
    } else {
      setNumberDraft(String(player.number));
    }
    setEditingNumber(false);
  }

  function startNumberEdit() {
    setNumberDraft(String(player.number));
    setEditingNumber(true);
  }

  function focusNameInput() {
    const input = nameInputRef.current;
    if (!input) return;
    input.focus();
    input.select();
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (editingNumber) return;

    if (variant !== "pitch" || !pitchRef?.current || !onPositionChange) {
      onSelect?.();
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    isDragging.current = false;
    pointerStart.current = { x: e.clientX, y: e.clientY };
    const pitch = pitchRef.current.getBoundingClientRect();
    const px = ((e.clientX - pitch.left) / pitch.width) * 100;
    const py = ((e.clientY - pitch.top) / pitch.height) * 100;
    dragOffset.current = { x: px - x, y: py - y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (variant !== "pitch" || !pitchRef?.current || !onPositionChange) return;
    if (!(e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) return;

    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;
    if (!isDragging.current && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

    isDragging.current = true;
    const pitch = pitchRef.current.getBoundingClientRect();
    const px =
      ((e.clientX - pitch.left) / pitch.width) * 100 - dragOffset.current.x;
    const py =
      ((e.clientY - pitch.top) / pitch.height) * 100 - dragOffset.current.y;
    onPositionChange(
      clamp(px, dragBounds.minX, dragBounds.maxX),
      clamp(py, 3, 97),
    );
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!(e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) return;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    if (!isDragging.current) {
      onSelect?.();
    }
    isDragging.current = false;
  }

  const pitchCircleClass =
    "h-[clamp(1.75rem,6.5cqw,3.25rem)] w-[clamp(1.75rem,6.5cqw,3.25rem)] text-[clamp(0.65rem,2.8cqw,1rem)]";
  const benchCircleClass = "h-10 w-10 text-sm sm:h-11 sm:w-11 sm:text-base";
  const sizeClass = variant === "pitch" ? pitchCircleClass : benchCircleClass;
  const nameWrapClass =
    variant === "pitch"
      ? "mt-0.5 w-[clamp(4rem,14cqw,8rem)]"
      : "mt-0.5 w-[5rem] sm:w-[6rem]";
  const nameInputClass =
    variant === "pitch"
      ? "w-full text-[clamp(0.6rem,2.4cqw,0.85rem)]"
      : "w-full text-xs sm:text-sm";
  const nameHitClass =
    variant === "pitch"
      ? "w-[clamp(2rem,7cqw,4rem)]"
      : "w-[2.75rem] sm:w-[3.25rem]";
  const nameColorClass =
    variant === "pitch"
      ? "text-black placeholder:text-gray-400"
      : "text-black placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500";

  const circle = editingNumber ? (
    <input
      type="number"
      min={0}
      max={99}
      value={numberDraft}
      onChange={(e) => setNumberDraft(e.target.value)}
      onBlur={commitNumber}
      onKeyDown={(e) => {
        if (e.key === "Enter") commitNumber();
        if (e.key === "Escape") {
          setNumberDraft(String(player.number));
          setEditingNumber(false);
        }
      }}
      onPointerDown={(e) => e.stopPropagation()}
      autoFocus
      className={`${sizeClass} pointer-events-auto rounded-full border-2 border-yellow-400 bg-white text-center font-bold text-gray-900 outline-none`}
      aria-label="背番号を編集"
    />
  ) : (
    <div
      className={`pointer-events-auto relative flex ${sizeClass} cursor-grab touch-none items-center justify-center rounded-full border-2 font-bold shadow-md transition-shadow active:cursor-grabbing ${borderClass}`}
      style={{ backgroundColor: teamColor, color: textColor }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={(e) => {
        e.stopPropagation();
        startNumberEdit();
      }}
      title="ドラッグで移動 / ダブルクリックで背番号編集"
    >
      {player.number}
    </div>
  );

  const marker = (
    <div className="pointer-events-none flex flex-col items-center">
      {circle}
      <div className={`${nameWrapClass} relative flex justify-center`}>
        <input
          ref={nameInputRef}
          type="text"
          value={player.name}
          onChange={(e) => onNameChange(e.target.value)}
          onFocus={() => setEditingName(true)}
          onBlur={() => setEditingName(false)}
          tabIndex={-1}
          className={`${nameInputClass} border-none bg-transparent text-center font-bold outline-none placeholder:font-normal ${nameColorClass} ${
            editingName ? "pointer-events-auto" : "pointer-events-none"
          }`}
          placeholder="名前"
          aria-label={`${player.number}番の選手名`}
        />
        {!editingName && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={`${player.number}番の選手名を編集`}
            className={`${nameHitClass} pointer-events-auto absolute inset-y-0 left-1/2 -translate-x-1/2 cursor-text rounded bg-transparent`}
            onPointerDown={(e) => {
              e.stopPropagation();
              focusNameInput();
            }}
          />
        )}
      </div>
    </div>
  );

  if (variant === "bench") {
    return marker;
  }

  return (
    <div
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {marker}
    </div>
  );
}
