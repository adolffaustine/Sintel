import { useSiteContent } from '../hooks/useContent.js';
import Reveal from './Reveal.jsx';

export default function VisionMission() {
  const content = useSiteContent();
  const { vision, mission } = content;

  return (
    <section id="vision" className="section vision-mission">
      <div className="container">
        <div className="vision-mission__grid">
          <Reveal className="statement-card statement-card--accent">
            <span className="statement-card__tag">{vision.title}</span>
            <p className="statement-card__text">{vision.statement}</p>
          </Reveal>
          <Reveal className="statement-card statement-card--violet" delay={120}>
            <span className="statement-card__tag">{mission.title}</span>
            <p className="statement-card__text">{mission.statement}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
