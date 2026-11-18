import Reveal from '../components/Reveal.jsx';
import VisionMission from '../components/VisionMission.jsx';
import Values from '../components/Values.jsx';
import WhyInvest from '../components/WhyInvest.jsx';
import Team from '../components/Team.jsx';
import { useSiteContent } from '../hooks/useContent.js';

const INTRO =
  "Sintel Technologies is an African deep-tech company working at the intersection of AI, IoT, embedded systems, electronics and networking — and we don't stop at research. We build our own products for Africa's hardest problems, and we deliver that same engineering discipline as services: infrastructure and hosting, custom corporate systems across agriculture, finance, education, security and beyond, applied research, and data services. Every solution starts as something that has to work in the field, not a slide deck.";

export default function About() {
  const content = useSiteContent();
  const { team } = content;

  return (
    <>
      <section className="about-banner">
        <div className="about-banner__image">
          <img
            src="https://images.unsplash.com/photo-1504197614791-21045513b0b7?q=80&w=1200&auto=format&fit=crop"
            alt="Engineering team working"
            className="about-banner__img"
            loading="eager"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="about-banner__overlay" />
          <div className="about-banner__content">
            <Reveal as="div" className="about-banner__head">
              <h1 className="section-title">Who We Are<span className="section-title__underline" aria-hidden="true" /></h1>
              <p className="about-banner__sub">{INTRO}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <VisionMission />
      <Values />
      <WhyInvest />
      <Team />
    </>
  );
}
