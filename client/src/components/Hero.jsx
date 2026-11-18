import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Radio, Globe, Cpu } from 'lucide-react';
import { useSiteContent } from '../hooks/useContent.js';

const CYCLING_WORDS = ['Intelligent', 'Resilient', 'Connected', 'Future-Ready'];

const TECH_CARDS = [
  { icon: Brain,  name: 'AI / NLP Models',    status: 'Active',    border: '#22f2c0' },
  { icon: Radio,  name: 'IoT Sensors',         status: 'Deployed',  border: '#7c5cff' },
  { icon: Globe,  name: 'Web Platforms',        status: 'Active',    border: '#ffb020' },
  { icon: Cpu,    name: 'Embedded Systems',     status: 'In Field',  border: '#ff5ca8' },
];

const STATS = [
  { target: 4,  suffix: '+', label: 'Prototypes' },
  { target: 7,  suffix: '',  label: 'SDGs Addressed' },
  { target: 5,  suffix: '',  label: 'Tech Domains' },
];

function useCountUp(target, duration = 1200, started = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = null;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, started]);
  return value;
}

function StatItem({ stat, started }) {
  const val = useCountUp(stat.target, 1000, started);
  return (
    <div className="hero-dark__stat">
      <span className="hero-dark__stat-num">{val}{stat.suffix}</span>
      <span className="hero-dark__stat-label">{stat.label}</span>
    </div>
  );
}

