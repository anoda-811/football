"use client";

import { useCallback, useEffect, useState } from "react";

const PLAYER_LARGE_SCREEN_STORAGE_KEY = "fcflix-player-large-screen";

export function usePlayerLargeScreen() {
  const [largeScreen, setLargeScreen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLargeScreen(localStorage.getItem(PLAYER_LARGE_SCREEN_STORAGE_KEY) === "1");
    setReady(true);
  }, []);

  const setPlayerLargeScreen = useCallback((enabled: boolean) => {
    setLargeScreen(enabled);
    localStorage.setItem(PLAYER_LARGE_SCREEN_STORAGE_KEY, enabled ? "1" : "0");
  }, []);

  return { playerLargeScreen: largeScreen, setPlayerLargeScreen, ready };
}
