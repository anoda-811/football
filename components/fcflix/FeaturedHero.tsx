"use client";

import type { FcflixVideo } from "@/lib/fcflix/videos";
import { youtubeThumbnailUrl } from "@/lib/fcflix/videos";
import { parseYoutubeId } from "@/lib/fcflix/youtube";
import {
  applyBestPlaybackQuality,
  fitVideoSize,
  loadYouTubeApi,
} from "@/lib/fcflix/youtubeApi";
import { useEffect, useRef, useState } from "react";

type FeaturedHeroProps = {
  video: FcflixVideo;
  /** モーダル再生中など、ヒーローを止める */
  suspendPlayback?: boolean;
};

const YT_STATE_PLAYING = 1;
const YT_STATE_PAUSED = 2;
const HERO_AUDIO_STORAGE_KEY = "fcflix-hero-audio-enabled";

function readHeroAudioPreference() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(HERO_AUDIO_STORAGE_KEY) === "1";
}

function saveHeroAudioPreference(enabled: boolean) {
  localStorage.setItem(HERO_AUDIO_STORAGE_KEY, enabled ? "1" : "0");
}

export function FeaturedHero({ video, suspendPlayback = false }: FeaturedHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const suspendRef = useRef(suspendPlayback);
  const [muted, setMuted] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [playerSize, setPlayerSize] = useState({ width: 0, height: 0 });
  const [layoutReady, setLayoutReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function updateSize() {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;

      const next = fitVideoSize(width, height);
      setPlayerSize(next);
      setLayoutReady(true);

      if (playerRef.current) {
        playerRef.current.setSize(next.width, next.height);
      }
    }

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    window.addEventListener("resize", updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  useEffect(() => {
    suspendRef.current = suspendPlayback;
    const player = playerRef.current;
    if (!player || !playerReady) return;

    if (suspendPlayback) {
      player.stopVideo();
      return;
    }

    player.playVideo();
  }, [suspendPlayback, playerReady]);

  useEffect(() => {
    if (!layoutReady) return;

    let cancelled = false;
    const videoId = parseYoutubeId(video.youtubeId);
    const container = containerRef.current;
    if (!container) return;

    const { width, height } = fitVideoSize(
      container.clientWidth,
      container.clientHeight,
    );
    if (width === 0 || height === 0) return;

    async function initPlayer() {
      try {
        const YT = await loadYouTubeApi();
        if (cancelled || !playerHostRef.current) return;

        const preferAudio = readHeroAudioPreference();

        playerRef.current?.destroy();
        playerHostRef.current.innerHTML = "";

        playerRef.current = new YT.Player(playerHostRef.current, {
          videoId,
          width,
          height,
          playerVars: {
            autoplay: 1,
            mute: preferAudio ? 0 : 1,
            controls: 0,
            loop: 1,
            playlist: videoId,
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            iv_load_policy: 3,
            disablekb: 1,
            fs: 0,
            hd: 1,
            cc_load_policy: 0,
            autohide: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (cancelled) return;

              if (preferAudio) {
                event.target.unMute();
                setMuted(false);
              } else {
                event.target.mute();
                setMuted(true);
              }

              applyBestPlaybackQuality(event.target);
              if (!suspendRef.current) {
                event.target.playVideo();
              }
              setPlayerReady(true);

              if (preferAudio) {
                window.setTimeout(() => {
                  if (cancelled) return;
                  const player = event.target;
                  if (
                    player.getPlayerState() !== YT_STATE_PLAYING ||
                    player.isMuted()
                  ) {
                    player.mute();
                    setMuted(true);
                  }
                }, 800);
              }
            },
            onStateChange: (event) => {
              if (event.data === YT_STATE_PLAYING) {
                applyBestPlaybackQuality(event.target);
              }
              if (event.data === YT_STATE_PAUSED) {
                if (!suspendRef.current) {
                  event.target.playVideo();
                }
              }
            },
          },
        });
      } catch {
        if (!cancelled) setPlayerReady(false);
      }
    }

    setPlayerReady(false);
    void initPlayer();

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      setPlayerReady(false);
    };
  }, [video.youtubeId, layoutReady]);

  function toggleMute() {
    const player = playerRef.current;
    if (!player || !playerReady) return;

    if (muted) {
      player.unMute();
      applyBestPlaybackQuality(player);
      setMuted(false);
      saveHeroAudioPreference(true);
      return;
    }

    player.mute();
    setMuted(true);
    saveHeroAudioPreference(false);
  }

  return (
    <section className="absolute inset-0 overflow-hidden bg-black">
      <div ref={containerRef} className="absolute inset-0 flex items-start justify-center">
        <div
          className="relative shrink-0 overflow-hidden"
          style={
            playerSize.width > 0
              ? { width: playerSize.width, height: playerSize.height }
              : { width: "100%", maxHeight: "100%", aspectRatio: "16 / 9" }
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={youtubeThumbnailUrl(video.youtubeId, "max")}
            alt=""
            className={`absolute inset-0 h-full w-full object-contain object-top transition-opacity duration-500 ${
              playerReady ? "opacity-0" : "opacity-100"
            }`}
          />

          <div
            ref={playerHostRef}
            className="pointer-events-none absolute inset-0 overflow-hidden [&_iframe]:pointer-events-none [&_iframe]:absolute [&_iframe]:top-1/2 [&_iframe]:left-1/2 [&_iframe]:h-[145%] [&_iframe]:w-[145%] [&_iframe]:-translate-x-1/2 [&_iframe]:-translate-y-1/2 [&_iframe]:border-0"
          />

          <div className="absolute inset-0 z-[2]" aria-hidden="true" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/75 via-black/35 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#141414] via-[#141414]/55 to-transparent" />

      <button
        type="button"
        onClick={toggleMute}
        disabled={!playerReady}
        className="absolute top-14 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75 disabled:cursor-not-allowed disabled:opacity-40 sm:right-8"
        aria-label={muted ? "音をオンにする" : "ミュートにする"}
      >
        {muted ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.74 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        )}
      </button>
    </section>
  );
}
