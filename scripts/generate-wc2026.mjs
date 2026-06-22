import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "wc2026-squads-data.json");
const outPath = path.join(__dirname, "../lib/presets/national/wc2026.ts");

// 日本は lib/presets/national/japan.ts で手動管理

const TEAM_META = [
  ["mexico", "メキシコ", ["mexico", "メキシコ"]],
  ["south-africa", "南アフリカ", ["south africa", "南アフリカ"]],
  ["south-korea", "韓国", ["korea", "韓国", "korean"]],
  ["czechia", "チェコ", ["czech", "チェコ"]],
  ["canada", "カナダ", ["canada", "カナダ"]],
  ["bosnia", "ボスニア", ["bosnia", "ボスニア"]],
  ["qatar", "カタール", ["qatar", "カタール"]],
  ["switzerland", "スイス", ["switzerland", "スイス"]],
  ["brazil", "ブラジル", ["brazil", "ブラジル"]],
  ["morocco", "モロッコ", ["morocco", "モロッコ"]],
  ["haiti", "ハイチ", ["haiti", "ハイチ"]],
  ["scotland", "スコットランド", ["scotland", "スコットランド"]],
  ["usa", "アメリカ", ["usa", "america", "米国"]],
  ["paraguay", "パラグアイ", ["paraguay", "パラグアイ"]],
  ["australia", "オーストラリア", ["australia", "オーストラリア"]],
  ["turkey", "トルコ", ["turkey", "トルコ"]],
  ["germany", "ドイツ", ["germany", "ドイツ"]],
  ["curacao", "キュラソー", ["curacao", "キュラソー"]],
  ["ivory-coast", "コートジボワール", ["ivory coast", "コートジボワール"]],
  ["ecuador", "エクアドル", ["ecuador", "エクアドル"]],
  ["netherlands", "オランダ", ["netherlands", "holland", "オランダ"]],
  ["sweden", "スウェーデン", ["sweden", "スウェーデン"]],
  ["tunisia", "チュニジア", ["tunisia", "チュニジア"]],
  ["belgium", "ベルギー", ["belgium", "ベルギー"]],
  ["egypt", "エジプト", ["egypt", "エジプト"]],
  ["iran", "イラン", ["iran", "イラン"]],
  ["new-zealand", "ニュージーランド", ["new zealand", "ニュージーランド"]],
  ["spain", "スペイン", ["spain", "espana", "スペイン代表"]],
  ["cape-verde", "カーボベルデ", ["cape verde", "カーボベルデ"]],
  ["saudi-arabia", "サウジアラビア", ["saudi", "サウジ"]],
  ["uruguay", "ウルグアイ", ["uruguay", "ウルグアイ"]],
  ["france", "フランス", ["france", "フランス代表"]],
  ["senegal", "セネガル", ["senegal", "セネガル"]],
  ["iraq", "イラク", ["iraq", "イラク"]],
  ["norway", "ノルウェー", ["norway", "ノルウェー"]],
  ["argentina", "アルゼンチン", ["argentina", "アルゼンチン代表"]],
  ["algeria", "アルジェリア", ["algeria", "アルジェリア"]],
  ["austria", "オーストリア", ["austria", "オーストリア"]],
  ["jordan", "ヨルダン", ["jordan", "ヨルダン"]],
  ["portugal", "ポルトガル", ["portugal", "ポルトガル"]],
  ["dr-congo", "DRコンゴ", ["congo", "コンゴ"]],
  ["uzbekistan", "ウズベキスタン", ["uzbekistan", "ウズベキスタン"]],
  ["colombia", "コロンビア", ["colombia", "コロンビア"]],
  ["england", "イングランド", ["england", "イングランド代表"]],
  ["croatia", "クロアチア", ["croatia", "クロアチア"]],
  ["ghana", "ガーナ", ["ghana", "ガーナ"]],
  ["panama", "パナマ", ["panama", "パナマ"]],
];

function fmt(arr) {
  return JSON.stringify(arr);
}

const SQUAD_SIZE = 26;

function countPool(pool) {
  return pool.gk.length + pool.df.length + pool.mf.length + pool.fw.length;
}

function ensureSquadSize(pool, size = SQUAD_SIZE) {
  const next = {
    gk: [...pool.gk],
    df: [...pool.df],
    mf: [...pool.mf],
    fw: [...pool.fw],
  };
  let total = countPool(next);
  let pad = 1;
  while (total < size) {
    next.fw.push(`${70 + pad}|補欠${pad}`);
    pad += 1;
    total += 1;
  }
  return next;
}

if (!fs.existsSync(dataPath)) {
  console.error(`Missing ${dataPath}. Run: node scripts/fetch-wc2026-squads.mjs`);
  process.exit(1);
}

const { results, fetchedAt } = JSON.parse(fs.readFileSync(dataPath, "utf8"));
console.log(`Using squad data fetched at ${fetchedAt}`);

const lines = TEAM_META.map(([id, name, kw]) => {
  const entry = results[id];
  if (!entry) {
    throw new Error(`No squad data for ${id}. Re-run fetch-wc2026-squads.mjs`);
  }
  const fullPool = ensureSquadSize(entry.pool);
  return `  createPreset(${JSON.stringify(id)}, "national", ${JSON.stringify(name)}, ${JSON.stringify(kw)}, "2026 W杯 · 26人", poolFromEntries({gk:${fmt(fullPool.gk)},df:${fmt(fullPool.df)},mf:${fmt(fullPool.mf)},fw:${fmt(fullPool.fw)}})),`;
});

const content = `import { createPreset, poolFromEntries } from "../buildPreset";
import type { TeamPreset } from "../types";

/** worldfootballarchive.com/wc/2026/ の最終メンバーから生成 */
export const WC2026_PRESETS: TeamPreset[] = [
${lines.join("\n")}
];
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, content);
console.log(`Wrote ${lines.length} teams to ${outPath}`);
