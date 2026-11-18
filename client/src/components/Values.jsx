import { useSiteContent } from '../hooks/useContent.js';
import Reveal from './Reveal.jsx';
import { cardAccentStyle } from '../utils/cardAccent.js';

export default function Values() {
  const content = useSiteContent();
  return (
    <section id="values" className="section values">
      <div className="container">
        <Reveal as="div" className="section-head">
          <h2 className="section-title">
            What We Stand For<span className="section-title__underline" aria-hidden="true" />
          </h2>
        </Reveal>

        <div className="values__grid">
          {content.values.map((value, i) => (
            <Reveal key={value.title} className="card value-card" delay={i * 80} style={cardAccentStyle(i)}>
              <div className="value-card__image-wrap">
                {value.image ? (
                  <img
                    src={value.image}
                    alt={value.title}
                    className="value-card__image"
                    loading="eager"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : null}
                <div className="value-card__image-fallback">
                  <span className="value-card__index">{String(i + 1).padStart(2, '0')}</span>
                </div>
              </div>
              <h3 className="value-card__title">{value.title}</h3>
              <p className="value-card__desc">{value.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
