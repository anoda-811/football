"use client";

import type { FcflixVideo } from "@/lib/fcflix/videos";
import { FCFLIX_FEATURED, FCFLIX_VIDEOS } from "@/lib/fcflix/videos";
import { useCallback, useEffect, useState } from "react";

const HERO_VIDEO_STORAGE_KEY = "fcflix-hero-video-id";

export function useHeroVideo() {
  const [heroVideoId, setHeroVideoId] = useState(FCFLIX_FEATURED.id);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(HERO_VIDEO_STORAGE_KEY);
    if (stored && FCFLIX_VIDEOS.some((video) => video.id === stored)) {
      setHeroVideoId(stored);
    }
    setReady(true);
  }, []);

  const heroVideo =
    FCFLIX_VIDEOS.find((video) => video.id === heroVideoId) ?? FCFLIX_FEATURED;

  const setHeroVideo = useCallback((video: FcflixVideo) => {
    setHeroVideoId(video.id);
    localStorage.setItem(HERO_VIDEO_STORAGE_KEY, video.id);
  }, []);

  return { heroVideo, setHeroVideo, ready };
}
