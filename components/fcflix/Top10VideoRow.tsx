"use client";

import type { FcflixVideo } from "@/lib/fcflix/videos";
import { youtubeThumbnailUrl } from "@/lib/fcflix/videos";
import { useCallback, useEffect, useRef, useState } from "react";

type Top10VideoRowProps = {
  id?: string;
  title: string;
  videos: FcflixVideo[];
  onPlay: (video: FcflixVideo) => void;
};

function ScrollArrow({
  direction,
  onClick,
  label,
}: {
  direction: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-[58%] z-30 flex h-[clamp(11rem,24vw,16rem)] w-10 -translate-y-1/2 items-center justify-center text-4xl font-light leading-none text-white transition-colors hover:bg-black/80 sm:w-14 ${
        direction === "left"
          ? "left-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent"
          : "right-0 bg-gradient-to-l from-black/95 via-black/70 to-transparent"
      }`}
    >
      {direction === "left" ? "‹" : "›"}
    </button>
  );
}

function Top10Card({
  rank,
  video,
  onPlay,
}: {
  rank: number;
  video: FcflixVideo;
  onPlay: (video: FcflixVideo) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onPlay(video)}
      className="group relative h-[clamp(11rem,24vw,16rem)] w-[clamp(10.5rem,25vw,14.5rem)] shrink-0 transition-transform hover:z-10 hover:scale-[1.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"
      aria-label={`${rank}位: ${video.title}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 z-0 w-[52%] select-none text-center text-[clamp(5.5rem,13vw,9rem)] leading-[0.75] font-black tracking-tighter text-[#181818]"
        style={{ WebkitTextStroke: "2px #6b6b6b" }}
      >
        {rank}
      </span>

      <div className="absolute right-0 bottom-0 z-10 h-full w-[64%] overflow-hidden rounded-md bg-zinc-800 shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={youtubeThumbnailUrl(video.youtubeId)}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <p className="absolute right-1 bottom-1 left-1 line-clamp-2 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 sm:text-xs">
          {video.title}
        </p>
        {video.duration && (
          <span className="absolute top-1.5 right-1.5 rounded bg-black/75 px-1 py-0.5 text-[9px] font-medium text-white sm:text-[10px]">
            {video.duration}
          </span>
        )}
      </div>
    </button>
  );
}

export function Top10VideoRow({ id, title, videos, onPlay }: Top10VideoRowProps) {
  const top10 = videos.slice(0, 10);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(maxScroll > 4 && el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const scheduleUpdate = () => {
      updateScrollState();
      requestAnimationFrame(updateScrollState);
    };

    scheduleUpdate();
    const timeoutIds = [120, 400, 900].map((ms) =>
      window.setTimeout(scheduleUpdate, ms),
    );

    el.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(el);
    for (const child of el.children) {
      observer.observe(child);
    }

    const images = el.querySelectorAll("img");
    images.forEach((image) => {
      image.addEventListener("load", scheduleUpdate);
    });

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      el.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      observer.disconnect();
      images.forEach((image) => {
        image.removeEventListener("load", scheduleUpdate);
      });
    };
  }, [updateScrollState, top10.length]);

  function scrollByPage(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction * el.clientWidth * 0.82,
      behavior: "smooth",
    });
  }

  if (top10.length === 0) return null;

  return (
    <section id={id} className="min-w-0 scroll-mt-20">
      <h2 className="mb-2 px-4 text-[clamp(1.5rem,3.2vw,2.25rem)] font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] sm:px-8">
        {title}
      </h2>

      <div className="relative min-w-0 w-full">
        {canScrollLeft && (
          <ScrollArrow
            direction="left"
            label="左にスクロール"
            onClick={() => scrollByPage(-1)}
          />
        )}
        {canScrollRight && (
          <ScrollArrow
            direction="right"
            label="右にスクロール"
            onClick={() => scrollByPage(1)}
          />
        )}

        <div
          ref={scrollerRef}
          className="flex w-full min-w-0 items-end gap-[clamp(0.5rem,1.2vw,1rem)] overflow-x-auto overflow-y-visible px-4 py-2 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
        >
          {top10.map((video, index) => (
            <Top10Card
              key={video.id}
              rank={index + 1}
              video={video}
              onPlay={onPlay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
