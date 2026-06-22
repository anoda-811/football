"use client";

import type { BenchSlot } from "@/lib/formations";
import { PlayerMarker } from "./PlayerMarker";

type PlayerBenchProps = {
  label: string;
  side: "left" | "right";
  bench: BenchSlot[];
  teamColor: string;
  selectedSlotId: string | null;
  onSelect: (slotId: string) => void;
  onNameChange: (slotId: string, name: string) => void;
  onNumberChange: (slotId: string, number: number) => void;
};

export function PlayerBench({
  label,
  side,
  bench,
  teamColor,
  selectedSlotId,
  onSelect,
  onNameChange,
  onNumberChange,
}: PlayerBenchProps) {
  return (
    <div
      className={`flex h-full w-[5.25rem] shrink-0 flex-col items-center gap-0.5 overflow-y-auto pt-6 sm:w-[6.5rem] sm:pt-7 ${side === "right" ? "pl-1.5 sm:pl-2" : ""}`}
    >
      <span className="mb-0.5 shrink-0 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 sm:text-sm">
        {label}
      </span>
      <div className="flex flex-col gap-1">
        {bench.map((slot) => (
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
    </div>
  );
}
