export function parseYoutubeId(input: string): string {
  const trimmed = input.trim();
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.slice(1).split("/")[0] ?? trimmed;
    }
    const id = url.searchParams.get("v");
    if (id) return id;
  } catch {
    // Not a URL — fall through.
  }

  return trimmed;
}

export function youtubeWatchUrl(youtubeId: string) {
  return `https://www.youtube.com/watch?v=${parseYoutubeId(youtubeId)}`;
}

type EmbedOptions = {
  autoplay?: boolean;
  mute?: boolean;
  origin?: string;
  controls?: boolean;
  loop?: boolean;
};

export function youtubeEmbedUrl(youtubeId: string, options?: EmbedOptions) {
  const id = parseYoutubeId(youtubeId);
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    enablejsapi: "1",
    iv_load_policy: "3",
  });

  if (options?.autoplay) {
    params.set("autoplay", "1");
  }
  if (options?.mute) {
    params.set("mute", "1");
  }
  if (options?.controls === false) {
    params.set("controls", "0");
    params.set("disablekb", "1");
    params.set("fs", "0");
  }
  if (options?.loop) {
    params.set("loop", "1");
    params.set("playlist", id);
  }
  if (options?.origin) {
    params.set("origin", options.origin);
  }

  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}
