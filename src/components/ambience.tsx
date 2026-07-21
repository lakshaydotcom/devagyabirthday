import { useEffect, useMemo, useRef, useState } from "react";
import songAsset from "@/assets/Chahun_Main_Ya_Naa_Aashiqui_2_320_Kbps.mp3.asset.json";

// Background song — "Chahun Main Ya Naa" by Arijit Singh (Aashiqui 2).
// A romantic, nostalgic track that matches this website's warm, emotional mood.
// Replace the imported asset below if you'd like a different song later.
const SONG_URL = songAsset.url;

export function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const [autoPlayBlocked, setAutoPlayBlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const a = new Audio(SONG_URL);
    a.loop = true;
    a.volume = 0.35;
    a.preload = "auto";
    audioRef.current = a;

    // Attempt autoplay on first load. Browsers may block it until the user interacts.
    const tryAutoPlay = async () => {
      try {
        await a.play();
        setPlaying(true);
      } catch {
        setAutoPlayBlocked(true);
      }
    };
    void tryAutoPlay();

    return () => { a.pause(); audioRef.current = null; };
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      try {
        await a.play();
        setPlaying(true);
        setAutoPlayBlocked(false);
      } catch {
        setPlaying(false);
      }
    }
  };

  return (
    <>
      <button
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
        className={`glass fixed bottom-5 right-5 z-50 grid h-12 w-12 place-items-center rounded-full transition-transform hover:scale-110 ${autoPlayBlocked ? "animate-bounce" : ""}`}
      >
        <span className="text-lg">{playing ? "♪" : "♫"}</span>
        <span
          className={`pointer-events-none absolute inset-0 rounded-full ${playing ? "animate-pulse" : ""}`}
          style={{ boxShadow: playing ? "0 0 30px var(--rose)" : "none" }}
        />
      </button>
      {autoPlayBlocked && (
        <button
          onClick={toggle}
          className="glass fixed bottom-20 right-5 z-50 max-w-[180px] rounded-2xl px-4 py-2 text-xs font-medium text-rose-700 shadow-lg animate-fade-in"
        >
          Tap to play Devagya’s song 🎵
        </button>
      )}
    </>
  );
}

export function Particles({ count = 18 }: { count?: number }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 4 + Math.random() * 10,
        delay: Math.random() * 12,
        duration: 14 + Math.random() * 14,
        drift: (Math.random() - 0.5) * 120,
        hue: Math.random() > 0.5 ? "var(--rose)" : "var(--lavender)",
      })),
    [count],
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {parts.map((p) => (
        <span
          key={p.id}
          className="particle absolute rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${p.hue}, transparent 70%)`,
            opacity: 0.7,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            // @ts-expect-error css var
            "--drift": `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

export function Lanterns({ count = 14 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 16 + Math.random() * 10,
        scale: 0.6 + Math.random() * 0.7,
      })),
    [count],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((l) => (
        <div
          key={l.id}
          className="particle absolute"
          style={{
            left: `${l.left}%`,
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.duration}s`,
            transform: `scale(${l.scale})`,
          }}
        >
          <div
            className="relative h-10 w-7 rounded-[40%_40%_45%_45%] drift"
            style={{
              background: "linear-gradient(180deg, oklch(0.92 0.13 60), oklch(0.78 0.18 30))",
              boxShadow: "0 0 30px oklch(0.85 0.18 50 / 0.9), 0 0 60px oklch(0.85 0.18 50 / 0.4)",
            }}
          >
            <span className="absolute left-1/2 top-full h-3 w-px -translate-x-1/2 bg-amber-700/40" />
          </div>
        </div>
      ))}
    </div>
  );
}
