"use client";

import {
  applyFormationToTeam,
  mirrorTeamPositions,
  type FormationId,
  type TeamState,
} from "@/lib/formations";
import {
  createDefaultBoardState,
  formatMatchTitle,
  normalizeBoardState,
  type BoardState,
} from "@/lib/boardState";
import { getMatch, saveMatch } from "@/lib/matchStorage";
import { AnalysisMemoPanel, MemoBackdrop, MemoToggleButton } from "./AnalysisMemoPanel";
import { DrawingToolbar, type DrawStroke, type DrawTool, type PenColor } from "./DrawingToolbar";
import { PitchDrawing } from "./PitchDrawing";
import { PlayerBench } from "./PlayerBench";
import { PlayerMarker } from "./PlayerMarker";
import { Scoreboard } from "./Scoreboard";
import { SoccerBall } from "./SoccerBall";
import { SoccerPitch } from "./SoccerPitch";
import { TeamSettings } from "./TeamSettings";
import { useEffect, useRef, useState } from "react";

const PITCH_DRAG = { minX: 3, maxX: 97 };

type Selection = {
  team: "home" | "away";
  type: "pitch" | "bench";
  slotId: string;
};

type TacticsBoardProps = {
  matchId: string;
  onSaveStatus?: (status: "saving" | "saved") => void;
};

function loadBoardState(matchId: string): BoardState {
  const saved = getMatch(matchId)?.data;
  if (!saved) return createDefaultBoardState();
  return normalizeBoardState(saved);
}

