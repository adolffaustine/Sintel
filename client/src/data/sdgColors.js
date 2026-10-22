// Fixed color-per-SDG-number palette. Not the official UN SDG colors,
// but a deliberate, consistent, high-contrast mapping against a dark
// background so the badges read as intentional rather than random.
export const SDG_COLORS = {
  2: '#C9A227',
  3: '#3AA655',
  4: '#C4122E',
  6: '#26BDE2',
  9: '#FD6925',
  10: '#DD1367',
  13: '#3F7E44',
};

export function sdgColor(number) {
  return SDG_COLORS[number] || '#22F2C0';
}
