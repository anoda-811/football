export type TeamColorOption = {
  id: string;
  label: string;
  hex: string;
};

export const TEAM_COLOR_OPTIONS: TeamColorOption[] = [
  { id: "red", label: "赤", hex: "#dc2626" },
  { id: "blue", label: "青", hex: "#2563eb" },
  { id: "navy", label: "ネイビー", hex: "#1e3a5f" },
  { id: "sky", label: "スカイ", hex: "#0ea5e9" },
  { id: "green", label: "緑", hex: "#16a34a" },
  { id: "yellow", label: "黄", hex: "#eab308" },
  { id: "orange", label: "オレンジ", hex: "#ea580c" },
  { id: "purple", label: "紫", hex: "#7c3aed" },
  { id: "maroon", label: "マルーン", hex: "#7f1d1d" },
  { id: "pink", label: "ピンク", hex: "#db2777" },
  { id: "black", label: "黒", hex: "#171717" },
  { id: "white", label: "白", hex: "#f1f5f9" },
];

export const DEFAULT_AWAY_COLOR = "#dc2626";
export const DEFAULT_HOME_COLOR = "#2563eb";

export function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62;
}

export function getTextColorForBg(hex: string): string {
  return isLightColor(hex) ? "#171717" : "#ffffff";
}
