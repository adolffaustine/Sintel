import { useSiteContent } from '../hooks/useContent.js';
import Reveal from './Reveal.jsx';
import { cardAccentStyle } from '../utils/cardAccent.js';

function initials(name) {
  return name.slice(0, 2).toUpperCase();
}

function fanStyle(index, total) {
  const mid = (total - 1) / 2;
  const offset = index - mid;
  return {
    '--fan-x': `${offset * 46}px`,
    '--fan-y': `${Math.abs(offset) * 10}px`,
    '--fan-rot': `${offset * 8}deg`,
    '--fan-z': total - index,
  };
}

export default function Team() {
  const content = useSiteContent();
  const { title, subtitle, members } = content.team;

  return (
    <section id="team" className="section team">
      <div className="container">
        <Reveal as="div" className="team__inner">
          <h2 className="section-title section-title--center">
            {title}
            <span className="section-title__underline section-title__underline--center" aria-hidden="true" />
          </h2>
          <p className="team__subtitle">{subtitle}</p>
        </Reveal>

        <Reveal className="team__cluster" delay={100}>
          {members.map((member, i) => (
            <button
              key={member.name}
              type="button"
              className="team-avatar"
              style={{ ...fanStyle(i, members.length), ...cardAccentStyle(i) }}
              aria-label={`${member.name}${member.role ? `, ${member.role}` : ''}`}
            >
              <span className="team-avatar__circle">{initials(member.name)}</span>
              <span className="team-avatar__tip">
                <span className="team-avatar__tip-name">{member.name}</span>
                {member.role && <span className="team-avatar__tip-role">{member.role}</span>}
              </span>
            </button>
          ))}
        </Reveal>

        <div className="team__roster">
          {members.map((member, i) => (
            <Reveal key={member.name} as="span" className="team-roster__item" delay={(i % 3) * 60}>
              <span className="team-roster__dot" style={cardAccentStyle(i)} aria-hidden="true" />
              <span className="team-roster__name">{member.name}</span>
              {member.role && <span className="team-roster__role"> · {member.role}</span>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
