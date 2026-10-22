import { BrainCircuit, RadioTower, Globe, Cpu, Network, Sprout } from 'lucide-react';
import { useSiteContent } from '../hooks/useContent.js';
import Reveal from './Reveal.jsx';
import { cardAccentStyle } from '../utils/cardAccent.js';

const ICONS = {
  'brain-circuit': BrainCircuit,
  'radio-tower': RadioTower,
  globe: Globe,
  cpu: Cpu,
  network: Network,
  sprout: Sprout,
};

export default function FocusAreas() {
  const content = useSiteContent();
  return (
    <section id="focus-areas" className="section focus-areas">
      <div className="container">
        <Reveal as="div" className="section-head">
          <p className="eyebrow">What We Build</p>
          <h2 className="section-title">
            Different Domains, One Engineering Team<span className="section-title__underline" aria-hidden="true" />
          </h2>
        </Reveal>

        <div className="focus-areas__grid">
          {content.focusAreas.map((area, i) => {
            const Icon = ICONS[area.icon] || Cpu;
            return (
              <Reveal
                key={area.title}
                className="card focus-card"
                delay={(i % 3) * 90}
                style={cardAccentStyle(i)}
              >
                <span className="focus-card__icon">
                  <Icon size={26} strokeWidth={1.75} />
                </span>
                <h3 className="focus-card__title">{area.title}</h3>
                <p className="focus-card__desc">{area.description}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
