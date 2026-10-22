import Reveal from '../components/Reveal.jsx';
import VisionMission from '../components/VisionMission.jsx';
import Values from '../components/Values.jsx';
import WhyInvest from '../components/WhyInvest.jsx';
import Team from '../components/Team.jsx';

const INTRO =
  "Sintel Technologies is an African deep-tech company working at the intersection of AI, IoT, embedded systems, electronics and networking — and we don't stop at research. We build our own products for Africa's hardest problems, and we deliver that same engineering discipline as services: infrastructure and hosting, custom corporate systems across agriculture, finance, education, security and beyond, applied research, and data services. Every solution starts as something that has to work in the field, not a slide deck.";

export default function About() {
  return (
    <>
      <section className="section">
        <div className="container">
          <Reveal as="div" className="section-head">
            <h1 className="section-title">
              Who We Are
              <span className="section-title__underline" aria-hidden="true" />
            </h1>
            <p className="section-subtitle about-intro__text">{INTRO}</p>
          </Reveal>
        </div>
      </section>

      <VisionMission />
      <Values />
      <WhyInvest />
      <Team />
    </>
  );
}
