import { Server, Briefcase, FlaskConical, Database } from 'lucide-react';
import { useSiteContent } from '../hooks/useContent.js';
import Reveal from './Reveal.jsx';
import { cardAccentStyle } from '../utils/cardAccent.js';

const ICONS = {
  server: Server,
  briefcase: Briefcase,
  'flask-conical': FlaskConical,
  database: Database,
};

export default function ServicesGrid() {
  const content = useSiteContent();
  return (
    <section id="services" className="section services">
      <div className="container">
        <Reveal as="div" className="section-head">
          <h2 className="section-title">
            {content.services.title}
            <span className="section-title__underline" aria-hidden="true" />
          </h2>
          <p className="section-subtitle">{content.services.subtitle}</p>
        </Reveal>

        <div className="services__grid">
          {content.services.items.map((service, i) => {
            const Icon = ICONS[service.icon] || Server;
            return (
              <Reveal
                key={service.title}
                className="card service-card"
                delay={(i % 2) * 100}
                style={cardAccentStyle(i)}
              >
                <span className="service-card__icon">
                  <Icon size={26} strokeWidth={1.75} />
                </span>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__desc">{service.description}</p>

                {service.tags && (
                  <div className="service-card__tags">
                    {service.tags.map((tag) => (
                      <span key={tag} className="service-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
