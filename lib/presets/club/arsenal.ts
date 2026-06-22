import { createPreset, poolFromEntries } from "../buildPreset";
import type { TeamPreset } from "../types";

export const ARSENAL_PRESET: TeamPreset = createPreset(
  "arsenal",
  "club",
  "アーセナル",
  ["arsenal", "gunners", "アーセナル", "プレミア"],
  "2025/26",
  poolFromEntries({
    gk: ["1|ラヤ", "13|ネト", "31|ハイン"],
    df: ["2|ホワイト", "6|ガブリエル", "12|ティンバー", "4|サリバ", "15|キヴィオール", "3|モスケラ", "5|ヒンカピエ"],
    mf: ["41|ライス", "36|ズビメンディ", "8|エデゴール", "23|メリーノ", "22|ヌワネリ", "16|ノルゴー"],
    fw: ["7|サカ", "11|マルティネリ", "29|ギョケレス", "19|トロサール", "14|エゼ", "20|マデューケ", "9|ジェズス"],
  }),
);
