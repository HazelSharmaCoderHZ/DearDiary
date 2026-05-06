'use client';

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useScroll,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@200;300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --font-display: 'Cormorant Garamond', Georgia, serif;
      --font-body: 'Jost', sans-serif;
      --mauve: #9d79ab;
      --mauve-light: #c9b0d9;
      --peach: #ddbb9f;
      --cream: #faf3ec;
      --ink: #1e1616;
      --muted: #96897e;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: var(--font-body);
      background: var(--cream);
      overflow-x: hidden;
      cursor: default;
    }

    /* ── LOADER ── */
    .loader-wrap {
      position: fixed;
      inset: 0;
      background: var(--ink);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 1rem;
    }
    .loader-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
    }
    .loader-line {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      width: 0;
      background: linear-gradient(to right, transparent, var(--mauve-light), var(--peach), transparent);
      animation: loader-progress 2.4s cubic-bezier(0.7, 0, 0.3, 1) forwards;
    }
    @keyframes loader-progress {
      from { width: 0; }
      to   { width: 100%; }
    }
    .loader-text-wrap {
      position: relative;
      display: inline-block;
      max-width: 100%;
    }
    .loader-text {
      font-family: var(--font-display);
      font-size: clamp(2.5rem, 9vw, 8rem);
      font-weight: 300;
      color: transparent;
      -webkit-text-stroke: 1px rgba(255,255,255,0.12);
      letter-spacing: 0.1em;
      display: block;
      white-space: nowrap;
    }
    .loader-text-fill {
      position: absolute;
      inset: 0;
      font-family: var(--font-display);
      font-size: clamp(2.5rem, 9vw, 8rem);
      font-weight: 300;
      color: #fff;
      letter-spacing: 0.1em;
      white-space: nowrap;
      clip-path: inset(0 100% 0 0);
      animation: text-reveal 2.4s cubic-bezier(0.7, 0, 0.3, 1) forwards 0.15s;
    }
    @keyframes text-reveal {
      from { clip-path: inset(0 100% 0 0); }
      to   { clip-path: inset(0 0% 0 0); }
    }
    .loader-sub {
      font-family: var(--font-body);
      font-size: 0.7rem;
      font-weight: 300;
      letter-spacing: 0.45em;
      color: rgba(255,255,255,0.2);
      text-transform: uppercase;
      margin-top: 1.8rem;
      opacity: 0;
      animation: fade-up 0.8s ease forwards 0.7s;
      text-align: center;
    }
    .loader-counter {
      position: absolute;
      bottom: 3rem;
      right: 4rem;
      font-family: var(--font-display);
      font-size: clamp(2.5rem, 8vw, 5rem);
      font-weight: 300;
      color: rgba(255,255,255,0.05);
      letter-spacing: -0.02em;
      user-select: none;
    }
    @keyframes fade-up {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── SCROLL PROGRESS BAR ── */
    .scroll-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(to right, var(--mauve), #c9a96e);
      z-index: 9998;
      transform-origin: 0%;
    }

    /* ── DECORATIVE RING ── */
    .deco-ring {
      position: absolute;
      border-radius: 50%;
      border: 1px solid rgba(155,127,166,0.1);
      pointer-events: none;
    }

    /* ── INK UNDERLINE LINKS ── */
    .ink-link {
      position: relative;
      text-decoration: none;
    }
    .ink-link::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 0;
      height: 1px;
      background: var(--mauve);
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .ink-link:hover::after { width: 100%; }

    /* ── GLASS CARD ── */
    .glass-card {
      background: rgba(255, 255, 255, 0.72);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(155, 127, 166, 0.13);
    }

    /* ── BLOB DRIFT ── */
    @keyframes blob-drift {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33%       { transform: translate(28px, -18px) scale(1.04); }
      66%       { transform: translate(-18px, 14px) scale(0.97); }
    }
    .blob   { animation: blob-drift 9s ease-in-out infinite; }
    .blob-2 { animation: blob-drift 9s ease-in-out infinite -3s; }
    .blob-3 { animation: blob-drift 9s ease-in-out infinite -6s; }

    /* ── MARQUEE ── */
    .marquee-inner {
      display: flex;
      width: max-content;
      animation: marquee-scroll 24s linear infinite;
    }
    .marquee-inner:hover { animation-play-state: paused; }
    @keyframes marquee-scroll {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }

    /* ── HERO GRAIN ── */
    .hero-grain {
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)' opacity='0.05'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 0;
      opacity: 0.45;
    }

    /* ── NAVBAR RESPONSIVE ── */
    .nav-links {
      display: flex;
      align-items: center;
      gap: 2.5rem;
    }
    .nav-text-links {
      display: flex;
      align-items: center;
      gap: 2.5rem;
    }

    /* ── ABOUT GRID ── */
    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.4rem;
    }

    /* ── SERVICES GRID ── */
    .services-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.2rem;
      perspective: 1100px;
    }
    .service-card-wide {
      grid-column: span 2;
    }
    .service-card-narrow {
      grid-column: span 1;
    }

    /* ── CONTACT BUTTONS ── */
    .contact-buttons {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.9rem;
    }

    /* ══════════════════════════════════════
       RESPONSIVE BREAKPOINTS
    ══════════════════════════════════════ */

    /* Tablet: ≤ 900px */
    @media (max-width: 900px) {
      .benefits-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .services-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .service-card-wide {
        grid-column: span 2;
      }
      .service-card-narrow {
        grid-column: span 1;
      }
      .loader-counter {
        right: 2rem;
        bottom: 2rem;
      }
    }

    /* Mobile: ≤ 640px */
    @media (max-width: 640px) {
      .nav-text-links {
        display: none;
      }
      .nav-links {
        gap: 1rem;
      }
      .benefits-grid {
        grid-template-columns: 1fr;
      }
      .services-grid {
        grid-template-columns: 1fr;
      }
      .service-card-wide,
      .service-card-narrow {
        grid-column: span 1;
      }
      .contact-buttons {
        flex-direction: column;
        align-items: center;
      }
      .loader-counter {
        display: none;
      }
      .deco-ring {
        display: none;
      }
    }

    /* Very small: ≤ 400px */
    @media (max-width: 400px) {
      .loader-sub {
        letter-spacing: 0.22em;
        font-size: 0.62rem;
      }
    }
  `}</style>
);

/* ─────────────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────────────── */
function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div className="scroll-bar" style={{ scaleX }} />;
}

/* ─────────────────────────────────────────────
   LOADER
───────────────────────────────────────────── */
function Loader({ onDone }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;

    const interval = setInterval(() => {
      start += 1;
      setCount(start);

      if (start >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onDone();
        }, 300);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <motion.div
      className="loader-wrap"
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="loader-grid" />

      <div className="deco-ring" style={{ width: 500, height: 500, opacity: 0.05 }} />
      <div className="deco-ring" style={{ width: 300, height: 300, opacity: 0.07 }} />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', top: '2.5rem', right: '3rem',
          width: 34, height: 34,
          border: '1px solid rgba(155,127,166,0.22)',
          borderTopColor: 'var(--mauve)',
          borderRadius: '50%',
        }}
      />

      <div className="loader-text-wrap">
        <span className="loader-text">Dear Diary</span>
        <span className="loader-text-fill">Dear Diary</span>
      </div>

      <div className="loader-sub">your sanctuary awaits</div>
      <div className="loader-counter">{String(count).padStart(3, '0')}</div>
      <div className="loader-line" />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   FLOATING PARTICLES
───────────────────────────────────────────── */
const PARTICLES = [
  { id:0,  x:6,   y:14,  size:2, dur:7,  del:0   },
  { id:1,  x:18,  y:72,  size:3, dur:9,  del:0.5 },
  { id:2,  x:31,  y:38,  size:2, dur:8,  del:1   },
  { id:3,  x:44,  y:88,  size:3, dur:11, del:1.5 },
  { id:4,  x:57,  y:21,  size:2, dur:7,  del:0.8 },
  { id:5,  x:68,  y:55,  size:3, dur:10, del:2   },
  { id:6,  x:79,  y:8,   size:2, dur:8,  del:0.3 },
  { id:7,  x:91,  y:65,  size:3, dur:9,  del:1.8 },
  { id:8,  x:13,  y:48,  size:2, dur:11, del:2.5 },
  { id:9,  x:85,  y:33,  size:2, dur:7,  del:0.6 },
  { id:10, x:25,  y:92,  size:3, dur:8,  del:1.2 },
  { id:11, x:50,  y:50,  size:2, dur:9,  del:3   },
  { id:12, x:72,  y:80,  size:3, dur:10, del:0.9 },
  { id:13, x:38,  y:11,  size:2, dur:7,  del:2.2 },
  { id:14, x:95,  y:47,  size:3, dur:11, del:1.4 },
  { id:15, x:5,   y:82,  size:2, dur:8,  del:0.1 },
];

function Particles() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: 'var(--mauve)',
          }}
          animate={{ y: [0, -34, 0], opacity: [0.08, 0.22, 0.08], scale: [1, 1.5, 1] }}
          transition={{ duration: p.dur, delay: p.del, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAGNETIC WRAP
───────────────────────────────────────────── */
function MagneticWrap({ children, strength = 0.28 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 22 });
  const sy = useSpring(y, { stiffness: 180, damping: 22 });

  const onMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ x: sx, y: sy, display: 'inline-block' }}>
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SPLIT HEADING
───────────────────────────────────────────── */
function SplitHeading({ children, delay = 0 }) {
  const words = String(children).split(' ');
  return (
    <>
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.22em', verticalAlign: 'bottom' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '105%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: delay + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   SERVICE CARD
───────────────────────────────────────────── */
function ServiceCard({ title, desc, icon, wide }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 100, damping: 20 });
  const sy = useSpring(y, { stiffness: 100, damping: 20 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(sx, [-0.5, 0.5], ['-7deg', '7deg']);

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={`group glass-card ${wide ? 'service-card-wide' : 'service-card-narrow'}`}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{
        borderRadius: '1.75rem',
        padding: '2rem',
        minHeight: '13rem',
        boxShadow: '0 4px 28px rgba(155,127,166,0.07)',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
      }}>
        {/* hover glow */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '1.75rem',
          background: 'radial-gradient(circle at 55% 35%, rgba(155,127,166,0.09) 0%, transparent 65%)',
          opacity: 0, transition: 'opacity 0.4s',
          pointerEvents: 'none',
        }}
          className="group-glow"
        />

        <div style={{ transform: 'translateZ(28px)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem' }}>
          <motion.div
            whileHover={{ scale: 1.18, rotate: 6 }}
            transition={{ duration: 0.3 }}
            style={{
              width: '3.2rem', height: '3.2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '0.9rem',
              background: 'rgba(155,127,166,0.07)',
              fontSize: '1.6rem',
              flexShrink: 0,
            }}
          >
            {icon}
          </motion.div>

          <div>
            <h4 style={{
              fontFamily: 'var(--font-display)', fontWeight: 400, color: 'var(--ink)',
              fontSize: '1.3rem', marginBottom: '0.35rem',
              transition: 'color 0.3s',
            }}>
              {title}
            </h4>
            <p style={{ color: 'var(--muted)', lineHeight: 1.65, fontWeight: 300, fontSize: '0.88rem' }}>
              {desc}
            </p>
          </div>
        </div>

        {/* shimmer line */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          height: 2, width: 0, borderRadius: '999px 999px 0 0',
          background: 'linear-gradient(to right, var(--mauve), #c9a96e)',
          transition: 'width 0.5s ease',
        }}
          className="card-shimmer"
        />

        <style jsx>{`
          .group:hover .card-shimmer { width: 40%; }
          .group:hover .group-glow { opacity: 1; }
        `}</style>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MARQUEE STRIP
───────────────────────────────────────────── */
const MARQUEE_ITEMS = ['✍️ Journal', '🌿 Reflect', '🗓️ Track Moods', '💜 Heal', '📖 Remember', '✨ Grow', '🔐 Private', '🌸 Flourish'];

function MarqueeStrip() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div style={{
      overflow: 'hidden',
      padding: '1rem 0',
      borderTop: '1px solid rgba(155,127,166,0.09)',
      borderBottom: '1px solid rgba(155,127,166,0.09)',
      background: 'rgba(155,127,166,0.025)',
    }}>
      <div className="marquee-inner">
        {doubled.map((item, i) => (
          <span key={i} style={{
            display: 'inline-block',
            margin: '0 2.2rem',
            fontSize: '0.75rem',
            letterSpacing: '0.14em',
            color: 'var(--mauve)',
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            whiteSpace: 'nowrap',
          }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const SERVICES = [
  { title: 'Journaling',    desc: 'Write freely without judgment in a safe, encrypted space.',       icon: '✍️', wide: true  },
  { title: 'Edit / Delete', desc: 'Your words, your rules.',                                         icon: '✂️', wide: false },
  { title: 'Mood Calendar', desc: 'Visualize your emotional journey through a spectrum of colors.',  icon: '🗓️', wide: false },
  { title: 'View Entries',  desc: "A beautiful timeline of your life's most precious memories.",     icon: '📖', wide: true  },
];

const BENEFITS = [
  { emoji: '✨', text: 'Unload thoughts stuck in your head',          color: 'from-purple-400 to-indigo-500' },
  { emoji: '🧠', text: 'Name emotions to reduce anxiety',             color: 'from-blue-400 to-purple-500'  },
  { emoji: '🌱', text: 'Reveal emotional patterns over time',          color: 'from-teal-400 to-emerald-500' },
  { emoji: '💭', text: 'Private space for honest expression',          color: 'from-pink-400 to-purple-600'  },
  { emoji: '📅', text: 'Mood tracking for self-awareness',             color: 'from-indigo-400 to-cyan-500'  },
  { emoji: '💜', text: 'Prioritize your mental wellbeing with privacy', color: 'from-purple-500 to-pink-500'  },
];

/* ─────────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        fontSize: '0.62rem', letterSpacing: '0.38em', color: 'var(--mauve)',
        fontWeight: 300, marginBottom: '1.1rem', textTransform: 'uppercase',
        fontFamily: 'var(--font-body)',
      }}
    >
      ✦ &nbsp; {children}
    </motion.p>
  );
}

/* ─────────────────────────────────────────────
   MOBILE MENU
───────────────────────────────────────────── */
function MobileMenu({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            top: '3.8rem',
            left: 0,
            right: 0,
            zIndex: 899,
            background: 'rgba(250,243,236,0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(155,127,166,0.12)',
            padding: '1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
          }}
        >
          {['About', 'Services', 'Contact'].map((label) => (
            <a key={label} href={`#${label.toLowerCase()}`}
              onClick={onClose}
              style={{
                fontSize: '1rem', letterSpacing: '0.12em', color: 'var(--mauve)',
                fontWeight: 300, fontFamily: 'var(--font-body)', textDecoration: 'none',
              }}>
              {label}
            </a>
          ))}
          <Link href="/login"
            onClick={onClose}
            style={{
              display: 'inline-block', padding: '0.55rem 1.4rem',
              borderRadius: '999px', background: 'var(--mauve)', color: '#fff',
              fontSize: '0.82rem', letterSpacing: '0.08em', fontWeight: 400,
              fontFamily: 'var(--font-body)', textDecoration: 'none',
              alignSelf: 'flex-start',
            }}>
            Login
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function DearDiaryPremiumLanding() {
  const [loaded, setLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (loaded) {
      const t = setTimeout(() => setShowContent(true), 80);
      return () => clearTimeout(t);
    }
  }, [loaded]);

  return (
    <>
      <GlobalStyles />

      <AnimatePresence>
        {!loaded && <Loader onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showContent && (
          <motion.div
            key="page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.65 }}
          >
            <ScrollBar />

            {/* ════ NAVBAR ════ */}
            <motion.nav
              initial={{ y: -52, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                background: 'rgba(250,243,236,0.88)',
                borderBottom: '1px solid rgba(155,127,166,0.1)',
              }}
            >
              <div style={{
                maxWidth: '80rem', margin: '0 auto',
                padding: '0.9rem 1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <motion.span
                  whileHover={{ letterSpacing: '0.12em' }}
                  transition={{ duration: 0.35 }}
                  style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.4rem',
                    fontWeight: 400, color: 'var(--mauve)', letterSpacing: '0.05em',
                  }}
                >
                  Dear Diary
                </motion.span>

                {/* Desktop links */}
                <div className="nav-links">
                  <div className="nav-text-links">
                    {['About', 'Services', 'Contact'].map((label) => (
                      <a key={label} href={`#${label.toLowerCase()}`} className="ink-link"
                        style={{ fontSize: '0.8rem', letterSpacing: '0.1em', color: 'var(--mauve)', fontWeight: 300, fontFamily: 'var(--font-body)' }}>
                        {label}
                      </a>
                    ))}
                  </div>
                  <MagneticWrap>
                    <Link href="/login" style={{
                      display: 'inline-block', padding: '0.5rem 1.35rem',
                      borderRadius: '999px', background: 'var(--mauve)', color: '#fff',
                      fontSize: '0.76rem', letterSpacing: '0.08em', fontWeight: 400,
                      fontFamily: 'var(--font-body)', textDecoration: 'none',
                      boxShadow: '0 4px 14px rgba(155,127,166,0.28)',
                    }}>
                      Login
                    </Link>
                  </MagneticWrap>

                  {/* Hamburger — visible only on mobile via CSS */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                    style={{
                      display: 'none',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.3rem',
                      flexDirection: 'column',
                      gap: '5px',
                    }}
                    className="hamburger-btn"
                  >
                    <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--mauve)', borderRadius: 2, transition: 'transform 0.3s', transform: mobileMenuOpen ? 'rotate(45deg) translate(4.5px, 4.5px)' : 'none' }} />
                    <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--mauve)', borderRadius: 2, transition: 'opacity 0.3s', opacity: mobileMenuOpen ? 0 : 1 }} />
                    <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--mauve)', borderRadius: 2, transition: 'transform 0.3s', transform: mobileMenuOpen ? 'rotate(-45deg) translate(4.5px, -4.5px)' : 'none' }} />
                  </button>
                </div>
              </div>

              <style jsx>{`
                @media (max-width: 640px) {
                  .hamburger-btn { display: flex !important; }
                }
              `}</style>
            </motion.nav>

            {/* Mobile slide-down menu */}
            <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

            {/* ════ HERO ════ */}
            <section style={{
              position: 'relative',
              minHeight: '100vh',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              paddingTop: '8rem', paddingBottom: '5rem',
              paddingLeft: '1.5rem', paddingRight: '1.5rem',
              overflow: 'hidden',
              background: `
                radial-gradient(ellipse 75% 65% at 12% 28%, rgba(232,201,176,0.38) 0%, transparent 56%),
                radial-gradient(ellipse 65% 75% at 88% 72%, rgba(201,184,212,0.32) 0%, transparent 56%),
                #faf3ec
              `,
            }}>
              <div className="hero-grain" />
              <Particles />

              {/* Rotating rings */}
              <motion.div className="deco-ring"
                style={{ width: 660, height: 660, top: '50%', left: '50%', marginLeft: -330, marginTop: -330, zIndex: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div className="deco-ring"
                style={{ width: 440, height: 440, top: '50%', left: '50%', marginLeft: -220, marginTop: -220, zIndex: 0, opacity: 0.06 }}
                animate={{ rotate: -360 }}
                transition={{ duration: 65, repeat: Infinity, ease: 'linear' }}
              />

              {/* Content */}
              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%', maxWidth: '56rem' }}>

                <motion.p
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  style={{ fontSize: '0.62rem', letterSpacing: '0.42em', color: 'var(--mauve)', fontWeight: 300, textTransform: 'uppercase', fontFamily: 'var(--font-body)', marginBottom: '2rem' }}
                >
                  ✦ &nbsp; A sanctuary for your inner world &nbsp; ✦
                </motion.p>

                {/* Headline */}
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, color: 'var(--ink)', letterSpacing: '-0.015em', lineHeight: 1 }}>
                  <span style={{ display: 'block', overflow: 'hidden', fontSize: 'clamp(2.6rem, 8.5vw, 8rem)' }}>
                    <motion.span style={{ display: 'block' }}
                      initial={{ y: '108%' }} animate={{ y: '0%' }}
                      transition={{ delay: 0.42, duration: 1.05, ease: [0.16, 1, 0.3, 1] }}>
                      Your thoughts
                    </motion.span>
                  </span>
                  <span style={{ display: 'block', overflow: 'hidden', fontSize: 'clamp(2.6rem, 8.5vw, 8rem)' }}>
                    <motion.span style={{ display: 'block' }}
                      initial={{ y: '108%' }} animate={{ y: '0%' }}
                      transition={{ delay: 0.57, duration: 1.05, ease: [0.16, 1, 0.3, 1] }}>
                      deserve a
                    </motion.span>
                  </span>
                  <span style={{ display: 'block', overflow: 'hidden', fontSize: 'clamp(2.6rem, 8.5vw, 8rem)' }}>
                    <motion.span
                      style={{
                        display: 'block', fontStyle: 'italic', fontWeight: 400,
                        background: 'linear-gradient(120deg, #9b7fa6 20%, #c9a96e 85%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                      }}
                      initial={{ y: '108%' }} animate={{ y: '0%' }}
                      transition={{ delay: 0.72, duration: 1.05, ease: [0.16, 1, 0.3, 1] }}>
                      beautiful space
                    </motion.span>
                  </span>
                </h2>

                <motion.p
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.7 }}
                  style={{
                    marginTop: '2rem', fontSize: 'clamp(0.88rem, 2.5vw, 1.02rem)', color: 'var(--muted)',
                    fontWeight: 300, lineHeight: 1.9, letterSpacing: '0.01em',
                    maxWidth: '29rem', marginLeft: 'auto', marginRight: 'auto',
                    fontFamily: 'var(--font-body)',
                    padding: '0 0.5rem',
                  }}
                >
                  Dear Diary is a personal sanctuary to write, reflect,
                  and visualize your emotional journey — safely and beautifully.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.65 }}
                  style={{ marginTop: '2.8rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', padding: '0 1rem' }}
                >
                  <MagneticWrap>
                    <Link href="/signup" style={{
                      display: 'inline-block', padding: '0.85rem 2.1rem',
                      borderRadius: '999px', background: 'var(--mauve)', color: '#fff',
                      fontSize: '0.8rem', letterSpacing: '0.09em', fontWeight: 400,
                      fontFamily: 'var(--font-body)', textDecoration: 'none',
                      boxShadow: '0 7px 26px rgba(155,127,166,0.32)',
                      whiteSpace: 'nowrap',
                    }}>
                      Start Journaling →
                    </Link>
                  </MagneticWrap>
                  <MagneticWrap>
                    <a href="#about" style={{
                      display: 'inline-block', padding: '0.85rem 2.1rem',
                      borderRadius: '999px', border: '1.5px solid rgba(155,127,166,0.3)',
                      color: 'var(--mauve)', fontSize: '0.8rem', letterSpacing: '0.09em',
                      fontWeight: 300, fontFamily: 'var(--font-body)', textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}>
                      Explore
                    </a>
                  </MagneticWrap>
                </motion.div>

                {/* Scroll hint */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 1.65, duration: 0.9 }}
                  style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
                >
                  <span style={{ fontSize: '0.58rem', letterSpacing: '0.38em', color: 'var(--mauve)', opacity: 0.4, textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>
                    scroll
                  </span>
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, var(--mauve), transparent)', opacity: 0.32 }}
                  />
                </motion.div>
              </div>
            </section>

            {/* ════ MARQUEE ════ */}
            <MarqueeStrip />

            {/* ════ ABOUT ════ */}
            <section id="about" style={{
              position: 'relative', padding: 'clamp(3.5rem, 7vw, 6rem) clamp(1rem, 4vw, 2.5rem)', overflow: 'hidden',
              background: 'linear-gradient(160deg, #f9f3ee 0%, #f4edf8 100%)',
            }}>
              <div className="blob" style={{
                position: 'absolute', top: '-7rem', left: '-7rem',
                width: 360, height: 360, borderRadius: '50%',
                background: 'radial-gradient(circle, #c9b8d4, transparent)',
                filter: 'blur(55px)', opacity: 0.2, pointerEvents: 'none',
              }} />
              <div className="blob blob-2" style={{
                position: 'absolute', bottom: '-5rem', right: '-5rem',
                width: 320, height: 320, borderRadius: '50%',
                background: 'radial-gradient(circle, #e8c9b0, transparent)',
                filter: 'blur(55px)', opacity: 0.17, pointerEvents: 'none',
              }} />

              <div style={{ maxWidth: '72rem', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                  <SectionLabel>Why it matters</SectionLabel>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontWeight: 300, color: 'var(--ink)',
                    fontSize: 'clamp(1.9rem, 4.5vw, 4.2rem)', letterSpacing: '-0.01em', lineHeight: 1.15,
                  }}>
                    <SplitHeading delay={0}>About</SplitHeading>
                    {' '}
                    <em style={{ fontStyle: 'italic', color: 'var(--mauve)' }}>
                      <SplitHeading delay={0.07}>Dear Diary</SplitHeading>
                    </em>
                  </h3>
                  <motion.div
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                    transition={{ duration: 0.75, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      height: 1, width: 68, margin: '1.3rem auto 0',
                      background: 'linear-gradient(to right, var(--mauve), #c9a96e)',
                      transformOrigin: 'left center',
                    }}
                  />
                </div>

                <div className="benefits-grid">
                  {BENEFITS.map((item, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      transition={{ duration: 0.62, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ y: -6 }}
                      className="glass-card"
                      style={{ borderRadius: '1.4rem', padding: '1.8rem', cursor: 'default', position: 'relative' }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.16, rotate: 5 }}
                        transition={{ duration: 0.28 }}
                        style={{ fontSize: '2.5rem', marginBottom: '1.1rem', display: 'block' }}
                      >
                        {item.emoji}
                      </motion.div>
                      <p style={{
                        fontFamily: 'var(--font-display)', fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
                        fontWeight: 400, color: 'var(--ink)', lineHeight: 1.45,
                      }}>
                        {item.text}
                      </p>
                      <motion.div
                        style={{ height: 1, background: 'var(--mauve)', marginTop: '1.1rem', borderRadius: '999px', transformOrigin: 'left', scaleX: 0 }}
                        whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                        transition={{ duration: 0.65, delay: i * 0.08 + 0.38 }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ════ SERVICES ════ */}
            <section id="services" style={{ padding: 'clamp(3.5rem, 7vw, 6rem) clamp(1rem, 4vw, 2.5rem)', background: 'var(--cream)', overflow: 'hidden' }}>
              <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
                <div style={{
                  display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
                  alignItems: 'flex-end', gap: '1.5rem', marginBottom: '3rem',
                }}>
                  <div>
                    <SectionLabel>What we offer</SectionLabel>
                    <h3 style={{
                      fontFamily: 'var(--font-display)', fontWeight: 300, color: 'var(--ink)',
                      fontSize: 'clamp(2rem, 5vw, 4.8rem)', letterSpacing: '-0.02em', lineHeight: 1.05,
                    }}>
                      Our{' '}
                      <em style={{ fontStyle: 'italic', color: 'var(--mauve)' }}>
                        Services
                      </em>
                    </h3>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, x: 14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    style={{ color: 'var(--muted)', fontSize: '0.92rem', maxWidth: '19rem', fontWeight: 300, lineHeight: 1.75, fontFamily: 'var(--font-body)' }}
                  >
                    Everything you need to capture your thoughts and master your mindset.
                  </motion.p>
                </div>

                <div className="services-grid">
                  {SERVICES.map((s, i) => <ServiceCard key={i} {...s} />)}
                </div>
              </div>
            </section>

            {/* ════ CONTACT ════ */}
            <section id="contact" style={{
              position: 'relative', padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 2.5rem)', overflow: 'hidden',
              background: 'linear-gradient(140deg, #f4edf8 0%, #fdf5ed 100%)',
            }}>
              <div className="blob blob-3" style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                width: 300, height: 300, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(155,127,166,0.11), transparent)',
                filter: 'blur(65px)', opacity: 0.55, pointerEvents: 'none',
              }} />

              <motion.div
                initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true }}
                style={{ position: 'relative', maxWidth: '50rem', margin: '0 auto', zIndex: 1 }}
              >
                <div className="glass-card" style={{
                  borderRadius: '2.2rem',
                  padding: 'clamp(1.8rem, 5vw, 4.5rem)',
                  textAlign: 'center',
                  boxShadow: '0 20px 56px rgba(155,127,166,0.09)',
                }}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }} viewport={{ once: true }}
                    style={{
                      display: 'inline-block', padding: '0.28rem 0.90rem', marginBottom: '1.0rem',
                      borderRadius: '999px', fontSize: '0.9rem', letterSpacing: '0.3em',
                      textTransform: 'uppercase', fontWeight: 400, color: 'var(--mauve)',
                      background: 'rgba(155,127,166,0.07)', fontFamily: 'var(--font-body)',
                    }}
                  >
                    Get in touch
                  </motion.div>

                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.2vw, 3.8rem)',
                    fontWeight: 300, color: 'var(--ink)', lineHeight: 1.12, marginBottom: '1.0rem',
                  }}>
                    <SplitHeading>We would love to</SplitHeading>
                    <br />
                    <em style={{ fontStyle: 'italic', color: 'var(--mauve)' }}>
                      <SplitHeading delay={0.07}>connect with you</SplitHeading>
                    </em>
                  </h3>

                  <p style={{
                    fontSize: 'clamp(0.85rem, 2.5vw, 0.96rem)', color: 'var(--muted)', maxWidth: '25rem',
                    margin: '0 auto 2.0rem', fontWeight: 400, lineHeight: 1.9, fontFamily: 'var(--font-body)',
                  }}>
                    Feedback, collaborations, or just a hello — our digital door is always open.
                  </p>

                  <div className="contact-buttons">
                    <MagneticWrap>
                      <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        href="mailto:sharmahazel310@gmail.com"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.55rem',
                          padding: '0.6rem 1.4rem', borderRadius: '0.9rem',
                          background: 'var(--mauve)', color: '#fff',
                          fontSize: '0.82rem', letterSpacing: '0.04em', fontWeight: 400,
                          fontFamily: 'var(--font-body)', textDecoration: 'none',
                          boxShadow: '0 5px 18px rgba(155,127,166,0.26)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span>💌</span> DearDiary@gmail.com
                      </motion.a>
                    </MagneticWrap>
                    <MagneticWrap>
                      <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        href="https://hazel-sharma.vercel.app/" target="_blank" rel="noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.55rem',
                          padding: '0.6rem 1.4rem', borderRadius: '0.9rem',
                          background: '#fff', border: '1.5px solid rgba(155,127,166,0.2)',
                          color: 'var(--mauve)', fontSize: '0.82rem', letterSpacing: '0.04em',
                          fontWeight: 300, fontFamily: 'var(--font-body)', textDecoration: 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span>🔗</span> Founder — Hazel Sharma 
                      </motion.a>
                    </MagneticWrap>
                  </div>
                  <MagneticWrap>
                      <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        href="https://www.linkedin.com/in/hazelsharma-it/"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.55rem',
                          padding: '0.6rem 1.4rem', borderRadius: '0.9rem',
                          background: 'var(--mauve)', color: '#fff',
                          fontSize: '0.82rem', letterSpacing: '0.04em', fontWeight: 400,
                          fontFamily: 'var(--font-body)', textDecoration: 'none',
                          boxShadow: '0 5px 18px rgba(155,127,166,0.26)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span>⚙️</span> Hazel_Sharma Linkedin
                      </motion.a>
                    </MagneticWrap>

                  <div style={{
                    marginTop: '3rem', paddingTop: '1.3rem',
                    borderTop: '1px solid rgba(14, 14, 14, 0.09)',
                    display: 'flex', justifyContent: 'center', gap: '2rem', opacity: 0.78,
                    flexWrap: 'wrap',
                  }}>
                    {['come', 'join', 'Dear Diary'].map((w, i) => (
                      <span key={i} style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--muted)' }}>
                        {w}
                      </span>
                    ))}
                  </div>
                </div>

                <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ position: 'absolute', top: '-1.8rem', left: '-1.8rem', fontSize: '2.2rem', pointerEvents: 'none' }}>✨</motion.div>
                <motion.div animate={{ y: [0, 14, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                  style={{ position: 'absolute', bottom: '-1.8rem', right: '-1.8rem', fontSize: '2.2rem', pointerEvents: 'none' }}>💜</motion.div>
              </motion.div>
            </section>

            {/* ════ FOOTER ════ */}
            <footer style={{
              padding: '1.3rem 2rem', textAlign: 'center', fontSize: '0.73rem',
              color: 'rgba(15, 14, 15, 0.42)', background: 'var(--cream)',
              borderTop: '1px solid rgba(155,127,166,0.08)',
              fontFamily: 'var(--font-body)', fontWeight: 300, letterSpacing: '0.06em',
            }}>
              © {new Date().getFullYear()} Dear Diary — Designed &amp; built with 💜
            </footer>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}