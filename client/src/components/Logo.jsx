export default function Logo({ showWordmark = true }) {
  return (
    <span className="logo">
      <svg
        className="logo__mark"
        width="34"
        height="34"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        <polygon
          points="50,4 92,27 92,73 50,96 8,73 8,27"
          fill="rgba(34,242,192,0.05)"
          stroke="url(#logoGrad)"
          strokeWidth="4"
        />
        <path
          d="M36 36 L66 36 L36 50 L66 50 L66 64 L36 64"
          stroke="url(#logoGrad)"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark && (
        <span className="logo__word">
          Sintel <span className="logo__word-light">Technologies</span>
        </span>
      )}
    </span>
  );
}