export default function Hero() {
  const content = useSiteContent();
  const { subheadline, ctaPrimary, ctaSecondary, backgroundImage: heroBgImage } = content.hero;

  const [wordIdx, setWordIdx] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef(null);

  // Staggered mount animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Word cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % CYCLING_WORDS.length);
        setWordVisible(true);
      }, 350);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  // Count-up trigger when stats scroll into view
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsStarted(true); },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="top" className="hero-dark">
      {/* ── Background ──────────────────────────────────────── */}
      <div className="hero-dark__bg" aria-hidden="true">
        {heroBgImage ? (
          <>
            <div className="hero-dark__bg-fallback" aria-hidden="true" />
            <img
              src={heroBgImage}
              alt=""
              className="hero-dark__bg-image"
              aria-hidden="true"
              decoding="async"
              loading="eager"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="hero-dark__overlay" aria-hidden="true" />
          </>
        ) : (
          <div className="hero-dark__bg-fallback" aria-hidden="true" />
        )}
        <span className="hero-dark__orb hero-dark__orb--a" />
        <span className="hero-dark__orb hero-dark__orb--b" />
        <span className="hero-dark__orb hero-dark__orb--c" />

        {/* Particle grid */}
        <div className="hero-dark__particles">
          {Array.from({ length: 80 }).map((_, i) => (
            <span key={i} className="hero-dark__particle" style={{ animationDelay: `${(i * 0.17) % 3}s` }} />
          ))}
        </div>

        {/* Animated circuit SVG */}
        <svg
          className="hero-dark__circuit"
          viewBox="0 0 1200 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g stroke="#22f2c0" strokeWidth="1" opacity="0.25">
            <path className="hero-dark__circuit-line" d="M0 120 H300 L360 180 H600 L660 120 H900" />
            <path className="hero-dark__circuit-line" style={{ animationDelay: '0.4s' }} d="M0 350 H180 L240 290 H520 L580 350 H1200" />
            <path className="hero-dark__circuit-line" style={{ animationDelay: '0.8s' }} d="M0 560 H240 L300 500 H500" />
            <path className="hero-dark__circuit-line" style={{ animationDelay: '0.2s' }} d="M100 0 V180 L160 240 V460 L100 520 V700" />
            <path className="hero-dark__circuit-line" style={{ animationDelay: '1.0s' }} d="M1100 0 V280 L1040 340 V700" />
            <path className="hero-dark__circuit-line" style={{ animationDelay: '0.6s' }} d="M600 0 V140 L660 200 V380" />
          </g>
          <g fill="#22f2c0" opacity="0.4">
            <circle cx="300" cy="120" r="3.5" />
            <circle cx="600" cy="120" r="3.5" />
            <circle cx="180" cy="350" r="3.5" />
            <circle cx="580" cy="350" r="3.5" />
            <circle cx="100" cy="180" r="3.5" />
            <circle cx="1040" cy="340" r="3.5" />
            <circle cx="660" cy="200" r="3.5" />
            <circle cx="300" cy="500" r="3.5" />
          </g>
        </svg>
      </div>

      {/* ── Main grid ───────────────────────────────────────── */}
      <div className="hero-dark__inner container">

        {/* LEFT — text content */}
        <div className={`hero-dark__content${mounted ? ' hero-dark__content--visible' : ''}`}>

          {/* Eyebrow badge */}
          <div className="hero-dark__badge" style={{ animationDelay: '0.05s' }}>
            African Deep-Tech · Est. 2024
          </div>

          {/* Headline */}
          <h1 className="hero-dark__headline">
            Engineering Africa's Next{' '}
            <span className={`hero-dark__word${wordVisible ? ' hero-dark__word--in' : ' hero-dark__word--out'}`}>
              {CYCLING_WORDS[wordIdx]}
            </span>
            <br />
            <span className="hero-dark__headline-systems">Systems</span>
          </h1>

          {/* Subheadline */}
          <p className="hero-dark__sub">
            {subheadline || 'Building intelligent, resilient infrastructure for Africa\'s emerging digital economy — from AI models to embedded IoT systems.'}
          </p>

          {/* CTAs */}
          <div className="hero-dark__ctas">
            <Link to="/projects" className="btn btn--primary btn--lg">
              {ctaPrimary || 'Explore Projects'}
            </Link>
            <Link to="/contact" state={{ inquiryType: 'investor' }} className="btn btn--outline btn--lg hero-dark__cta-outline">
              {ctaSecondary || 'Partner With Us'}
            </Link>
          </div>

          {/* Stats row */}
          <div className="hero-dark__stats" ref={statsRef}>
            {STATS.map((stat) => (
              <StatItem key={stat.label} stat={stat} started={statsStarted} />
            ))}
          </div>
        </div>

        {/* RIGHT — tech showcase panel (desktop only) */}
        <div className="hero-dark__visual" aria-hidden="true">
          {/* Faint Africa/globe SVG behind panel */}
          <svg
            className="hero-dark__globe"
            viewBox="0 0 400 480"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Abstract Africa outline — simplified polygon */}
            <path
              d="M200 20 C240 25 285 50 300 90 C320 130 315 165 310 190
                 C330 210 340 240 330 275 C318 315 295 340 280 365
                 C265 390 255 420 240 445 C228 465 215 475 200 478
                 C185 475 172 465 160 445 C145 420 135 390 120 365
                 C105 340 82 315 70 275 C60 240 70 210 90 190
                 C85 165 80 130 100 90 C115 50 160 25 200 20Z"
              stroke="#22f2c0"
              strokeWidth="1.5"
              fill="none"
              opacity="0.15"
            />
            {/* Grid lines on globe */}
            <ellipse cx="200" cy="249" rx="130" ry="229" stroke="#7c5cff" strokeWidth="0.8" opacity="0.08" />
            <ellipse cx="200" cy="249" rx="80" ry="229" stroke="#7c5cff" strokeWidth="0.8" opacity="0.08" />
            <ellipse cx="200" cy="249" rx="30" ry="229" stroke="#7c5cff" strokeWidth="0.8" opacity="0.06" />
            <ellipse cx="200" cy="150" rx="130" ry="40" stroke="#7c5cff" strokeWidth="0.8" opacity="0.07" />
            <ellipse cx="200" cy="249" rx="130" ry="40" stroke="#7c5cff" strokeWidth="0.8" opacity="0.07" />
            <ellipse cx="200" cy="348" rx="130" ry="40" stroke="#7c5cff" strokeWidth="0.8" opacity="0.07" />
          </svg>

          {/* Floating glass panel */}
          <div className="hero-dark__panel">
            <div className="hero-dark__panel-title">
              <span className="hero-dark__dot" />
              <span>Live Systems</span>
            </div>

            <div className="hero-dark__tech-grid">
              {TECH_CARDS.map(({ icon: Icon, name, status, border }) => (
                <div
                  key={name}
                  className="hero-dark__tech-card"
                  style={{ borderLeftColor: border }}
                >
                  <span className="hero-dark__tech-icon">
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <span className="hero-dark__tech-name">{name}</span>
                  <span className="hero-dark__tech-status">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
