import { useEffect, useMemo, useRef, useState } from "react";
import songAsset from "@/assets/background-song.mp3.asset.json";

// Background song — "Chahun Main Ya Naa" by Arijit Singh (Aashiqui 2).
// A romantic, nostalgic track that matches this website's warm, emotional mood.
// Replace the imported asset below if you'd like a different song later.
const SONG_URL = songAsset.url;

export function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [open, setOpen] = useState(false);
  const [autoPlayBlocked, setAutoPlayBlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const a = new Audio(SONG_URL);
    a.loop = true;
    a.volume = 0.35;
    a.preload = "auto";
    a.playsInline = true;
    audioRef.current = a;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);

    const tryAutoPlay = async () => {
      try {
        await a.play();
      } catch {
        setAutoPlayBlocked(true);
      }
    };
    void tryAutoPlay();

    return () => {
      a.pause();
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
    a.muted = muted;
  }, [volume, muted]);

  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      try {
        await a.play();
        setAutoPlayBlocked(false);
      } catch {
        /* ignore */
      }
    } else {
      a.pause();
    }
  };

  const toggleMute = () => setMuted((m) => !m);

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
        {open && (
          <div className="glass-strong flex items-center gap-2 rounded-full px-3 py-2 shadow-lg fade-in">
            <button
              onClick={togglePlay}
              aria-label={playing ? "Pause music" : "Play music"}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/40 text-base hover:scale-105 transition-transform"
            >
              {playing ? "❚❚" : "►"}
            </button>
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/40 text-base hover:scale-105 transition-transform"
            >
              {muted || volume === 0 ? "🔇" : volume < 0.4 ? "🔈" : "🔊"}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setVolume(v);
                if (v > 0 && muted) setMuted(false);
              }}
              aria-label="Volume"
              className="h-2 w-28 cursor-pointer accent-rose-400 sm:w-32"
            />
          </div>
        )}

        <button
          onClick={() => {
            setOpen((o) => !o);
            if (autoPlayBlocked) void togglePlay();
          }}
          aria-label="Music controls"
          aria-expanded={open}
          className={`glass relative grid h-12 w-12 place-items-center rounded-full transition-transform hover:scale-110 ${autoPlayBlocked ? "animate-bounce" : ""}`}
        >
          <span className="text-lg">{playing ? "♪" : "♫"}</span>
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-0 rounded-full ${playing && !muted ? "animate-pulse" : ""}`}
            style={{ boxShadow: playing && !muted ? "0 0 30px var(--rose)" : "none" }}
          />
        </button>
      </div>

      {autoPlayBlocked && !open && (
        <button
          onClick={() => {
            setOpen(true);
            void togglePlay();
          }}
          className="glass fixed bottom-20 right-5 z-50 max-w-[200px] rounded-2xl px-4 py-2 text-xs font-medium text-rose-700 shadow-lg fade-in"
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
