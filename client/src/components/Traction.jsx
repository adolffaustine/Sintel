import { useSiteContent } from '../hooks/useContent.js';
import Reveal from './Reveal.jsx';

export default function Traction() {
  const content = useSiteContent();
  return (
    <section id="traction" className="section traction">
      <div className="traction__band" aria-hidden="true" />
      <div className="container">
        <div className="traction__grid">
          {content.traction.map((item, i) => (
            <Reveal key={item.label} className="traction__item" delay={i * 90}>
              <span className="traction__stat gradient-text">{item.stat}</span>
              <p className="traction__label">{item.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
