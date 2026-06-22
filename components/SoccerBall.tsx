"use client";

import { useRef } from "react";

const DRAG_THRESHOLD = 6;

type SoccerBallProps = {
  x: number;
  y: number;
  pitchRef: React.RefObject<HTMLDivElement | null>;
  onPositionChange: (x: number, y: number) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function SoccerBall({
  x,
  y,
  pitchRef,
  onPositionChange,
}: SoccerBallProps) {
  const dragOffset = useRef({ x: 0, y: 0 });
  const pointerStart = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  function handlePointerDown(e: React.PointerEvent) {
    if (!pitchRef.current) return;
    e.preventDefault();
    isDragging.current = false;
    pointerStart.current = { x: e.clientX, y: e.clientY };
    const pitch = pitchRef.current.getBoundingClientRect();
    const px = ((e.clientX - pitch.left) / pitch.width) * 100;
    const py = ((e.clientY - pitch.top) / pitch.height) * 100;
    dragOffset.current = { x: px - x, y: py - y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!pitchRef.current) return;
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
    onPositionChange(clamp(px, 3, 97), clamp(py, 3, 97));
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!(e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) return;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    isDragging.current = false;
  }

  return (
    <div
      className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none active:cursor-grabbing"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div
        className="flex h-[clamp(1.5rem,4.5cqw,2.5rem)] w-[clamp(1.5rem,4.5cqw,2.5rem)] items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-gray-300"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        title="ドラッグでボールを移動"
        aria-label="サッカーボール"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-[80%] w-[80%]"
          aria-hidden
        >
          <circle cx="12" cy="12" r="11" fill="white" stroke="#333" strokeWidth="0.8" />
          <path
            d="M12 2 L14.5 8.5 L12 12 L9.5 8.5 Z M12 22 L9.5 15.5 L12 12 L14.5 15.5 Z M2 12 L8.5 9.5 L12 12 L8.5 14.5 Z M22 12 L15.5 14.5 L12 12 L15.5 9.5 Z"
            fill="#333"
          />
          <path
            d="M12 12 L8.5 9.5 L9.5 8.5 L12 12 L14.5 8.5 L15.5 9.5 Z"
            fill="#333"
          />
          <path
            d="M12 12 L9.5 14.5 L9.5 15.5 L12 12 L14.5 15.5 L14.5 14.5 Z"
            fill="#333"
          />
        </svg>
      </div>
    </div>
  );
}
