// Shared 4-hue accent cycle for card grids (Values, FocusAreas, WhyInvest,
// Projects, Home projects teaser). Rather than alternating 2-way between
// --accent/--accent-2 via `i % 2`, every card in a grid gets its own inline
// custom properties so the CSS (see index.css `.card` + per-card rules) can
// pick up a distinct accent, ink color, soft background and glow per card
// without needing a modifier class per hue.
const ACCENT_KEYS = ['accent', 'accent-2', 'accent-3', 'accent-4'];

const GLOW_NAMES = {
  accent: 'accent',
  'accent-2': 'violet',
  'accent-3': 'amber',
  'accent-4': 'pink',
};

export function cardAccentStyle(index) {
  const key = ACCENT_KEYS[index % ACCENT_KEYS.length];
  return {
    '--card-accent': `var(--${key})`,
    '--card-accent-ink': `var(--${key}-ink)`,
    '--card-accent-soft': `var(--${key}-soft)`,
    '--card-glow': `var(--shadow-glow-${GLOW_NAMES[key]})`,
  };
}

export default cardAccentStyle;
