let apiPromise: Promise<typeof YT> | null = null;

export function loadYouTubeApi(): Promise<typeof YT> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube API is browser-only"));
  }

  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      const finish = () => {
        if (window.YT?.Player) {
          resolve(window.YT);
          return true;
        }
        return false;
      };

      if (finish()) return;

      const previousReady = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        if (!finish()) {
          reject(new Error("YouTube API failed to initialize"));
        }
      };

      const existing = document.querySelector<HTMLScriptElement>(
        'script[src="https://www.youtube.com/iframe_api"]',
      );
      if (!existing) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        script.onerror = () => reject(new Error("YouTube API script failed to load"));
        document.head.appendChild(script);
      }

      const startedAt = Date.now();
      const poll = window.setInterval(() => {
        if (finish()) {
          window.clearInterval(poll);
          return;
        }
        if (Date.now() - startedAt > 10000) {
          window.clearInterval(poll);
          reject(new Error("YouTube API timed out"));
        }
      }, 100);
    });
  }

  return apiPromise;
}

const QUALITY_PREFERENCE = [
  "highres",
  "hd2160",
  "hd1440",
  "hd1080",
  "hd720",
  "large",
] as const;

export function applyBestPlaybackQuality(player: YT.Player) {
  const available = new Set(player.getAvailableQualityLevels?.() ?? []);
  for (const quality of QUALITY_PREFERENCE) {
    if (available.has(quality)) {
      player.setPlaybackQuality(quality);
      return;
    }
  }
}

export function fitVideoSize(containerWidth: number, containerHeight: number) {
  const videoAspect = 16 / 9;
  const containerAspect = containerWidth / containerHeight;

  if (containerAspect > videoAspect) {
    const height = containerHeight;
    return {
      width: Math.round(height * videoAspect),
      height: Math.round(height),
    };
  }

  const width = containerWidth;
  return {
    width: Math.round(width),
    height: Math.round(width / videoAspect),
  };
}
