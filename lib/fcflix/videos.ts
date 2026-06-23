import { parseYoutubeId, youtubeEmbedUrl, youtubeWatchUrl } from "./youtube";

export type FcflixVideo = {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  category: string;
  duration?: string;
};

export const FCFLIX_CATEGORIES = [
  "サッカーソング",
  "ワールドカップ",
  "開会式パフォーマンス",
  "チャンピオンズリーグ",
  "プレミアリーグ",
  "レジェンド",
  "GOAT戦術分析",
] as const;

export const FCFLIX_VIDEOS: FcflixVideo[] = [
  {
    id: "song-karasu",
    youtubeId: "YjPMupS1Lg4",
    title: "米津玄師 - 烏　Kenshi Yonezu - Karasu",
    description: "2026 NHK サッカーテーマ",
    category: "サッカーソング",
    duration: "8:01",
  },
  {
    id: "song-kira",
    youtubeId: "qpcz3-iDUP8",
    title: "【Ado】綺羅（KIRA）",
    description: "アディダス 日本代表2026 ユニフォームソング",
    category: "サッカーソング",
    duration: "3:45",
  },
  {
    id: "song-waka-waka",
    youtubeId: "pRpeEdMmmQ0",
    title: "Shakira - Waka Waka",
    description: "2010年南アフリカW杯 公式ソング",
    category: "サッカーソング",
    duration: "3:30",
  },
  {
    id: "song-dai-dai",
    youtubeId: "fcnDmrtj6Sk",
    title: "Shakira, Burna Boy - Dai Dai",
    description: "2026 FIFAワールドカップ 公式ソング",
    category: "サッカーソング",
    duration: "4:00",
  },
  {
    id: "song-goals",
    youtubeId: "GpADSdd68UI",
    title: "クリープハイプ「おやすみ泣き声、さよなら歌姫」",
    description: "クリープハイプ 3rdシングル",
    category: "サッカーソング",
    duration: "4:52",
  },
  {
    id: "song-nippon",
    youtubeId: "p-RLC9ZgjhY",
    title: "Sheena Ringo - NIPPON",
    description: "椎名林檎 — 2014年ブラジルW杯 日本代表応援ソング",
    category: "サッカーソング",
    duration: "4:10",
  },
  {
    id: "song-we-are-one",
    youtubeId: "TGtWWb9emYI",
    title: "Pitbull - We Are One (Ole Ola)",
    description: "2014年ブラジルW杯 公式ソング",
    category: "サッカーソング",
    duration: "3:42",
  },
  {
    id: "song-live-it-up",
    youtubeId: "V15BYnSr0P8",
    title: "Live It Up",
    description: "2018年ロシアW杯 公式ソング（Nicky Jam × Will Smith）",
    category: "サッカーソング",
    duration: "3:56",
  },
  {
    id: "song-cup-of-life",
    youtubeId: "dZDj2CnG5dE",
    title: "Ricky Martin - La Copa de la Vida",
    description: "1998年フランスW杯 公式ソング",
    category: "サッカーソング",
    duration: "4:27",
  },
  {
    id: "song-wavin-flag",
    youtubeId: "WTJSt4wP2ME",
    title: "K'NAAN - Wavin' Flag",
    description: "2010年W杯 Coca-Cola セレブレーションミックス",
    category: "サッカーソング",
    duration: "3:45",
  },
  {
    id: "song-time-of-our-lives",
    youtubeId: "4aOxDHqWyK0",
    title: "The Time of Our Lives",
    description: "2006年ドイツW杯 公式ソング（Il Divo × Toni Braxton）",
    category: "サッカーソング",
    duration: "3:23",
  },
  {
    id: "song-arhbo",
    youtubeId: "e8laLiWolGg",
    title: "Arhbo",
    description: "2022年カタールW杯 公式サウンドトラック（Ozuna × GIMS）",
    category: "サッカーソング",
    duration: "3:46",
  },
  {
    id: "wc-iniesta-2010",
    youtubeId: "c0ym82UHAA4",
    title: "イニエスタ 決勝ゴール",
    description: "2010 FIFAワールドカップ決勝、スペイン初優勝のゴール。",
    category: "ワールドカップ",
    duration: "2:18",
  },
  {
    id: "ucl-zidane-volley",
    youtubeId: "prx4v_4N-zM",
    title: "ジダン ボレー弾",
    description: "2002 UEFAチャンピオンズリーグ決勝、レアル・マドリードの名ゴール。",
    category: "チャンピオンズリーグ",
    duration: "1:05",
  },
  {
    id: "legend-messi-getafe",
    youtubeId: "aSK5v2gl1ik",
    title: "メッシ ゲタフェ戦ゴール",
    description: "マラドーナの1986年ゴールを彷彿とさせるドリブルゴール。",
    category: "レジェンド",
    duration: "1:22",
  },
  {
    id: "legend-ronaldo-freekick",
    youtubeId: "0e3GPea1Tyg",
    title: "C・ロナウド フリーキック",
    description: "ポーツマス戦で決めた、お馴染みのフリーキック。",
    category: "レジェンド",
    duration: "0:58",
  },
  {
    id: "ucl-ronaldo-bicycle",
    youtubeId: "YYtKZHevtvQ",
    title: "C・ロナウド 自転車蹴り",
    description: "ユベントス戦での華麗なオーバーヘッドキック。",
    category: "チャンピオンズリーグ",
    duration: "1:10",
  },
  {
    id: "wc-france-2018",
    youtubeId: "z7DIMv2N8qE",
    title: "フランス 2018年W杯ハイライト",
    description: "フランスが二度目の星を手にした2018年大会のハイライト。",
    category: "ワールドカップ",
    duration: "6:30",
  },
  {
    id: "ceremony-dai-dai-mexico",
    youtubeId: "Sc0EBlXORQM",
    title: "Shakira & Burna Boy - Dai Dai",
    description: "2026 FIFAワールドカップ メキシコシティ開会式パフォーマンス",
    category: "開会式パフォーマンス",
  },
  {
    id: "ceremony-goals-la",
    youtubeId: "mSgfvdBlysI",
    title: "LISA, Anitta, Rema - Goals",
    description: "2026 FIFAワールドカップ ロサンゼルス開会式パフォーマンス",
    category: "開会式パフォーマンス",
  },
  {
    id: "ceremony-alessia-toronto",
    youtubeId: "UAUi2jnCQIE",
    title: "Alessia Cara - Wild Things / Here",
    description: "2026 FIFAワールドカップ トロント開会式パフォーマンス",
    category: "開会式パフォーマンス",
  },
  {
    id: "pl-best-goals",
    youtubeId: "wEKnLrU-16U",
    title: "プレミアリーグ 名ゴール集",
    description: "プレミアリーグの歴代ベストゴールを厳選。",
    category: "プレミアリーグ",
    duration: "8:20",
  },
  {
    id: "legend-henry-arsenal",
    youtubeId: "K8rGnc64ah8",
    title: "ティエリ・アンリ ベストプレー",
    description: "アーセナルのレジェンド、アンリの名場面集。",
    category: "レジェンド",
    duration: "7:15",
  },
  {
    id: "goat-japan-spain",
    youtubeId: "zrkn99RCxZU",
    title: "日本 VS スペイン 狂気のプレスと蒼い壁",
    description: "GOAT football tactics — 2022W杯 日本代表 vs スペイン戦の戦術徹底解説。",
    category: "GOAT戦術分析",
    duration: "24:28",
  },
  {
    id: "goat-4141-gameplan",
    youtubeId: "5mad6zRAK6o",
    title: "完成された4141対策とゲームプラン",
    description: "GOAT football tactics — 4141システムへの対策と試合設計を徹底分析。",
    category: "GOAT戦術分析",
    duration: "12:08",
  },
  {
    id: "goat-germany-japan",
    youtubeId: "7FUFsYs4aBU",
    title: "ドイツVS日本 背水の戦術",
    description: "GOAT football tactics — 劇的勝利に導いた奇策と戦術的駆引きを解説。",
    category: "GOAT戦術分析",
    duration: "18:58",
  },
  {
    id: "goat-bielsa-leeds-city",
    youtubeId: "1AgDgz6_ZfE",
    title: "ビエルサ戦術 — リーズ vs マンC",
    description: "GOAT football tactics — エル・ロコ・ビエルサの戦術哲学を名試合で分析。",
    category: "GOAT戦術分析",
    duration: "23:07",
  },
  {
    id: "goat-japan-netherlands",
    youtubeId: "PJ-74_o2lg4",
    title: "日本 VS オランダ 騙し合いと鎌田大地の罠",
    description: "GOAT football tactics — 世界最高峰の駆引きと鎌田大地の役割を徹底解説。",
    category: "GOAT戦術分析",
    duration: "28:44",
  },
  {
    id: "goat-guardiola-barca-mu",
    youtubeId: "PmvFc0ChAM0",
    title: "グァルディオラ戦術 — バルサ vs MU",
    description: "GOAT football tactics — ペップ・グァルディオラの戦術をCL決勝で分析。",
    category: "GOAT戦術分析",
    duration: "22:56",
  },
  {
    id: "goat-xavi-playstyle",
    youtubeId: "8GZY3INIo9E",
    title: "シャビ・エルナンデスのプレースタイル",
    description: "GOAT football tactics — バルセロナの心臓、チャビの戦術的役割を解説。",
    category: "GOAT戦術分析",
    duration: "45:19",
  },
  {
    id: "goat-serbia-4141",
    youtubeId: "cAJlTXL_w58",
    title: "シリア戦 4141対策の全ゴール解説",
    description: "GOAT football tactics — 日本代表 vs セルビア戦の内容とゴールシーンを分析。",
    category: "GOAT戦術分析",
    duration: "5:44",
  },
  {
    id: "goat-dejong-pass-quiz",
    youtubeId: "p8TaU_Rgox8",
    title: "どうやってパスもらう？（デヨング・ロベルト）",
    description: "GOAT football tactics — サッカークイズで学ぶポジショニングと連携。",
    category: "GOAT戦術分析",
    duration: "7:06",
  },
  {
    id: "goat-dest-sideback",
    youtubeId: "CfWXdg0tOJk",
    title: "セルジーニョ・デストのサイドバックの動き",
    description: "GOAT football tactics — サイドバックの動きと役割をバルサの選手で解説。",
    category: "GOAT戦術分析",
    duration: "15:16",
  },
];

export const FCFLIX_HERO_CANDIDATES = FCFLIX_VIDEOS;

export const FCFLIX_FEATURED = FCFLIX_VIDEOS[0];

export { youtubeEmbedUrl, youtubeWatchUrl } from "./youtube";

export function youtubeThumbnailUrl(youtubeId: string, quality: "hq" | "max" = "hq") {
  const file = quality === "max" ? "maxresdefault" : "hqdefault";
  return `https://img.youtube.com/vi/${parseYoutubeId(youtubeId)}/${file}.jpg`;
}

export function getVideosByCategory(category: string) {
  return FCFLIX_VIDEOS.filter((video) => video.category === category);
}
