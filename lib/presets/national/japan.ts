import { p } from "../buildPreset";
import { NATIONAL_BENCH_SIZE } from "../squadSizes";
import type { TeamPreset } from "../types";

/** worldfootballarchive.com/wc/2026/team/日本/ の最終メンバー26人 */
export const JAPAN_PRESET: TeamPreset = {
  id: "japan",
  category: "national",
  displayName: "日本",
  keywords: ["japan", "nihon", "日本代表"],
  formation: "3-4-2-1",
  note: "2026 W杯 · 26人",
  benchSize: NATIONAL_BENCH_SIZE,
  starters: [
    p(1, "鈴木"),
    p(22, "富安"),
    p(4, "板倉"),
    p(21, "伊藤"),
    p(10, "堂安"),
    p(24, "佐野"),
    p(7, "田中"),
    p(15, "鎌田"),
    p(8, "久保"),
    p(13, "中村"),
    p(18, "上田"),
  ],
  subs: [
    p(12, "大迫"),
    p(23, "早川"),
    p(16, "渡辺"),
    p(20, "瀬古"),
    p(25, "鈴木J"),
    p(6, "町野"),
    p(2, "菅原"),
    p(14, "伊東"),
    p(11, "前田"),
    p(19, "小川"),
    p(9, "後藤"),
    p(17, "鈴木Y"),
    p(26, "塩貝"),
    p(5, "長友"),
    p(3, "谷口"),
  ],
};
