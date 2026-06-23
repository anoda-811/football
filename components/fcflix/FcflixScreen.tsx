"use client";

import { FeaturedHero } from "@/components/fcflix/FeaturedHero";
import { FcflixHeader } from "@/components/fcflix/FcflixHeader";
import { Top10VideoRow } from "@/components/fcflix/Top10VideoRow";
import { VideoPlayerModal, useFcflixPlayer } from "@/components/fcflix/VideoPlayerModal";
import {
  FCFLIX_CATEGORIES,
  FCFLIX_HERO_CANDIDATES,
  FCFLIX_VIDEOS,
  getVideosByCategory,
  youtubeThumbnailUrl,
  type FcflixVideo,
} from "@/lib/fcflix/videos";
import { useHeroVideo } from "@/lib/fcflix/useHeroVideo";
import { usePlayerLargeScreen } from "@/lib/fcflix/usePlayerLargeScreen";
import Link from "next/link";

function VideoCard({
  video,
  onPlay,
  large = false,
}: {
  video: FcflixVideo;
  onPlay: (video: FcflixVideo) => void;
  large?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onPlay(video)}
      className={`group relative shrink-0 overflow-hidden rounded-md bg-zinc-800 text-left transition-transform hover:z-10 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 ${
        large ? "w-56 sm:w-64" : "w-40 sm:w-48"
      }`}
    >
      <div className="aspect-video w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={youtubeThumbnailUrl(video.youtubeId)}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute right-2 bottom-2 left-2 translate-y-1 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
        <p className="line-clamp-2 text-xs font-semibold text-white sm:text-sm">
          {video.title}
        </p>
      </div>
      {video.duration && (
        <span className="absolute top-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
          {video.duration}
        </span>
      )}
    </button>
  );
}

function VideoRow({
  id,
  title,
  videos,
  onPlay,
}: {
  id?: string;
  title: string;
  videos: FcflixVideo[];
  onPlay: (video: FcflixVideo) => void;
}) {
  if (videos.length === 0) return null;

  return (
    <section id={id} className="mb-8 scroll-mt-20">
      <h2 className="mb-3 px-4 text-base font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:px-8 sm:text-lg">
        {title}
      </h2>
      <div className="flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:gap-3 sm:px-8 [&::-webkit-scrollbar]:hidden">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onPlay={onPlay} />
        ))}
      </div>
    </section>
  );
}

export function FcflixScreen() {
  const { playingVideo, openVideo, closePlayer } = useFcflixPlayer();
  const { heroVideo, setHeroVideo } = useHeroVideo();
  const { playerLargeScreen, setPlayerLargeScreen } = usePlayerLargeScreen();

  return (
    <div className="fcflix-root min-h-dvh bg-[#141414] text-white">
      <div id="fcflix-top" className="relative h-[100dvh] min-h-[40rem] scroll-mt-0">
        <FeaturedHero video={heroVideo} suspendPlayback={playingVideo !== null} />

        <div className="pointer-events-none absolute inset-0 z-10 grid min-w-0 grid-rows-[3.5rem_minmax(0,1fr)_auto]">
          <div aria-hidden />

          <div className="flex items-end px-4 pb-6 sm:px-8 sm:pb-8">
            <div className="pointer-events-auto max-w-xl">
              <p className="mb-2 text-xs font-semibold tracking-widest text-red-500 uppercase sm:text-sm">
                注目の動画
              </p>
              <h1 className="text-[clamp(1.5rem,4vw,3rem)] font-black tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
                {heroVideo.title}
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
                {heroVideo.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => openVideo(heroVideo)}
                  className="inline-flex items-center gap-2 rounded bg-white px-5 py-2 text-sm font-bold text-black transition-colors hover:bg-white/90 sm:px-6 sm:py-2.5 sm:text-base"
                >
                  <span aria-hidden>▶</span>
                  再生
                </button>
                <button
                  type="button"
                  onClick={() => openVideo(heroVideo)}
                  className="inline-flex items-center gap-2 rounded border border-white/40 bg-white/15 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25 sm:px-6 sm:py-2.5 sm:text-base"
                >
                  詳細
                </button>
              </div>

              <label className="mt-4 flex max-w-md flex-col gap-1.5">
                <span className="text-xs font-medium text-white/70">
                  ヒーローで流す動画
                </span>
                <select
                  value={heroVideo.id}
                  onChange={(event) => {
                    const next = FCFLIX_HERO_CANDIDATES.find(
                      (video) => video.id === event.target.value,
                    );
                    if (next) setHeroVideo(next);
                  }}
                  className="w-full rounded-md border border-white/30 bg-black/55 px-3 py-2 text-sm text-white backdrop-blur-sm outline-none focus:border-red-500/70 focus:ring-2 focus:ring-red-500/30"
                >
                  {FCFLIX_HERO_CANDIDATES.map((video) => (
                    <option key={video.id} value={video.id} className="bg-zinc-900">
                      {video.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="pointer-events-auto min-w-0 w-full pb-4 sm:pb-6">
            <Top10VideoRow
              id="fcflix-recommended"
              title="おすすめ TOP 10"
              videos={FCFLIX_VIDEOS}
              onPlay={openVideo}
            />
          </div>
        </div>
      </div>

      <FcflixHeader
        playerLargeScreen={playerLargeScreen}
        onPlayerLargeScreenChange={setPlayerLargeScreen}
      />

      <main className="relative z-10 pb-12 pt-6">

        {FCFLIX_CATEGORIES.map((category) => (
          <VideoRow
            key={category}
            id={`fcflix-${category}`}
            title={category}
            videos={getVideosByCategory(category)}
            onPlay={openVideo}
          />
        ))}

        <VideoRow
          id="fcflix-rewatch"
          title="もう一度見る"
          videos={[...FCFLIX_VIDEOS].reverse().slice(0, 6)}
          onPlay={openVideo}
        />
      </main>

      <div className="fixed right-4 bottom-4 z-30 sm:hidden">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg border border-white/20 bg-black/70 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
        >
          ← アプリ一覧
        </Link>
      </div>

      <VideoPlayerModal
        video={playingVideo}
        onClose={closePlayer}
        heroVideoId={heroVideo.id}
        onSetHeroVideo={setHeroVideo}
        defaultLargeScreen={playerLargeScreen}
      />
    </div>
  );
}
