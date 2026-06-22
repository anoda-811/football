import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDataPath = path.join(__dirname, "wc2026-squads-data.json");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

/** preset id → worldfootballarchive 日本語チーム名 */
export const TEAM_SLUGS = {
  mexico: "メキシコ",
  "south-africa": "南アフリカ共和国",
  "south-korea": "韓国",
  czechia: "チェコ",
  canada: "カナダ",
  bosnia: "ボスニア・ヘルツェゴビナ",
  qatar: "カタール",
  switzerland: "スイス",
  brazil: "ブラジル",
  morocco: "モロッコ",
  haiti: "ハイチ",
  scotland: "スコットランド",
  usa: "アメリカ",
  paraguay: "パラグアイ",
  australia: "オーストラリア",
  turkey: "トルコ",
  germany: "ドイツ",
  curacao: "キュラソー",
  "ivory-coast": "コートジボワール",
  ecuador: "エクアドル",
  netherlands: "オランダ",
  sweden: "スウェーデン",
  tunisia: "チュニジア",
  belgium: "ベルギー",
  egypt: "エジプト",
  iran: "イラン",
  "new-zealand": "ニュージーランド",
  spain: "スペイン",
  "cape-verde": "カーボベルデ",
  "saudi-arabia": "サウジアラビア",
  uruguay: "ウルグアイ",
  france: "フランス",
  senegal: "セネガル",
  iraq: "イラク",
  norway: "ノルウェー",
  argentina: "アルゼンチン",
  algeria: "アルジェリア",
  austria: "オーストリア",
  jordan: "ヨルダン",
  portugal: "ポルトガル",
  "dr-congo": "コンゴ民主共和国",
  uzbekistan: "ウズベキスタン",
  colombia: "コロンビア",
  england: "イングランド",
  croatia: "クロアチア",
  ghana: "ガーナ",
  panama: "パナマ",
  japan: "日本",
};

const POS_MAP = {
  GK: "gk",
  DF: "df",
  MF: "mf",
  FW: "fw",
};

function decodeHtml(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

/** 表示名: カタカナ括弧 → 括弧前のカタカナ → 欧文の姓 */
export function displayNameFromRaw(raw) {
  const name = decodeHtml(raw).trim();
  const kataInParen = name.match(/（([ァ-ヴー・\s]+)）/);
  if (kataInParen) {
    return kataInParen[1].replace(/・/g, "").replace(/\s+/g, "").slice(0, 12);
  }

  const beforeParen = name.replace(/（[^）]*）/g, "").trim();
  if (/[ァ-ヴー・]/.test(beforeParen)) {
    return compactKatakana(beforeParen);
  }
  if (/^[\u4e00-\u9faf]+$/.test(beforeParen)) {
    return beforeParen.length > 5 ? beforeParen.slice(0, 5) : beforeParen;
  }

  const en = name.match(/（([^）]+)）/);
  if (en) {
    const parts = en[1].trim().split(/\s+/);
    return parts[parts.length - 1].slice(0, 14);
  }
  return beforeParen.slice(0, 14);
}

function compactKatakana(text) {
  const trimmed = text.trim();
  const parts = trimmed.split("・").filter(Boolean);
  const core = (parts.length > 1 ? parts[parts.length - 1] : trimmed)
    .replace(/・/g, "")
    .replace(/\s+/g, "");
  return core.length > 10 ? core.slice(0, 10) : core;
}

export function parseFinalSquad(html) {
  const players = [];
  const rowRe = /<tr\b[\s\S]*?<\/tr>/g;
  const rows = html.match(rowRe) ?? [];

  for (const row of rows) {
    if (!row.includes("最終メンバー")) continue;

    const tds = [...row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map((m) =>
      m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    );
    if (tds.length < 2) continue;

    const number = Number(tds[0]);
    const pos = tds[1];
    if (!Number.isFinite(number) || !POS_MAP[pos]) continue;

    const nameMatch = row.match(/class="name2-ja">([^<]+)</);
    if (!nameMatch) continue;

    players.push({
      number,
      pos,
      name: displayNameFromRaw(nameMatch[1]),
    });
  }

  const seen = new Set();
  return players
    .filter((p) => {
      if (seen.has(p.number)) return false;
      seen.add(p.number);
      return true;
    })
    .sort((a, b) => a.number - b.number);
}

export function toPool(players) {
  const pool = { gk: [], df: [], mf: [], fw: [] };
  for (const p of players) {
    const key = POS_MAP[p.pos];
    pool[key].push(`${p.number}|${p.name}`);
  }
  return pool;
}

async function fetchTeam(slug) {
  const url = `https://worldfootballarchive.com/wc/2026/team/${encodeURIComponent(slug)}/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${slug}: HTTP ${res.status}`);
  return res.text();
}

async function main() {
  const results = {};
  const errors = [];

  for (const [id, slug] of Object.entries(TEAM_SLUGS)) {
    try {
      const html = await fetchTeam(slug);
      const players = parseFinalSquad(html);
      if (players.length === 0) {
        errors.push(`${id}: no final squad found`);
        continue;
      }
      results[id] = {
        slug,
        count: players.length,
        players,
        pool: toPool(players),
      };
      console.log(`${id}: ${players.length} players`);
      await new Promise((r) => setTimeout(r, 250));
    } catch (e) {
      errors.push(`${id}: ${e.message}`);
      console.error(`${id}: ${e.message}`);
    }
  }

  fs.writeFileSync(
    outDataPath,
    JSON.stringify({ fetchedAt: new Date().toISOString(), results, errors }, null, 2),
  );
  console.log(`\nWrote ${Object.keys(results).length} teams to ${outDataPath}`);
  if (errors.length) console.log("Errors:", errors);
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  main();
}
