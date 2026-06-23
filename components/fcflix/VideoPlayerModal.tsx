"use client";

import type { FcflixVideo } from "@/lib/fcflix/videos";
import {
  youtubeEmbedUrl,
  youtubeWatchUrl,
} from "@/lib/fcflix/videos";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type VideoPlayerModalProps = {
  video: FcflixVideo | null;
  onClose: () => void;
  heroVideoId?: string;
  onSetHeroVideo?: (video: FcflixVideo) => void;
  defaultLargeScreen?: boolean;
};

export function VideoPlayerModal({
  video,
  onClose,
  heroVideoId,
  onSetHeroVideo,
  defaultLargeScreen = false,
}: VideoPlayerModalProps) {
  const [largeScreen, setLargeScreen] = useState(defaultLargeScreen);

  useEffect(() => {
    if (!video) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [video, onClose]);

  useEffect(() => {
    setLargeScreen(defaultLargeScreen);
  }, [video?.id, defaultLargeScreen]);

  if (!video || typeof document === "undefined") return null;

  const embedUrl = youtubeEmbedUrl(video.youtubeId, {
    origin: window.location.origin,
    autoplay: true,
  });

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/92 transition-all ${
        largeScreen ? "p-2 sm:p-3" : "p-4 sm:p-6"
      }`}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`relative transition-all duration-300 ${
          largeScreen
            ? "w-[min(98vw,calc(88vh*16/9))]"
            : "w-[min(94vw,72rem)]"
        }`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={video.title}
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setLargeScreen((current) => !current)}
              className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20 sm:px-4 sm:py-2 sm:text-sm"
            >
              {largeScreen ? (
                <>
                  <span aria-hidden>⤡</span>
                  通常サイズ
                </>
              ) : (
                <>
                  <span aria-hidden>⤢</span>
                  大画面で流す
                </>
              )}
            </button>

            {onSetHeroVideo && (
              <button
                type="button"
                onClick={() => onSetHeroVideo(video)}
                disabled={heroVideoId === video.id}
                className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20 disabled:cursor-default disabled:border-red-500/50 disabled:bg-red-500/20 disabled:text-red-100 sm:px-4 sm:py-2 sm:text-sm"
              >
                <span aria-hidden>★</span>
                {heroVideoId === video.id ? "ヒーロー再生中" : "ヒーローで流す"}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-white/80 transition-colors hover:text-white"
          >
            閉じる ✕
          </button>
        </div>

        <div className="relative aspect-video overflow-hidden rounded-lg bg-black shadow-2xl ring-1 ring-white/10">
          <iframe
            key={video.id}
            src={embedUrl}
            title={video.title}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        <p className="mt-2 text-center text-xs text-white/50">
          再生できない場合は動画の埋め込みが無効な可能性があります
        </p>

        <div
          className={`mt-3 flex flex-wrap items-start justify-between gap-3 px-1 transition-opacity ${
            largeScreen ? "opacity-90" : "opacity-100"
          }`}
        >
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-white sm:text-xl">{video.title}</h2>
            <p className="mt-1 text-sm text-white/70">{video.description}</p>
          </div>
          <a
            href={youtubeWatchUrl(video.youtubeId)}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded border border-white/30 px-3 py-1.5 text-xs font-semibold text-white/90 transition-colors hover:bg-white/10 sm:text-sm"
          >
            YouTubeで開く
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function useFcflixPlayer() {
  const [playingVideo, setPlayingVideo] = useState<FcflixVideo | null>(null);

  function openVideo(video: FcflixVideo) {
    setPlayingVideo(video);
  }

  function closePlayer() {
    setPlayingVideo(null);
  }

  return {
    playingVideo,
    openVideo,
    closePlayer,
  };
}
