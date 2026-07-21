import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView, useReducedMotion } from "motion/react";
import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";
import confetti from "canvas-confetti";
import { MusicToggle, Particles, Lanterns } from "@/components/ambience";
import { phone } from "@/lib/phone";
import neetScorecard from "@/assets/NEET_UG_-_2026.pdf.asset.json";
import celebrateTogether from "@/assets/celebrate-together.jpg";
import devagyaPortrait from "@/assets/devagya-portrait.png.asset.json";
import devagyaLakshay from "@/assets/devagya-lakshay.png.asset.json";
import devagyaFamily from "@/assets/devagya-family.jpeg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday, Devagya ❤️" },
      { name: "description", content: "A heartfelt birthday letter from Lakshay to Devagya — a journey through a friendship that began in 5th class and never let go." },
      { property: "og:title", content: "Happy Birthday, Devagya ❤️" },
      { property: "og:description", content: "From two kids in 5th class to a friendship that survived every phase of life." },
    ],
  }),
  component: BirthdayPage,
});

function fireConfetti(opts?: confetti.Options) {
  confetti({
    particleCount: 90,
    spread: 80,
    origin: { y: 0.7 },
    colors: ["#f9c5d1", "#fbd6c2", "#e3d0ff", "#fff0d4", "#ffd1dc"],
    scalar: 0.9,
    ...opts,
  });
}

function heartConfetti() {
  const scalar = 2;
  const heart = confetti.shapeFromText({ text: "❤️", scalar });
  confetti({
    particleCount: 28,
    spread: 100,
    origin: { y: 0.6 },
    shapes: [heart],
    scalar,
    ticks: 200,
  });
}

const Section = forwardRef<HTMLElement, { id?: string; children: ReactNode; className?: string }>(
  ({ id, children, className = "" }, ref) => {
    return (
      <section ref={ref} id={id} className={`relative z-10 mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 sm:py-28 ${className}`}>
        {children}
      </section>
    );
  }
);
Section.displayName = "Section";

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ kicker, title }: { kicker?: string; title: string }) {
  return (
    <div className="mb-10 text-center">
      {kicker && (
        <p className="mb-3 font-[family-name:var(--font-script)] text-2xl text-[color:var(--rose)]">{kicker}</p>
      )}
      <h2 className="text-4xl leading-tight sm:text-5xl md:text-6xl">
        <span className="text-gradient">{title}</span>
      </h2>
      <div className="mx-auto mt-4 h-px w-20 bg-gradient-to-r from-transparent via-[color:var(--rose)] to-transparent" />
    </div>
  );
}

