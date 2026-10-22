import { Link, useParams } from 'react-router-dom';
import { useSiteContent } from '../hooks/useContent.js';
import { sdgColor } from '../data/sdgColors.js';
import Reveal from '../components/Reveal.jsx';
import NotFound from './NotFound.jsx';

export default function ProjectDetail() {
  const content = useSiteContent();
  const { id } = useParams();
  const projects = content.projects;
  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) {
    return <NotFound />;
  }

  const project = projects[index];
  const prevProject = projects[(index - 1 + projects.length) % projects.length];
  const nextProject = projects[(index + 1) % projects.length];

  return (
    <section className="section project-detail">
      <div className="container">
        <div className="project-detail__inner">
          <Reveal as="div" className="project-detail__back">
            <Link to="/projects" className="project-detail__back-link">
              ← Back to all projects
            </Link>
          </Reveal>

          <Reveal className="card project-detail__card">
            <span className="project-card__bar" aria-hidden="true" />
            <p className="project-card__eyebrow">PROJECT {String(index + 1).padStart(2, '0')}</p>
            <h1 className="project-card__name project-detail__name">{project.name}</h1>
            <p className="project-card__tagline">{project.tagline}</p>
            <p className="project-card__desc">{project.description}</p>

            <div className="project-card__features">
              <p className="project-card__features-label">Key Features</p>
              <ul>
                {project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>

            <p className="project-card__impact">{project.impact}</p>

            <div className="project-card__sdgs" aria-label="Related Sustainable Development Goals">
              {project.sdgs.map((num) => (
                <span key={num} className="sdg-badge" style={{ background: sdgColor(num) }}>
                  {num}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal className="cta-band project-detail__cta" delay={100}>
            <h2 className="cta-band__title">Interested in this project?</h2>
            <div className="cta-band__actions">
              <Link to="/contact" state={{ inquiryType: 'investor' }} className="btn btn--primary btn--lg">
                Get in Touch
              </Link>
            </div>
          </Reveal>

          <nav className="project-detail__nav" aria-label="Other projects">
            <Link to={`/projects/${prevProject.id}`} className="project-detail__nav-link">
              ← {prevProject.name}
            </Link>
            <Link
              to={`/projects/${nextProject.id}`}
              className="project-detail__nav-link project-detail__nav-link--next"
            >
              {nextProject.name} →
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
