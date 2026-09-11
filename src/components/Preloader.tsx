import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface PreloaderScreenProps {
  progress: number;
}

interface PreloaderResult {
  isLoaded: boolean;
  progress: number;
}

function loadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => resolve();
    image.onerror = () => resolve();

    image.src = src;
  });
}

function loadVideoMetadata(src: string): Promise<void> {
  return new Promise((resolve) => {
    const video = document.createElement("video");

    let finished = false;

    const finish = () => {
      if (finished) return;

      finished = true;

      video.removeEventListener("loadedmetadata", finish);
      video.removeEventListener("error", finish);

      video.src = "";
      video.load();

      resolve();
    };

    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    video.addEventListener("loadedmetadata", finish);
    video.addEventListener("error", finish);

    video.src = src;
    video.load();
  });
}

function warmBinaryAsset(src: string): Promise<void> {
  return fetch(src, {
    method: "GET",
    cache: "force-cache",
  })
    .then(() => undefined)
    .catch(() => undefined);
}

function loadAsset(src: string): Promise<void> {
  if (/\.(jpg|jpeg|png|webp|avif|svg)$/i.test(src)) {
    return loadImage(src);
  }

  if (/\.(mp4|webm)$/i.test(src)) {
    return loadVideoMetadata(src);
  }

  if (/\.glb$/i.test(src)) {
    return warmBinaryAsset(src);
  }

  return Promise.resolve();
}

export function useConstructionPreloader(
  assets: string[],
): PreloaderResult {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function preload() {
      if (assets.length === 0) {
        setProgress(100);
        setIsLoaded(true);
        return;
      }

      let completed = 0;

      const updateProgress = () => {
        if (cancelled) return;

        completed += 1;

        setProgress(
          Math.round((completed / assets.length) * 100),
        );
      };

      await Promise.all(
        assets.map(async (asset) => {
          await loadAsset(asset);
          updateProgress();
        }),
      );

      if (cancelled) return;

      setProgress(100);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) {
            setIsLoaded(true);
          }
        });
      });
    }

    preload();

    return () => {
      cancelled = true;
    };
  }, [assets]);

  return {
    isLoaded,
    progress,
  };
}

export function PreloaderScreen({
  progress,
}: PreloaderScreenProps) {
  const isReady = progress >= 100;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.8,
          ease: [0.76, 0, 0.24, 1],
        },
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#18324A]"
    >
      <div className="w-[280px] max-w-[calc(100vw-48px)]">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="font-mono text-[9px] tracking-[0.3em] text-white/40">
              APEX
            </p>

            <h1 className="mt-1 font-sans text-xl font-medium tracking-[0.12em] text-[#F5F3EE]">
              STRUCTURAL
            </h1>
          </div>

          <span className="font-mono text-[11px] tabular-nums text-[#D89A24]">
            {String(progress).padStart(3, "0")}%
          </span>
        </div>

        <div className="relative h-px w-full overflow-hidden bg-white/10">
          <motion.div
            className="absolute left-0 top-0 h-px bg-[#D89A24]"
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="font-mono text-[8px] tracking-[0.22em] text-white/40">
            {isReady
              ? "SYSTEM READY"
              : "INITIALIZING STRUCTURAL SYSTEM"}
          </p>

          <span className="font-mono text-[8px] tracking-widest text-white/30">
            {isReady ? "READY" : "LOADING"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}