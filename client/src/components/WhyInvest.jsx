import { useSiteContent } from '../hooks/useContent.js';
import Reveal from './Reveal.jsx';
import { cardAccentStyle } from '../utils/cardAccent.js';

export default function WhyInvest() {
  const content = useSiteContent();
  return (
    <section id="why-invest" className="section why-invest">
      <div className="container">
        <Reveal as="div" className="section-head">
          <h2 className="section-title">
            Why Invest in Sintel<span className="section-title__underline" aria-hidden="true" />
          </h2>
        </Reveal>

        <div className="why-invest__grid">
          {content.whyInvest.map((item, i) => (
            <Reveal key={item.title} className="card why-invest-card" delay={i * 80} style={cardAccentStyle(i)}>
              <span className="why-invest-card__glyph" aria-hidden="true" />
              <h3 className="why-invest-card__title">{item.title}</h3>
              <p className="why-invest-card__desc">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
