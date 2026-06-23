"use client";

import { useId, useRef } from "react";

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

function pentagonPoints(
  cx: number,
  cy: number,
  radius: number,
  rotationDeg: number,
): string {
  return Array.from({ length: 5 }, (_, i) => {
    const angle = ((rotationDeg + i * 72 - 90) * Math.PI) / 180;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
}

function hexagonPoints(
  cx: number,
  cy: number,
  radius: number,
  rotationDeg: number,
): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = ((rotationDeg + i * 60 - 90) * Math.PI) / 180;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
}

const COS36 = Math.cos((36 * Math.PI) / 180);
const COS30 = Math.cos((30 * Math.PI) / 180);
const SIN36 = Math.sin((36 * Math.PI) / 180);
const PANEL_ANGLES = [-54, 18, 90, 162, 234] as const;
const PENTAGON_RADIUS = 12.6;
const HEXAGON_RADIUS = PENTAGON_RADIUS * 2 * SIN36;
const HEXAGON_DISTANCE = PENTAGON_RADIUS * COS36 + HEXAGON_RADIUS * COS30;
const OUTER_PENTAGON_DISTANCE =
  PENTAGON_RADIUS * COS36 + HEXAGON_RADIUS * 2 * COS30;
const PANEL_STROKE = 1;

export function SoccerBall({
  x,
  y,
  pitchRef,
  onPositionChange,
}: SoccerBallProps) {
  const clipId = useId();
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
        className="h-[clamp(1.5rem,4.5cqw,2.5rem)] w-[clamp(1.5rem,4.5cqw,2.5rem)] overflow-hidden rounded-full shadow-md"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        title="ドラッグでボールを移動"
        aria-label="サッカーボール"
      >
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
          <defs>
            <clipPath id={clipId}>
              <circle cx="50" cy="50" r="49" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            <circle cx="50" cy="50" r="49" fill="#fff" />
            {PANEL_ANGLES.map((angle) => {
              const rad = (angle * Math.PI) / 180;
              const hexCx = 50 + HEXAGON_DISTANCE * Math.cos(rad);
              const hexCy = 50 + HEXAGON_DISTANCE * Math.sin(rad);
              return (
                <polygon
                  key={`hex-${angle}`}
                  points={hexagonPoints(hexCx, hexCy, HEXAGON_RADIUS, angle + 180)}
                  fill="#fff"
                  stroke="#111"
                  strokeWidth={PANEL_STROKE}
                  strokeLinejoin="round"
                />
              );
            })}
            <polygon
              points={pentagonPoints(50, 50, PENTAGON_RADIUS, 0)}
              fill="#111"
              stroke="#111"
              strokeWidth={PANEL_STROKE}
              strokeLinejoin="round"
            />
            {PANEL_ANGLES.map((angle) => {
              const rad = (angle * Math.PI) / 180;
              const pentCx = 50 + OUTER_PENTAGON_DISTANCE * Math.cos(rad);
              const pentCy = 50 + OUTER_PENTAGON_DISTANCE * Math.sin(rad);
              return (
                <polygon
                  key={`pent-${angle}`}
                  points={pentagonPoints(
                    pentCx,
                    pentCy,
                    PENTAGON_RADIUS,
                    angle + 90,
                  )}
                  fill="#111"
                  stroke="#111"
                  strokeWidth={PANEL_STROKE}
                  strokeLinejoin="round"
                />
              );
            })}
          </g>
          <circle
            cx="50"
            cy="50"
            r="49"
            fill="none"
            stroke="#111"
            strokeWidth={PANEL_STROKE}
          />
        </svg>
      </div>
    </div>
  );
}
