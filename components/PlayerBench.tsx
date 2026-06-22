"use client";

import type { BenchSlot } from "@/lib/formations";
import { PlayerMarker } from "./PlayerMarker";

/** 1列目の人数（8人目から2列目） */
const BENCH_FIRST_COLUMN = 7;

type PlayerBenchProps = {
  label: string;
  bench: BenchSlot[];
  teamColor: string;
  selectedSlotId: string | null;
  onSelect: (slotId: string) => void;
  onNameChange: (slotId: string, name: string) => void;
  onNumberChange: (slotId: string, number: number) => void;
};

function BenchColumn({
  slots,
  teamColor,
  selectedSlotId,
  onSelect,
  onNameChange,
  onNumberChange,
}: {
  slots: BenchSlot[];
  teamColor: string;
  selectedSlotId: string | null;
  onSelect: (slotId: string) => void;
  onNameChange: (slotId: string, name: string) => void;
  onNumberChange: (slotId: string, number: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      {slots.map((slot) => (
        <PlayerMarker
          key={slot.slotId}
          player={slot.player}
          teamColor={teamColor}
          variant="bench"
          selected={selectedSlotId === slot.slotId}
          onSelect={() => onSelect(slot.slotId)}
          onNameChange={(name) => onNameChange(slot.slotId, name)}
          onNumberChange={(number) => onNumberChange(slot.slotId, number)}
        />
      ))}
    </div>
  );
}

export function PlayerBench({
  label,
  bench,
  teamColor,
  selectedSlotId,
  onSelect,
  onNameChange,
  onNumberChange,
}: PlayerBenchProps) {
  const useTwoColumns = bench.length > BENCH_FIRST_COLUMN;
  const firstColumn = useTwoColumns ? bench.slice(0, BENCH_FIRST_COLUMN) : bench;
  const secondColumn = useTwoColumns ? bench.slice(BENCH_FIRST_COLUMN) : [];

  return (
    <div className="flex w-full shrink-0 flex-col items-center gap-1 overflow-hidden">
      <span className="shrink-0 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 sm:text-sm">
        {label}
        <span className="ml-1 text-[10px] font-normal text-gray-400 dark:text-gray-500">
          ({bench.length})
        </span>
      </span>
      <div
        className={`flex items-start justify-center gap-1 sm:gap-1.5 ${useTwoColumns ? "" : "flex-col"}`}
      >
        <BenchColumn
          slots={firstColumn}
          teamColor={teamColor}
          selectedSlotId={selectedSlotId}
          onSelect={onSelect}
          onNameChange={onNameChange}
          onNumberChange={onNumberChange}
        />
        {secondColumn.length > 0 && (
          <BenchColumn
            slots={secondColumn}
            teamColor={teamColor}
            selectedSlotId={selectedSlotId}
            onSelect={onSelect}
            onNameChange={onNameChange}
            onNumberChange={onNumberChange}
          />
        )}
      </div>
    </div>
  );
}
