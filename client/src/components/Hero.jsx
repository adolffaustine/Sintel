import { Link } from 'react-router-dom';
import { useSiteContent } from '../hooks/useContent.js';

export default function Hero() {
  const content = useSiteContent();
  const { eyebrow, headline, subheadline, ctaPrimary, ctaSecondary } = content.hero;

  return (
    <section id="top" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <span className="hero__blob hero__blob--a" />
        <span className="hero__blob hero__blob--b" />
        <svg className="hero__circuit" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="currentColor" strokeWidth="1.2" opacity="0.5">
            <path d="M0 80 H220 L260 120 H480" />
            <path d="M0 220 H140 L180 260 H360 L400 220 H800" />
            <path d="M60 0 V140 L100 180 V420" />
            <path d="M760 0 V180 L720 220 V600" />
            <path d="M0 460 H180 L220 500 H520 L560 460 H800" />
          </g>
          <g fill="currentColor">
            <circle cx="220" cy="80" r="4" />
            <circle cx="480" cy="120" r="4" />
            <circle cx="140" cy="220" r="4" />
            <circle cx="400" cy="220" r="4" />
            <circle cx="60" cy="140" r="4" />
            <circle cx="720" cy="220" r="4" />
            <circle cx="220" cy="500" r="4" />
            <circle cx="560" cy="460" r="4" />
          </g>
        </svg>
      </div>

      <div className="hero__inner container">
        <p className="eyebrow hero__eyebrow">{eyebrow}</p>
        <h1 className="hero__headline">
          <span className="gradient-text">{headline}</span>
        </h1>
        <p className="hero__subheadline">{subheadline}</p>
        <div className="hero__ctas">
          <Link to="/projects" className="btn btn--primary btn--lg">
            {ctaPrimary}
          </Link>
          <Link to="/contact" state={{ inquiryType: 'investor' }} className="btn btn--outline btn--lg">
            {ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
