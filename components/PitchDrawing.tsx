"use client";

import { useRef, useState } from "react";
import type { DrawStroke, DrawTool, PenColor } from "./DrawingToolbar";

type Point = { x: number; y: number };

type PitchDrawingProps = {
  tool: DrawTool;
  penColor: PenColor;
  strokes: DrawStroke[];
  onStrokesChange: (strokes: DrawStroke[]) => void;
};

const PEN_WIDTH = 3.0;
const ERASER_WIDTH = 4.5;

function pointsToPolyline(points: Point[]) {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const p = points[0];
    return `${p.x},${p.y} ${p.x + 0.05},${p.y}`;
  }
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

function dist(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pointToSegmentDistance(p: Point, a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return dist(p, a);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return dist(p, { x: a.x + t * dx, y: a.y + t * dy });
}

function isPointErased(p: Point, eraser: DrawStroke, radius: number) {
  const pts = eraser.points;
  for (let i = 0; i < pts.length; i++) {
    if (dist(p, pts[i]) <= radius) return true;
    if (i > 0 && pointToSegmentDistance(p, pts[i - 1], pts[i]) <= radius) {
      return true;
    }
  }
  return false;
}

function splitStrokeByEraser(
  stroke: DrawStroke,
  eraser: DrawStroke,
  radius: number,
): DrawStroke[] {
  const segments: DrawStroke[] = [];
  let current: Point[] = [];

  for (const point of stroke.points) {
    if (isPointErased(point, eraser, radius)) {
      if (current.length >= 2) {
        segments.push({ ...stroke, points: [...current] });
      }
      current = [];
    } else {
      current.push(point);
    }
  }

  if (current.length >= 2) {
    segments.push({ ...stroke, points: current });
  } else if (current.length === 1) {
    const p = current[0];
    segments.push({
      ...stroke,
      points: [p, { x: p.x + 0.05, y: p.y }],
    });
  }

  return segments;
}

function applyEraser(strokes: DrawStroke[], eraser: DrawStroke): DrawStroke[] {
  const radius = eraser.width / 2;
  const penStrokes = strokes.filter((s) => s.tool === "pen");
  return penStrokes.flatMap((stroke) =>
    splitStrokeByEraser(stroke, eraser, radius),
  );
}

function PenStrokePath({ stroke }: { stroke: DrawStroke }) {
  return (
    <polyline
      points={pointsToPolyline(stroke.points)}
      fill="none"
      stroke={stroke.color ?? "#facc15"}
      strokeWidth={stroke.width}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      style={{ filter: "drop-shadow(0 0 1.5px rgba(0,0,0,0.45))" }}
    />
  );
}

function EraserPreview({ stroke }: { stroke: DrawStroke }) {
  return (
    <polyline
      points={pointsToPolyline(stroke.points)}
      fill="none"
      stroke="rgba(255,255,255,0.55)"
      strokeWidth={stroke.width}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      strokeDasharray="1.2 0.8"
    />
  );
}

export function PitchDrawing({
  tool,
  penColor,
  strokes,
  onStrokesChange,
}: PitchDrawingProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const strokesRef = useRef(strokes);
  const currentStroke = useRef<DrawStroke | null>(null);
  const [liveStroke, setLiveStroke] = useState<DrawStroke | null>(null);
  const isDrawing = useRef(false);

  strokesRef.current = strokes;

  function getPoint(e: React.PointerEvent) {
    const layer = layerRef.current!;
    const rect = layer.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (!tool) return;
    e.preventDefault();
    e.stopPropagation();
    isDrawing.current = true;
    const point = getPoint(e);
    const stroke: DrawStroke = {
      tool,
      points: [point],
      width: tool === "pen" ? PEN_WIDTH : ERASER_WIDTH,
      color: tool === "pen" ? penColor : undefined,
    };
    currentStroke.current = stroke;
    setLiveStroke(stroke);
    layerRef.current?.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDrawing.current || !currentStroke.current) return;
    e.preventDefault();
    currentStroke.current.points.push(getPoint(e));
    setLiveStroke({
      ...currentStroke.current,
      points: [...currentStroke.current.points],
    });
  }

  function finishStroke(e: React.PointerEvent) {
    if (!isDrawing.current || !currentStroke.current) return;
    if (layerRef.current?.hasPointerCapture(e.pointerId)) {
      layerRef.current.releasePointerCapture(e.pointerId);
    }
    isDrawing.current = false;

    const finished = currentStroke.current;
    currentStroke.current = null;
    setLiveStroke(null);

    if (finished.points.length < 1) return;

    if (finished.tool === "pen") {
      onStrokesChange([...strokesRef.current, finished]);
    } else {
      onStrokesChange(applyEraser(strokesRef.current, finished));
    }
  }

  const penStrokes = strokes.filter((s) => s.tool === "pen");
  const livePen =
    liveStroke?.tool === "pen" ? liveStroke : null;
  const liveEraser =
    liveStroke?.tool === "eraser" ? liveStroke : null;

  return (
    <>
      <svg
        className="pointer-events-none absolute inset-0 z-[25] h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {penStrokes.map((stroke, i) => (
          <PenStrokePath key={i} stroke={stroke} />
        ))}
        {livePen && <PenStrokePath stroke={livePen} />}
        {liveEraser && <EraserPreview stroke={liveEraser} />}
      </svg>

      <div
        ref={layerRef}
        className={`absolute inset-0 z-[45] h-full w-full touch-none ${
          tool ? "cursor-crosshair" : "pointer-events-none"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishStroke}
        onPointerCancel={finishStroke}
        aria-hidden={!tool}
      />
    </>
  );
}
