export type AppEntry = {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: string;
  iconBgClass: string;
};

export const APP_ENTRIES: AppEntry[] = [
  {
    id: "tactics",
    name: "戦術ボード",
    description: "試合ごとにフォーメーションと戦術を管理",
    href: "/tactics",
    icon: "⚽",
    iconBgClass: "bg-green-600",
  },
  {
    id: "fcflix",
    name: "Fcflix",
    description: "サッカー動画をNetflix風に楽しむ",
    href: "/fcflix",
    icon: "",
    iconBgClass: "bg-black",
  },
];
