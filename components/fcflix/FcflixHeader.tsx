"use client";

import { AppListBackButton } from "@/components/AppListBackButton";
import { FcflixLogo } from "@/components/fcflix/FcflixLogo";
import { FCFLIX_CATEGORIES } from "@/lib/fcflix/videos";
import { useEffect, useState } from "react";

type FcflixHeaderProps = {
  playerLargeScreen?: boolean;
  onPlayerLargeScreenChange?: (enabled: boolean) => void;
};

type NavItem = {
  id: string;
  label: string;
  targetId: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "ホーム", targetId: "fcflix-top" },
  { id: "recommended", label: "おすすめ", targetId: "fcflix-recommended" },
  ...FCFLIX_CATEGORIES.map((category) => ({
    id: category,
    label: category,
    targetId: `fcflix-${category}`,
  })),
  { id: "rewatch", label: "もう一度見る", targetId: "fcflix-rewatch" },
];

function readScrollOffset() {
  return Math.max(
    window.scrollY,
    document.documentElement.scrollTop,
    document.body.scrollTop,
  );
}

export function FcflixHeader({
  playerLargeScreen = false,
  onPlayerLargeScreenChange,
}: FcflixHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("home");

  useEffect(() => {
    const hero = document.getElementById("fcflix-top");

    function update() {
      const offset = readScrollOffset();
      const heroTop = hero?.getBoundingClientRect().top ?? 0;
      setScrolled(offset > 0 || heroTop < -1);
    }

    update();
    window.addEventListener("scroll", update, { passive: true, capture: true });
    document.addEventListener("scroll", update, { passive: true, capture: true });

    const observer = hero
      ? new IntersectionObserver(() => update(), {
          threshold: [0, 0.01, 0.1, 0.25, 0.5, 1],
        })
      : null;
    if (hero && observer) observer.observe(hero);

    return () => {
      window.removeEventListener("scroll", update, { capture: true });
      document.removeEventListener("scroll", update, { capture: true });
      observer?.disconnect();
    };
  }, []);

  function scrollToSection(item: NavItem) {
    const target = document.getElementById(item.targetId);
    if (!target) return;

    const headerOffset = 72;
    const top = target.getBoundingClientRect().top + readScrollOffset() - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveId(item.id);
  }

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? "bg-[#141414] shadow-md" : "bg-transparent"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3 sm:gap-5 sm:px-8">
        <button
          type="button"
          onClick={() => scrollToSection(NAV_ITEMS[0])}
          className="shrink-0 rounded outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          aria-label="Fcflix ホームへ"
        >
          <FcflixLogo />
        </button>

        <nav
          aria-label="Fcflix メニュー"
          className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item)}
                className={`shrink-0 text-xs font-medium transition-colors sm:text-sm ${
                  scrolled ? "" : "drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]"
                } ${
                  isActive
                    ? "font-semibold text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {onPlayerLargeScreenChange && (
          <div
            className="flex shrink-0 items-center rounded-md border border-white/25 bg-black/35 p-0.5 backdrop-blur-sm"
            role="group"
            aria-label="モーダル再生サイズ"
          >
            <button
              type="button"
              onClick={() => onPlayerLargeScreenChange(false)}
              aria-pressed={!playerLargeScreen}
              className={`rounded px-2 py-1 text-[10px] font-semibold transition-colors sm:px-2.5 sm:text-xs ${
                !playerLargeScreen
                  ? "bg-white text-black"
                  : "text-white/75 hover:text-white"
              }`}
            >
              通常
            </button>
            <button
              type="button"
              onClick={() => onPlayerLargeScreenChange(true)}
              aria-pressed={playerLargeScreen}
              className={`rounded px-2 py-1 text-[10px] font-semibold transition-colors sm:px-2.5 sm:text-xs ${
                playerLargeScreen
                  ? "bg-white text-black"
                  : "text-white/75 hover:text-white"
              }`}
            >
              大画面
            </button>
          </div>
        )}

        <AppListBackButton variant="dark" className="hidden shrink-0 sm:inline-flex" />
      </div>
    </header>
  );
}
