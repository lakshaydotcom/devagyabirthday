import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "off" | "on";

// Soft ambient pad using WebAudio — no external file needed.
export function MusicToggle() {
  const [mode, setMode] = useState<Mode>("off");
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);
  const masterRef = useRef<GainNode | null>(null);

  const start = () => {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    ctxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    masterRef.current = master;

    // A gentle C major 9 pad: C E G B D
    const freqs = [261.63, 329.63, 392.0, 493.88, 587.33];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = f / 2; // octave down for warmth
      const g = ctx.createGain();
      g.gain.value = 0.05 + i * 0.005;
      // Slow LFO on gain for breathing
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.08 + i * 0.03;
      lfoGain.gain.value = 0.025;
      lfo.connect(lfoGain).connect(g.gain);
      lfo.start();
      osc.connect(g).connect(master);
      osc.start();
      nodesRef.current.push({ osc, gain: g });
    });
    master.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 2.5);
  };

  const stop = () => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    setTimeout(() => {
      nodesRef.current.forEach(({ osc }) => { try { osc.stop(); } catch { /* noop */ } });
      nodesRef.current = [];
      ctx.close().catch(() => undefined);
      ctxRef.current = null;
      masterRef.current = null;
    }, 900);
  };

  const toggle = () => {
    if (mode === "off") { start(); setMode("on"); }
    else { stop(); setMode("off"); }
  };

  useEffect(() => () => stop(), []);

  return (
    <button
      onClick={toggle}
      aria-label={mode === "on" ? "Pause music" : "Play music"}
      className="glass fixed bottom-5 right-5 z-50 grid h-12 w-12 place-items-center rounded-full transition-transform hover:scale-110"
    >
      <span className="text-lg">{mode === "on" ? "♪" : "♫"}</span>
      <span className={`absolute inset-0 rounded-full ${mode === "on" ? "animate-pulse" : ""}`} style={{ boxShadow: mode === "on" ? "0 0 30px var(--rose)" : "none" }} />
    </button>
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
