import { Link } from 'react-router-dom';
import { useSiteContent } from '../hooks/useContent.js';
import { sdgColor } from '../data/sdgColors.js';
import { cardAccentStyle } from '../utils/cardAccent.js';
import Reveal from './Reveal.jsx';

/**
 * Full-detail projects grid — used by the /projects index page. Each card
 * shows the complete description/features/impact and links through to its
 * own /projects/:id detail page.
 */
export default function ProjectsGrid() {
  const content = useSiteContent();
  return (
    <div className="projects__grid">
      {content.projects.map((project, i) => (
        <Reveal
          key={project.id}
          className="card project-card"
          delay={(i % 2) * 100}
          style={cardAccentStyle(i)}
        >
          <span className="project-card__bar" aria-hidden="true" />
          <p className="project-card__eyebrow">PROJECT {String(i + 1).padStart(2, '0')}</p>
          <h3 className="project-card__name">{project.name}</h3>
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

          <Link to={`/projects/${project.id}`} className="project-card__link">
            View full details →
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
