import { createPreset, poolFromEntries } from "../buildPreset";
import type { TeamPreset } from "../types";

/** 2014-15 トリプル獲得シーズン（MSN） */
export const BARCELONA_MSN_PRESET: TeamPreset = createPreset(
  "barcelona-msn",
  "club",
  "バルセロナ（MSN時代）",
  [
    "barcelona",
    "barca",
    "バルサ",
    "バルセロナ",
    "msn",
    "メッシ",
    "messi",
    "ネイマール",
    "neymar",
    "スアレス",
    "suarez",
    "シャビ",
    "xavi",
    "イニエスタ",
    "iniesta",
    "ブスケツ",
    "busquets",
  ],
  "2014-15 · トリプル",
  poolFromEntries({
    gk: ["1|テル・ステーゲン", "13|ブラボ"],
    df: [
      "22|ダニ・アルベス",
      "3|ピケ",
      "14|マスチェラーノ",
      "18|ジョルディ・アルバ",
      "24|マティエ",
      "21|アドリアーノ",
      "15|バルトラ",
    ],
    mf: [
      "5|ブスケツ",
      "4|ラキティッチ",
      "8|イニエスタ",
      "6|シャビ",
      "12|ラフィーニャ",
      "20|ロベルト",
    ],
    fw: [
      "10|メッシ",
      "9|スアレス",
      "11|ネイマール",
      "7|ペドロ",
      "31|ムニール",
      "19|サンドロ",
    ],
  }),
);
