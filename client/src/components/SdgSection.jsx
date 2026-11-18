import { useSiteContent } from '../hooks/useContent.js';
import { sdgColor } from '../data/sdgColors.js';
import Reveal from './Reveal.jsx';

export default function SdgSection() {
  const content = useSiteContent();
  const { title, subtitle, sdgs } = content.sdgSection;

  return (
    <section id="impact" className="section sdg-section">
      <div className="container">
        <Reveal as="div" className="section-head">
          <h2 className="section-title">
            {title}
            <span className="section-title__underline" aria-hidden="true" />
          </h2>
          <p className="section-subtitle">{subtitle}</p>
        </Reveal>

        <Reveal className="sdg-section__row">
          {sdgs.map((sdg) => (
            <span key={sdg.number} className="sdg-chip" style={{ borderColor: sdgColor(sdg.number) }}>
              <span className="sdg-chip__num" style={{ background: sdgColor(sdg.number) }}>
                {sdg.number}
              </span>
              <span className="sdg-chip__name">{sdg.name}</span>
            </span>
          ))}
        </Reveal>
        <div className="sdg-section__visual" aria-hidden="true">
          {sdgs.map((sdg) => (
            <span
              key={sdg.number}
              className="sdg-badge"
              style={{
                background: sdgColor(sdg.number),
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              }}
            >
              {sdg.number}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
