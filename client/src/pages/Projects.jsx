import Reveal from '../components/Reveal.jsx';
import ProjectsGrid from '../components/ProjectsGrid.jsx';

export default function Projects() {
  return (
    <section className="section projects">
      <div className="container">
        <Reveal as="div" className="section-head">
          <p className="eyebrow">The Portfolio</p>
          <h1 className="section-title">
            Prototypes Already in the Field<span className="section-title__underline" aria-hidden="true" />
          </h1>
        </Reveal>

        <ProjectsGrid />
      </div>
    </section>
  );
}
