import { Link } from 'react-router-dom';
import { Server, Briefcase, FlaskConical, Database } from 'lucide-react';
import Hero from '../components/Hero.jsx';
import Traction from '../components/Traction.jsx';
import FocusAreas from '../components/FocusAreas.jsx';
import Reveal from '../components/Reveal.jsx';
import { useSiteContent } from '../hooks/useContent.js';
import { cardAccentStyle } from '../utils/cardAccent.js';

const SERVICE_ICONS = {
  server: Server,
  briefcase: Briefcase,
  'flask-conical': FlaskConical,
  database: Database,
};

export default function Home() {
  const content = useSiteContent();
  return (
    <>
      <Hero />
      <Traction />
      <FocusAreas />

      <section className="section services-teaser">
        <div className="container">
          <Reveal as="div" className="section-head">
            <h2 className="section-title">
              What We Offer For Our Clients<span className="section-title__underline" aria-hidden="true" />
            </h2>
          </Reveal>

          <div className="services-teaser__grid">
            {content.services.items.map((service, i) => {
              const Icon = SERVICE_ICONS[service.icon] || Server;
              return (
                <Reveal
                  key={service.title}
                  className="services-teaser__item"
                  delay={(i % 2) * 80}
                  style={cardAccentStyle(i)}
                >
                  <span className="services-teaser__icon">
                    <Icon size={22} strokeWidth={1.75} />
                  </span>
                  <span className="services-teaser__title">{service.title}</span>
                </Reveal>
              );
            })}
          </div>

          <div className="projects-teaser__more">
            <Link to="/services" className="btn btn--outline btn--lg">
              Explore Our Services
            </Link>
          </div>
        </div>
      </section>

      <section id="projects" className="section projects">
        <div className="container">
          <Reveal as="div" className="section-head">
            <p className="eyebrow">The Portfolio</p>
            <h2 className="section-title">
              Prototypes Already in the Field<span className="section-title__underline" aria-hidden="true" />
            </h2>
          </Reveal>

          <div className="projects__grid">
            {content.projects.map((project, i) => (
              <Reveal
                key={project.id}
                as={Link}
                to={`/projects/${project.id}`}
                className="card project-card"
                delay={(i % 2) * 100}
                style={cardAccentStyle(i)}
              >
                <span className="project-card__bar" aria-hidden="true" />
                <p className="project-card__eyebrow">PROJECT {String(i + 1).padStart(2, '0')}</p>
                <h3 className="project-card__name">{project.name}</h3>
                <p className="project-card__tagline">{project.tagline}</p>
                <span className="project-card__link">View Project →</span>
              </Reveal>
            ))}
          </div>

          <div className="projects-teaser__more">
            <Link to="/projects" className="btn btn--outline btn--lg">
              See all projects
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="cta-band">
            <h2 className="cta-band__title">Ready to build Africa's next platform with us?</h2>
            <p className="cta-band__subtitle">
              Explore the prototypes we've already shipped, or start a conversation about investing in what's next.
            </p>
            <div className="cta-band__actions">
              <Link to="/projects" className="btn btn--primary btn--lg">
                Explore Our Projects
              </Link>
              <Link to="/contact" state={{ inquiryType: 'investor' }} className="btn btn--outline btn--lg">
                Partner With Us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