function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-3xl p-6 sm:p-8 ${className}`}>{children}</div>
  );
}

function ConfirmCallModal({ open, onCancel, onConfirm }: { open: boolean; onCancel: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-[color:var(--background)]/60 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="glass-strong relative z-10 w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl"
      >
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full" style={{ background: "var(--gradient-rose)" }}>
          <span className="text-2xl">📞</span>
        </div>
        <h3 className="text-2xl font-medium text-[color:var(--foreground)]">Call Lakshay?</h3>
        <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
          This will open your phone dialer. Are you sure you want to call?
        </p>
        <p className="mt-1 font-medium text-[color:var(--foreground)]">{phone.international}</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full px-4 py-2.5 text-sm font-medium text-[color:var(--foreground)] transition-transform hover:scale-105 active:scale-95"
          >
            Cancel
          </button>
          <a
            href={phone.telHref}
            onClick={() => {
              fireConfetti({ particleCount: 40, spread: 60 });
              onConfirm();
            }}
            className="flex-1 rounded-full px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{ background: "var(--gradient-rose)", boxShadow: "0 12px 30px -10px oklch(0.7 0.18 10 / 0.55)" }}
          >
            Call
          </a>
        </div>
      </motion.div>
    </div>
  );
}


function ConfirmWhatsAppModal({ open, onCancel }: { open: boolean; onCancel: () => void }) {
  const [copied, setCopied] = useState(false);
  if (!open) return null;

  const openWhatsApp = () => {
    heartConfetti();
    // Same-tab navigation avoids popup/redirect blocks.
    // whatsapp:// works when the app is installed; wa.me is the safe fallback.
    const start = Date.now();
    window.location.href = phone.waDeepLink;
    setTimeout(() => {
      if (Date.now() - start < 1600 && document.visibilityState === "visible") {
        window.location.href = phone.waHref;
      }
    }, 1500);
    onCancel();
  };

  const openSms = () => {
    heartConfetti();
    // sms: opens the device's default messaging app as a fallback.
    window.location.href = phone.smsHref;
    onCancel();
  };

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(phone.international);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-[color:var(--background)]/60 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="glass-strong relative z-10 w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl"
      >
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full" style={{ background: "var(--gradient-rose)" }}>
          <span className="text-2xl">💬</span>
        </div>
        <h3 className="text-2xl font-medium text-[color:var(--foreground)]">Message Lakshay?</h3>
        <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
          This will open WhatsApp so you can send a quick message.
        </p>
        <p className="mt-1 font-medium text-[color:var(--foreground)]">{phone.international}</p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={openWhatsApp}
            className="w-full rounded-full px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{ background: "var(--gradient-rose)", boxShadow: "0 12px 30px -10px oklch(0.7 0.18 10 / 0.55)" }}
          >
            Open WhatsApp
          </button>
          <button
            onClick={openSms}
            className="w-full rounded-full px-4 py-2.5 text-sm font-medium text-[color:var(--foreground)] transition-transform hover:scale-105 active:scale-95"
          >
            Send as SMS ✉️
          </button>
          <button
            onClick={copyNumber}
            className="w-full rounded-full px-4 py-2.5 text-sm font-medium text-[color:var(--foreground)] transition-transform hover:scale-105 active:scale-95"
          >
            {copied ? "Copied! ✓" : "Copy Number"}
          </button>
          <button
            onClick={onCancel}
            className="w-full rounded-full px-4 py-2.5 text-sm font-medium text-[color:var(--muted-foreground)] transition-transform hover:scale-105 active:scale-95"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8, pointerEvents: visible ? "auto" : "none" }}
      transition={{ duration: 0.3 }}
      aria-label="Back to top"
      className="glass fixed bottom-5 left-5 z-50 grid h-12 w-12 place-items-center rounded-full transition-transform hover:scale-110 active:scale-95"
    >
      <span className="text-lg">↑</span>
    </motion.button>
  );
}

function BirthdayPage() {
  const [started, setStarted] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const begin = () => {
    setStarted(true);
    fireConfetti();
    setTimeout(() => heartConfetti(), 250);
    document.getElementById("beginning")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="relative min-h-screen">
      <Particles />
      <MusicToggle />

      {/* HERO */}
      <section ref={heroRef} className="relative z-10 flex min-h-[100svh] items-center justify-center px-5 py-20 text-center">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/3 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, oklch(0.88 0.12 10 / 0.55), transparent 70%)" }} />
          <div className="absolute right-[10%] top-[15%] h-[40vmin] w-[40vmin] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, oklch(0.85 0.10 300 / 0.5), transparent 70%)" }} />
          <div className="absolute left-[5%] bottom-[10%] h-[35vmin] w-[35vmin] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, oklch(0.9 0.10 50 / 0.5), transparent 70%)" }} />
        </div>

        <div className="mx-auto max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-4 font-[family-name:var(--font-script)] text-3xl text-[color:var(--rose)] sm:text-4xl"
          >
            a letter for devagya
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.15 }}
            className="text-5xl leading-[1.05] sm:text-6xl md:text-7xl"
          >
            <span className="block">Happy Birthday,</span>
            <span className="text-gradient block">Devagya</span>
            <motion.span
              aria-hidden
              className="inline-block heart-beat"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 200 }}
            >❤️</motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.7 }}
            className="mx-auto mt-6 max-w-xl text-base text-[color:var(--muted-foreground)] sm:text-lg"
          >
            From two kids in 5th class to a friendship that survived every phase of life.
          </motion.p>

          <motion.button
            onClick={begin}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="mt-10 inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-medium text-white shadow-lg"
            style={{ background: "var(--gradient-rose)", boxShadow: "0 20px 50px -15px oklch(0.7 0.18 10 / 0.6)" }}
          >
            {started ? "Continue Our Story" : "Begin Our Story"}
            <span aria-hidden>→</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-16 flex justify-center"
          >
            <span className="inline-block h-10 w-px animate-pulse bg-[color:var(--rose)]/50" />
          </motion.div>
        </div>
      </section>

      {/* SECTION 1: BEGINNING */}
      <Section id="beginning">
        <Reveal>
          <SectionTitle kicker="chapter one" title="Where It All Started" />
        </Reveal>
        <Reveal delay={0.1}>
          <GlassCard className="relative overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute -right-6 -top-6 text-7xl opacity-30">✏️</div>
            <div aria-hidden className="pointer-events-none absolute -bottom-4 -left-4 text-6xl opacity-25">📚</div>
            <p className="relative text-lg leading-relaxed text-[color:var(--foreground)]/85 sm:text-xl">
              We met in <span className="font-[family-name:var(--font-script)] text-2xl text-[color:var(--rose)]">5th class</span>, and without realizing it, we became a permanent part of each other's lives. We grew up together, laughed together, fought over silly things, and created memories that no photograph could ever fully capture.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3 text-center sm:gap-4">
              {[
                { icon: "🎒", label: "school bags" },
                { icon: "🔔", label: "lunch bells" },
                { icon: "📖", label: "shared notes" },
              ].map((i, idx) => (
                <motion.div
                  key={i.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  whileHover={{ y: -4, rotate: -2 }}
                  className="glass rounded-2xl p-4"
                >
                  <div className="text-3xl">{i.icon}</div>
                  <div className="mt-1 text-xs text-[color:var(--muted-foreground)]">{i.label}</div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </Reveal>
      </Section>

      {/* SECTION 2: GAMES */}
      <Section id="games">
        <Reveal><SectionTitle kicker="chapter two" title="Our Childhood Adventures" /></Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {[
            { icon: "🎭", title: "Truth and Dare", text: "Half-honest answers, ridiculous dares, and laughter that wouldn't stop." },
            { icon: "🗿", title: "Statue!", text: "One word could freeze an entire afternoon in its tracks." },
            { icon: "🏫", title: "School Memories", text: "Whispered jokes during lectures, scribbles on the last page of every notebook." },
            { icon: "😆", title: "Endless Teasing", text: "I teased, you rolled your eyes, we both laughed anyway." },
          ].map((m, i) => (
            <Reveal key={m.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6, rotate: i % 2 ? 1 : -1 }}
                className="glass group h-full rounded-3xl p-6 transition-shadow hover:shadow-[var(--shadow-glow)]"
              >
                <div className="mb-3 text-4xl transition-transform group-hover:scale-110">{m.icon}</div>
                <h3 className="text-2xl text-[color:var(--foreground)]">{m.title}</h3>
                <p className="mt-2 text-[color:var(--muted-foreground)]">{m.text}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <p className="mt-10 text-center font-[family-name:var(--font-script)] text-2xl text-[color:var(--rose)] sm:text-3xl">
            "One word — 'Statue!' — could stop an entire world for us."
          </p>
        </Reveal>
      </Section>

      {/* SECTION 3: SUPPORT */}
      <Section id="support">
        <Reveal><SectionTitle kicker="chapter three" title="My Constant Support" /></Reveal>
        <Reveal delay={0.1}>
          <div className="relative">
            <div aria-hidden className="absolute inset-0 -z-10 rounded-[2rem] blur-2xl" style={{ background: "radial-gradient(ellipse at center, oklch(0.88 0.12 10 / 0.5), transparent 70%)" }} />
            <GlassCard className="text-center">
              <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full" style={{ background: "var(--gradient-rose)", animation: "pulse-glow 3s ease-in-out infinite" }}>
                <span className="text-3xl">✨</span>
              </div>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[color:var(--foreground)]/85 sm:text-xl">
                You stood beside me when I needed someone. You supported me even during times when life wasn't easy. Even when your father wasn't particularly fond of me, you never stopped being a true friend. Your kindness, loyalty, and belief in me are gifts I will always treasure.
              </p>
            </GlassCard>
          </div>
        </Reveal>
      </Section>

      {/* SECTION 3.5: A SMALL REQUEST */}
      <Section id="phone">
        <Reveal><SectionTitle kicker="a small request" title="Pick Up, and Call Sometimes" /></Reveal>
        <Reveal delay={0.1}>
          <GlassCard>
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <motion.div
                animate={{ rotate: [0, -12, 12, -8, 8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                className="shrink-0 text-7xl"
                aria-hidden
              >
                📞
              </motion.div>
              <div>
                <p className="text-lg leading-relaxed text-[color:var(--foreground)]/85 sm:text-xl">
                  I have just one tiny wish, and I'm asking it with all my heart — please try to <span className="font-semibold text-[color:var(--rose)]">pick up the phone on time</span> when I call. And once in a while, if it's not too much to ask, <span className="font-semibold text-[color:var(--rose)]">call me on your own</span> too.
                </p>
                <p className="mt-4 text-base leading-relaxed text-[color:var(--muted-foreground)] sm:text-lg">
                  I know life gets busy, studies get heavier, and days slip by faster than we notice. I'm not asking for long conversations — even a short "hi, how are you?" from your side means the whole world to me.
                </p>
                <p className="mt-4 font-[family-name:var(--font-script)] text-2xl text-[color:var(--rose)]">
                  A missed call from you still makes my day. 🤍
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => setCallModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                    style={{ background: "var(--gradient-rose)", boxShadow: "0 15px 40px -12px oklch(0.7 0.18 10 / 0.6)" }}
                  >
                    <span aria-hidden>📞</span> Call Lakshay
                  </button>
                  <button
                    onClick={() => setWhatsappModalOpen(true)}
                    className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-[color:var(--foreground)] transition-transform hover:scale-105 active:scale-95"
                  >
                    <span aria-hidden>💬</span> WhatsApp
                  </button>
                  <a
                    href={phone.smsHref}
                    className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-[color:var(--foreground)] transition-transform hover:scale-105 active:scale-95"
                  >
                    <span aria-hidden>✉️</span> SMS
                  </a>
                </div>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </Section>


      {/* SECTION 4: FUNNY TRUTH */}
      <Section id="annoying">
        <Reveal><SectionTitle kicker="chapter four" title="The Forever Annoying Friend" /></Reveal>
        <Reveal delay={0.1}>
          <GlassCard>
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -6, 0], scale: 1.1 }}
                transition={{ duration: 0.6 }}
                onClick={() => fireConfetti({ particleCount: 40, spread: 60 })}
                className="shrink-0 cursor-pointer text-7xl"
                role="button"
                aria-label="poke"
              >
                🙃
              </motion.div>
              <p className="text-lg leading-relaxed text-[color:var(--foreground)]/85 sm:text-xl">
                I annoyed you more than anyone else probably could. I teased you, troubled you, and tested your patience countless times. Yet somehow, you never gave up on our friendship.
                <span className="mt-2 block text-sm text-[color:var(--muted-foreground)]">(go on — poke the emoji.)</span>
              </p>
            </div>
          </GlassCard>
        </Reveal>
      </Section>

      {/* SECTION 5: MEMORIES WITHOUT PHOTOS */}
      <Section id="memories">
        <Reveal><SectionTitle kicker="chapter five" title="Moments We Never Captured" /></Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { ill: "🌅", title: "A walk home", text: "Talking about nothing important, which made it the most important talk." },
            { ill: "📒", title: "Margins of notebooks", text: "Doodles, secret codes, and inside jokes only we could read." },
            { ill: "🍦", title: "Shared sweet", text: "Two spoons, one cup, and the unspoken rule of fair bites." },
            { ill: "🌧️", title: "Sudden rain", text: "Running for cover, soaked and laughing — no camera in sight." },
            { ill: "🌙", title: "Late night talks", text: "Half-whispered fears and bigger-than-us dreams." },
            { ill: "🎈", title: "Random birthdays", text: "Tiny celebrations, big feelings, zero photographs." },
          ].map((m, i) => (
            <Reveal key={m.title} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -6 }}
                className="glass relative h-full overflow-hidden rounded-3xl p-6"
                style={{ background: "linear-gradient(160deg, oklch(1 0 0 / 0.65), oklch(0.95 0.05 320 / 0.55))" }}
              >
                <div aria-hidden className="absolute right-3 top-3 text-xs uppercase tracking-widest text-[color:var(--muted-foreground)]/60">no. {String(i + 1).padStart(2, "0")}</div>
                <div className="mb-4 text-5xl">{m.ill}</div>
                <h3 className="text-xl">{m.title}</h3>
                <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">{m.text}</p>
                <div aria-hidden className="mt-5 h-px w-12 bg-[color:var(--rose)]/40" />
              </motion.div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <p className="mx-auto mt-12 max-w-3xl text-center font-[family-name:var(--font-script)] text-2xl leading-snug text-[color:var(--foreground)]/80 sm:text-3xl">
            "It's funny that after all these years, we still don't have a proper picture together. Maybe some friendships are meant to live in memories instead of frames. One day, we'll finally take that photo."
          </p>
        </Reveal>
      </Section>

      {/* SECTION 6: NEET */}
      <Section id="dream">
        <Reveal><SectionTitle kicker="chapter six" title="Future Doctor In The Making" /></Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[auto_1fr]">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto"
            >
              <div className="glass grid h-32 w-32 place-items-center rounded-full text-6xl" style={{ boxShadow: "0 0 60px oklch(0.85 0.10 200 / 0.5)" }}>
                🩺
              </div>
            </motion.div>
            <GlassCard>
              <p className="text-lg leading-relaxed text-[color:var(--foreground)]/85 sm:text-xl">
                You appeared for your <span className="font-semibold text-[color:var(--rose)]">NEET examination</span>, and I genuinely believe this is your year. You worked hard, sacrificed comfort, and kept moving forward when things became difficult. I cannot wait to see you achieve your dream and become the incredible doctor you are meant to be.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["📚 long nights", "☕ cold coffees", "💪 quiet strength", "🌅 a future white coat"].map((t) => (
                  <span key={t} className="glass rounded-full px-3 py-1 text-sm">{t}</span>
                ))}
              </div>
            </GlassCard>
          </div>
        </Reveal>
      </Section>

      {/* SECTION 7: NEET RESULT */}
      <NeetResultSection />

      {/* SECTION 8: GALLERY */}
      <GallerySection />

      {/* FINAL: LETTER */}
      <FinalSection />

      <ConfirmCallModal
        open={callModalOpen}
        onCancel={() => setCallModalOpen(false)}
        onConfirm={() => setCallModalOpen(false)}
      />
      <ConfirmWhatsAppModal
        open={whatsappModalOpen}
        onCancel={() => setWhatsappModalOpen(false)}
      />
    </main>
  );
}

function NeetResultSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [celebrated, setCelebrated] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (inView && !celebrated) {
      setCelebrated(true);
      if (!reduce) {
        setTimeout(() => fireConfetti({ particleCount: 120, spread: 110, origin: { y: 0.6 } }), 300);
        setTimeout(() => heartConfetti(), 900);
      }
    }
  }, [inView, celebrated, reduce]);

  const stats = [
    { label: "Total Marks", value: "632", sub: "out of 720", icon: "🎯" },
    { label: "Overall Percentile", value: "99.84", sub: "top 0.16%", icon: "📈" },
    { label: "All India Rank", value: "3,269", sub: "among lakhs", icon: "🏆" },
    { label: "Category Rank", value: "1,611", sub: "General", icon: "🌟" },
  ];

  const subjects = [
    { name: "Biology", percentile: "97.43", color: "oklch(0.78 0.13 10)" },
    { name: "Chemistry", percentile: "99.92", color: "oklch(0.82 0.07 300)" },
    { name: "Physics", percentile: "99.73", color: "oklch(0.88 0.09 50)" },
  ];

  return (
    <Section id="neet-result" ref={ref}>
      <Reveal>
        <SectionTitle kicker="she did it" title="Dr. Devagya, Loading..." />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="text-center">
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[color:var(--foreground)]/85 sm:text-xl">
            The result is out, and it is nothing short of extraordinary. Your name — <span className="font-semibold text-[color:var(--rose)]">Devagya</span> — now shines among the top achievers of NEET UG 2026. All those sleepless nights, all that sacrifice, every page you turned — it was worth it.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 + i * 0.1, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="glass-strong relative overflow-hidden rounded-3xl p-6 text-center"
            >
              <div aria-hidden className="absolute -right-3 -top-3 text-5xl opacity-20">{s.icon}</div>
              <div className="relative">
                <p className="text-4xl font-medium tracking-tight text-[color:var(--foreground)] sm:text-5xl">{s.value}</p>
                <p className="mt-1 text-sm font-medium text-[color:var(--rose)]">{s.label}</p>
                <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">{s.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.4}>
        <GlassCard className="mt-10">
          <h3 className="mb-6 text-center text-2xl text-[color:var(--foreground)]">Subject-wise Percentiles</h3>
          <div className="space-y-5">
            {subjects.map((subject) => (
              <div key={subject.name}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-[color:var(--foreground)]">{subject.name}</span>
                  <span className="text-sm font-semibold" style={{ color: subject.color }}>{subject.percentile}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-[color:var(--muted)]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${parseFloat(subject.percentile)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: subject.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </Reveal>

      <Reveal delay={0.5}>
        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="font-[family-name:var(--font-script)] text-2xl text-[color:var(--rose)] sm:text-3xl">
            "The white coat is no longer a dream. It's your future."
          </p>
          <a
            href={neetScorecard.url}
            download="NEET_UG_-_2026_Devagya.pdf"
            onClick={() => fireConfetti({ particleCount: 60, spread: 80 })}
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-medium text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{ background: "var(--gradient-rose)", boxShadow: "0 20px 50px -15px oklch(0.7 0.18 10 / 0.6)" }}
          >
            <span aria-hidden>📄</span> Download Scorecard
          </a>
          <p className="text-xs text-[color:var(--muted-foreground)]">Roll No. 2317101024 · Result declared 16 July 2026</p>
        </div>
      </Reveal>
    </Section>
  );
}

function FinalSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (inView && !revealed) {
      setRevealed(true);
      setTimeout(() => heartConfetti(), 800);
      setTimeout(() => fireConfetti({ particleCount: 60, spread: 100 }), 1400);
    }
  }, [inView, revealed]);

  const letter = [
    "Before this journey ends, there is something I need to say.",
    "I'm sorry.",
    "I'm sorry for every time I hurt you, disappointed you, or failed to appreciate your presence the way I should have. I know I have made mistakes, and if I could go back and change those moments, I would.",
    "Thank you for staying, supporting me, believing in me, and being my friend despite everything.",
    "From playing Truth and Dare and shouting 'Statue!' in childhood to standing on the edge of adulthood and chasing dreams, you've always been an important part of my life.",
    "Even without a single photograph together, we carry countless memories that no camera could ever capture.",
    "Your NEET journey ended in success, and today we celebrate Dr. Devagya with the biggest smiles. One day, we'll finally click that long-overdue picture together.",
    "Thank you for every laugh, every lesson, every act of kindness, and every moment of support.",
  ];

  return (
    <section ref={ref} className="relative z-10 overflow-hidden px-5 py-28 sm:py-36">
      <Lanterns />
      <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "linear-gradient(180deg, transparent, oklch(0.92 0.06 340 / 0.4), transparent)" }} />

      <div className="relative mx-auto max-w-3xl">
        <Reveal>
          <div className="mb-10 text-center">
            <p className="font-[family-name:var(--font-script)] text-2xl text-[color:var(--rose)]">one last thing</p>
            <h2 className="mt-2 text-4xl sm:text-5xl md:text-6xl">
              <span className="text-gradient">Happy Birthday.</span>{" "}
              <span className="heart-beat inline-block">❤️</span>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <article className="glass-strong rounded-[2rem] p-7 sm:p-10">
            <div className="space-y-5 text-lg leading-relaxed text-[color:var(--foreground)]/90 sm:text-xl">
              {letter.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.7 }}
                  className={p === "I'm sorry." ? "py-2 text-center font-[family-name:var(--font-script)] text-3xl text-[color:var(--rose)] sm:text-4xl" : ""}
                >
                  {p}
                </motion.p>
              ))}

              <div className="my-6 h-px bg-gradient-to-r from-transparent via-[color:var(--rose)]/50 to-transparent" />

              <p className="text-center text-2xl">Happy Birthday, Devagya.</p>
              <p className="text-center text-[color:var(--muted-foreground)]">And once again —</p>
              <p className="text-center font-[family-name:var(--font-script)] text-3xl text-[color:var(--rose)]">I'm sorry.</p>

              <div className="pt-6 text-right">
                <p className="text-[color:var(--muted-foreground)]">With love,</p>
                <p className="font-[family-name:var(--font-script)] text-2xl text-[color:var(--rose)]">Lakshay — your forever annoying best friend. ❤️</p>
              </div>
            </div>
          </article>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="mx-auto mt-16 max-w-2xl text-center font-[family-name:var(--font-script)] text-2xl leading-snug text-[color:var(--foreground)]/80 sm:text-3xl">
            "Some friendships are not measured in photographs, but in memories that last forever."
          </p>
        </Reveal>

        <Reveal delay={0.55}>
          <div className="mt-14 flex flex-col items-center gap-5">
            <motion.button
              onClick={() => { heartConfetti(); fireConfetti({ particleCount: 120, spread: 110 }); }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Send hearts"
              className="grid h-24 w-24 place-items-center rounded-full text-5xl heart-beat"
              style={{ background: "var(--gradient-rose)", boxShadow: "0 0 80px oklch(0.78 0.15 10 / 0.7)" }}
            >
              ❤️
            </motion.button>
            <p className="text-center text-2xl sm:text-3xl">
              <span className="text-gradient font-medium">Happy Birthday, Future Doctor.</span>{" "}
              <span aria-hidden>❤️</span>
            </p>
            <p className="text-xs text-[color:var(--muted-foreground)]">tap the heart</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function GallerySection() {
  const tiles = [
    { emoji: "📸", label: "Add a photo" },
    { emoji: "🎂", label: "Her birthday" },
    { emoji: "🩺", label: "White coat day" },
    { emoji: "☕", label: "First coffee together" },
    { emoji: "🌇", label: "That long-awaited walk" },
  ];

  const photos = [
    {
      src: devagyaPortrait.url,
      alt: "Devagya wearing a bright safa and marigold garland on her big day",
      caption: "the day everything paid off",
      span: "sm:col-span-2 sm:row-span-2",
    },
    {
      src: devagyaLakshay.url,
      alt: "Devagya and Lakshay together after her felicitation",
      caption: "us — finally in one frame",
    },
    {
      src: devagyaFamily.url,
      alt: "Devagya being celebrated by family with garlands",
      caption: "surrounded by the people who prayed for this",
    },
  ];

  return (
    <Section id="gallery">
      <Reveal>
        <SectionTitle kicker="a little gallery" title="Moments Worth Framing" />
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {photos.map((p, i) => (
            <motion.figure
              key={p.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`glass-strong group relative overflow-hidden rounded-3xl p-2 ${p.span ?? ""}`}
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                  style={{ aspectRatio: p.span ? "4/5" : "3/4" }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 55%, oklch(0.22 0.05 340 / 0.6) 100%)",
                  }}
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <p className="font-[family-name:var(--font-script)] text-lg text-white/95 drop-shadow sm:text-xl">
                    {p.caption}
                  </p>
                </figcaption>
              </div>
            </motion.figure>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <p className="mx-auto mt-8 max-w-2xl text-center text-[color:var(--muted-foreground)]">
          A few real frames from your big day — and below, the one I imagined for us,
          waiting patiently to become real.
        </p>
      </Reveal>


      <Reveal delay={0.1}>
        <div className="glass-strong group relative mx-auto overflow-hidden rounded-[2rem] p-3 sm:p-4">
          <div className="relative overflow-hidden rounded-[1.5rem]">
            <img
              src={celebrateTogether}
              alt="An illustration of Lakshay and Devagya celebrating together under a pastel sunset sky"
              width={1280}
              height={896}
              loading="lazy"
              className="h-auto w-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 55%, oklch(0.25 0.05 340 / 0.55) 100%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
              <p className="font-[family-name:var(--font-script)] text-2xl text-white/95 drop-shadow sm:text-3xl">
                one day we will be celebrating
              </p>
              <p className="mt-1 text-sm text-white/85 sm:text-base">
                Us. Together. In a real frame — not just an imagined one.
              </p>
            </div>
            <span
              aria-hidden
              className="absolute right-4 top-4 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-[color:var(--foreground)] backdrop-blur"
            >
              soon ✨
            </span>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mx-auto mt-8 max-w-2xl text-center text-[color:var(--muted-foreground)]">
          We never had a proper photo together — so I imagined one. When we
          finally click the real one, it takes this spot. Until then, these
          empty frames are little promises for the memories still to come.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {tiles.map((t, i) => (
          <Reveal key={t.label} delay={0.05 * i}>
            <motion.div
              whileHover={{ y: -4 }}
              className="glass relative flex aspect-square items-center justify-center rounded-2xl text-center"
              style={{
                background:
                  "linear-gradient(160deg, oklch(1 0 0 / 0.6), oklch(0.94 0.05 320 / 0.55))",
                border: "1px dashed color-mix(in oklab, var(--rose) 45%, transparent)",
              }}
            >
              <div className="px-3">
                <div className="mb-2 text-3xl">{t.emoji}</div>
                <p className="text-xs text-[color:var(--muted-foreground)] sm:text-sm">
                  {t.label}
                </p>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
