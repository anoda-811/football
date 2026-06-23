"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

const MOBILE_MAX_WIDTH = 1023;

type LayoutMode = "desktop" | "portrait" | "landscape";

function getLayoutMode(): LayoutMode {
  if (typeof window === "undefined") return "desktop";
  if (window.innerWidth > MOBILE_MAX_WIDTH) return "desktop";
  const portraitQuery = window.matchMedia("(orientation: portrait)").matches;
  const portraitBySize = window.innerHeight > window.innerWidth;
  return portraitQuery || portraitBySize ? "portrait" : "landscape";
}

type MobileBoardScalerProps = {
  children: ReactNode;
};

export function MobileBoardScaler({ children }: MobileBoardScalerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("desktop");
  const [scale, setScale] = useState(1);
  const [scaledSize, setScaledSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    function update() {
      const mode = getLayoutMode();
      setLayoutMode(mode);

      if (mode !== "landscape") {
        setScale(1);
        setScaledSize({ width: 0, height: 0 });
        return;
      }

      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;

      const naturalWidth = content.scrollWidth;
      const naturalHeight = content.scrollHeight;
      if (naturalWidth === 0 || naturalHeight === 0) return;

      const padding = 4;
      const availableWidth = container.clientWidth - padding;
      const availableHeight = container.clientHeight - padding;
      const nextScale = Math.min(
        availableWidth / naturalWidth,
        availableHeight / naturalHeight,
        1,
      );

      setScale(nextScale);
      setScaledSize({
        width: Math.ceil(naturalWidth * nextScale),
        height: Math.ceil(naturalHeight * nextScale),
      });
    }

    const runUpdate = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(update);
      });
    };

    runUpdate();

    const container = containerRef.current;
    const content = contentRef.current;
    const observer = new ResizeObserver(runUpdate);
    if (container) observer.observe(container);
    if (content) observer.observe(content);

    window.addEventListener("resize", runUpdate);
    window.visualViewport?.addEventListener("resize", runUpdate);
    window.addEventListener("orientationchange", runUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", runUpdate);
      window.visualViewport?.removeEventListener("resize", runUpdate);
      window.removeEventListener("orientationchange", runUpdate);
    };
  }, [children]);

  if (layoutMode === "portrait") {
    return (
      <div className="flex h-full min-h-0 flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="mb-4 text-5xl" aria-hidden>
          📱↻
        </div>
        <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
          横向きにすると操作しやすくなります
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          スマホを横向きにして戦術ボードを表示してください
        </p>
      </div>
    );
  }

  if (layoutMode === "landscape") {
    return (
      <div
        ref={containerRef}
        className="flex h-full min-h-0 flex-1 items-start justify-center overflow-hidden"
      >
        <div
          className="shrink-0"
          style={{
            width: scaledSize.width || undefined,
            height: scaledSize.height || undefined,
          }}
        >
          <div
            ref={contentRef}
            className="tactics-board-scaled-content w-max"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