export function TacticsBoard({ matchId, onSaveStatus }: TacticsBoardProps) {
  const initial = loadBoardState(matchId);
  const skipSave = useRef(true);
  const pitchRef = useRef<HTMLDivElement>(null);
  const [awayTeam, setAwayTeam] = useState<TeamState>(initial.awayTeam);
  const [homeTeam, setHomeTeam] = useState<TeamState>(initial.homeTeam);
  const [awayFormation, setAwayFormation] = useState<FormationId>(initial.awayFormation);
  const [homeFormation, setHomeFormation] = useState<FormationId>(initial.homeFormation);
  const [awayColor, setAwayColor] = useState(initial.awayColor);
  const [homeColor, setHomeColor] = useState(initial.homeColor);
  const [awayName, setAwayName] = useState(initial.awayName);
  const [homeName, setHomeName] = useState(initial.homeName);
  const [awayScore, setAwayScore] = useState(initial.awayScore);
  const [homeScore, setHomeScore] = useState(initial.homeScore);
  const [elapsed, setElapsed] = useState(initial.elapsed);
  const [isRunning, setIsRunning] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [ballPosition, setBallPosition] = useState(initial.ballPosition);
  const [drawTool, setDrawTool] = useState<DrawTool>(null);
  const [penColor, setPenColor] = useState<PenColor>("#facc15");
  const [drawStrokes, setDrawStrokes] = useState<DrawStroke[]>(initial.drawStrokes);
  const [awayMemo, setAwayMemo] = useState(initial.awayMemo);
  const [homeMemo, setHomeMemo] = useState(initial.homeMemo);
  const [openMemo, setOpenMemo] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    skipSave.current = true;
    const next = loadBoardState(matchId);
    setAwayTeam(next.awayTeam);
    setHomeTeam(next.homeTeam);
    setAwayFormation(next.awayFormation);
    setHomeFormation(next.homeFormation);
    setAwayColor(next.awayColor);
    setHomeColor(next.homeColor);
    setAwayName(next.awayName);
    setHomeName(next.homeName);
    setAwayScore(next.awayScore);
    setHomeScore(next.homeScore);
    setElapsed(next.elapsed);
    setIsRunning(false);
    setSelection(null);
    setBallPosition(next.ballPosition);
    setDrawStrokes(next.drawStrokes);
    setAwayMemo(next.awayMemo);
    setHomeMemo(next.homeMemo);
    setOpenMemo(null);
    setDrawTool(null);
    const id = window.setTimeout(() => {
      skipSave.current = false;
    }, 0);
    return () => window.clearTimeout(id);
  }, [matchId]);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    if (skipSave.current) return;

    onSaveStatus?.("saving");
    const id = window.setTimeout(() => {
      const data: BoardState = {
        awayTeam,
        homeTeam,
        awayFormation,
        homeFormation,
        awayColor,
        homeColor,
        awayName,
        homeName,
        awayScore,
        homeScore,
        elapsed,
        isRunning,
        ballPosition,
        drawStrokes,
        awayMemo,
        homeMemo,
      };
      saveMatch({
        id: matchId,
        title: formatMatchTitle(data),
        updatedAt: Date.now(),
        data,
      });
      onSaveStatus?.("saved");
    }, 600);

    return () => window.clearTimeout(id);
  }, [
    matchId,
    onSaveStatus,
    awayTeam,
    homeTeam,
    awayFormation,
    homeFormation,
    awayColor,
    homeColor,
    awayName,
    homeName,
    awayScore,
    homeScore,
    elapsed,
    isRunning,
    ballPosition,
    drawStrokes,
    awayMemo,
    homeMemo,
  ]);

  function getSetter(team: "home" | "away") {
    return team === "home" ? setHomeTeam : setAwayTeam;
  }

  function getTeam(team: "home" | "away") {
    return team === "home" ? homeTeam : awayTeam;
  }

  function updatePlayer(
    team: "home" | "away",
    type: "pitch" | "bench",
    slotId: string,
    field: "name" | "number",
    value: string | number,
  ) {
    getSetter(team)((prev) => {
      const key = type === "pitch" ? "pitch" : "bench";
      return {
        ...prev,
        [key]: prev[key].map((s) =>
          s.slotId === slotId
            ? { ...s, player: { ...s.player, [field]: value } }
            : s,
        ),
      };
    });
  }

  function updatePitchPosition(
    team: "home" | "away",
    slotId: string,
    x: number,
    y: number,
  ) {
    getSetter(team)((prev) => ({
      ...prev,
      pitch: prev.pitch.map((s) =>
        s.slotId === slotId ? { ...s, x, y } : s,
      ),
    }));
  }

  function handleFormationChange(team: "home" | "away", formationId: FormationId) {
    if (team === "away") {
      setAwayFormation(formationId);
      setAwayTeam((prev) => applyFormationToTeam(prev, formationId, "away"));
    } else {
      setHomeFormation(formationId);
      setHomeTeam((prev) => applyFormationToTeam(prev, formationId, "home"));
    }
    setSelection(null);
  }

  function resetTimer() {
    setElapsed(0);
    setIsRunning(false);
  }

  function swapHalftime() {
    const nextAwayTeam = mirrorTeamPositions(homeTeam);
    const nextHomeTeam = mirrorTeamPositions(awayTeam);

    setAwayTeam(nextAwayTeam);
    setHomeTeam(nextHomeTeam);
    setAwayFormation(homeFormation);
    setHomeFormation(awayFormation);
    setAwayColor(homeColor);
    setHomeColor(awayColor);
    setAwayName(homeName);
    setHomeName(awayName);
    setAwayScore(homeScore);
    setHomeScore(awayScore);
    setAwayMemo(homeMemo);
    setHomeMemo(awayMemo);
    setBallPosition((pos) => ({ x: 100 - pos.x, y: pos.y }));
    setSelection(null);
    setOpenMemo(null);
  }

  function toggleMemo(side: "left" | "right") {
    setOpenMemo((current) => (current === side ? null : side));
  }

  function swapPlayers(team: "home" | "away", pitchSlotId: string, benchSlotId: string) {
    getSetter(team)((prev) => {
      const pitchIdx = prev.pitch.findIndex((s) => s.slotId === pitchSlotId);
      const benchIdx = prev.bench.findIndex((s) => s.slotId === benchSlotId);
      if (pitchIdx === -1 || benchIdx === -1) return prev;

      const pitchPlayer = prev.pitch[pitchIdx].player;
      const benchPlayer = prev.bench[benchIdx].player;

      const pitch = [...prev.pitch];
      const bench = [...prev.bench];
      pitch[pitchIdx] = { ...pitch[pitchIdx], player: benchPlayer };
      bench[benchIdx] = { ...bench[benchIdx], player: pitchPlayer };

      return { pitch, bench };
    });
    setSelection(null);
  }

  function handleSelect(team: "home" | "away", type: "pitch" | "bench", slotId: string) {
    if (!selection) {
      setSelection({ team, type, slotId });
      return;
    }

    if (selection.team !== team) {
      setSelection({ team, type, slotId });
      return;
    }

    const isPitchBenchPair =
      (selection.type === "pitch" && type === "bench") ||
      (selection.type === "bench" && type === "pitch");

    if (isPitchBenchPair && selection.slotId !== slotId) {
      const pitchSlotId =
        selection.type === "pitch" ? selection.slotId : slotId;
      const benchSlotId =
        selection.type === "bench" ? selection.slotId : slotId;
      swapPlayers(team, pitchSlotId, benchSlotId);
      return;
    }

    if (selection.slotId === slotId && selection.type === type) {
      setSelection(null);
      return;
    }

    setSelection({ team, type, slotId });
  }

  function renderPitchTeam(team: "home" | "away", color: string) {
    const state = getTeam(team);
    const dragBounds = PITCH_DRAG;
    return state.pitch.map((slot) => (
      <PlayerMarker
        key={slot.slotId}
        player={slot.player}
        teamColor={color}
        variant="pitch"
        x={slot.x}
        y={slot.y}
        dragBounds={dragBounds}
        selected={
          selection?.team === team &&
          selection.type === "pitch" &&
          selection.slotId === slot.slotId
        }
        pitchRef={pitchRef}
        onNameChange={(name) => updatePlayer(team, "pitch", slot.slotId, "name", name)}
        onNumberChange={(number) =>
          updatePlayer(team, "pitch", slot.slotId, "number", number)
        }
        onSelect={() => handleSelect(team, "pitch", slot.slotId)}
        onPositionChange={(x, y) =>
          updatePitchPosition(team, slot.slotId, x, y)
        }
      />
    ));
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-x-hidden">
      <div className="mb-0 flex shrink-0 items-start justify-between gap-1 pt-1 sm:gap-2 sm:pt-1.5">
        <TeamSettings
          side="left"
          label="左サイド"
          teamName={awayName}
          teamColor={awayColor}
          formation={awayFormation}
          onTeamNameChange={setAwayName}
          onColorChange={setAwayColor}
          onFormationChange={(id) => handleFormationChange("away", id)}
        />

        <div className="relative flex min-w-0 flex-1 flex-col items-center">
          <div className="w-1/2 min-w-[10.5rem] shrink-0">
            <Scoreboard
            awayName={awayName}
            homeName={homeName}
            awayScore={awayScore}
            homeScore={homeScore}
            awayColor={awayColor}
            homeColor={homeColor}
            elapsed={elapsed}
            isRunning={isRunning}
            onAwayNameChange={setAwayName}
            onHomeNameChange={setHomeName}
            onAwayScoreChange={setAwayScore}
            onHomeScoreChange={setHomeScore}
            onToggleRunning={() => setIsRunning((r) => !r)}
            onReset={resetTimer}
          />
          </div>
          <div className="mt-0.5 flex items-center justify-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={swapHalftime}
              className="whitespace-nowrap rounded-md border border-gray-300 bg-white px-2.5 py-1 text-[10px] font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 sm:px-3 sm:py-1.5 sm:text-xs"
            >
              ⇄ 後半
            </button>
            <DrawingToolbar
              inline
              tool={drawTool}
              penColor={penColor}
              onToolChange={setDrawTool}
              onPenColorChange={setPenColor}
              onReset={() => setDrawStrokes([])}
            />
          </div>
        </div>

        <TeamSettings
          side="right"
          label="右サイド"
          teamName={homeName}
          teamColor={homeColor}
          formation={homeFormation}
          onTeamNameChange={setHomeName}
          onColorChange={setHomeColor}
          onFormationChange={(id) => handleFormationChange("home", id)}
        />
      </div>

      <div className="relative mt-0.5 flex min-h-0 flex-1 items-stretch overflow-x-hidden pb-1 sm:pb-1.5">
        <PlayerBench
          side="left"
          label="左サブ"
          bench={awayTeam.bench}
          teamColor={awayColor}
          selectedSlotId={
            selection?.team === "away" && selection.type === "bench"
              ? selection.slotId
              : null
          }
          onSelect={(slotId) => handleSelect("away", "bench", slotId)}
          onNameChange={(slotId, name) =>
            updatePlayer("away", "bench", slotId, "name", name)
          }
          onNumberChange={(slotId, number) =>
            updatePlayer("away", "bench", slotId, "number", number)
          }
        />

        <div className="box-border flex min-h-0 min-w-0 flex-1 items-start justify-center px-0 pb-1 sm:pb-1.5">
          <div className="flex h-full w-full items-start justify-center">
            <div
              ref={pitchRef}
              className="@container relative aspect-[3/2] h-full max-h-full w-auto max-w-full overflow-hidden rounded-lg border-2 border-green-700 bg-white shadow-lg dark:border-green-600 dark:shadow-green-950/20"
            >
              <SoccerPitch />
              {renderPitchTeam("away", awayColor)}
              {renderPitchTeam("home", homeColor)}
              <SoccerBall
                x={ballPosition.x}
                y={ballPosition.y}
                pitchRef={pitchRef}
                onPositionChange={(x, y) => setBallPosition({ x, y })}
              />
              <PitchDrawing
                tool={drawTool}
                penColor={penColor}
                strokes={drawStrokes}
                onStrokesChange={setDrawStrokes}
              />
            </div>
          </div>
        </div>

        <PlayerBench
          side="right"
          label="右サブ"
          bench={homeTeam.bench}
          teamColor={homeColor}
          selectedSlotId={
            selection?.team === "home" && selection.type === "bench"
              ? selection.slotId
              : null
          }
          onSelect={(slotId) => handleSelect("home", "bench", slotId)}
          onNameChange={(slotId, name) =>
            updatePlayer("home", "bench", slotId, "name", name)
          }
          onNumberChange={(slotId, number) =>
            updatePlayer("home", "bench", slotId, "number", number)
          }
        />

        {openMemo === null && (
          <>
            <MemoToggleButton
              side="left"
              active={false}
              teamColor={awayColor}
              hasContent={awayMemo.trim().length > 0}
              onClick={() => toggleMemo("left")}
            />
            <MemoToggleButton
              side="right"
              active={false}
              teamColor={homeColor}
              hasContent={homeMemo.trim().length > 0}
              onClick={() => toggleMemo("right")}
            />
          </>
        )}
      </div>

      <MemoBackdrop open={openMemo !== null} onClose={() => setOpenMemo(null)} />
      <AnalysisMemoPanel
        side="left"
        open={openMemo === "left"}
        title={awayName.trim() || "左サイド"}
        teamColor={awayColor}
        value={awayMemo}
        onChange={setAwayMemo}
        onClose={() => setOpenMemo(null)}
      />
      <AnalysisMemoPanel
        side="right"
        open={openMemo === "right"}
        title={homeName.trim() || "右サイド"}
        teamColor={homeColor}
        value={homeMemo}
        onChange={setHomeMemo}
        onClose={() => setOpenMemo(null)}
      />
    </div>
  );
}
