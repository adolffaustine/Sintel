import { useEffect, useState, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo.jsx';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/impact', label: 'Impact' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Close menu on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <Link to="/" className="nav__brand" onClick={() => setMenuOpen(false)}>
          <Logo />
        </Link>

        {/* Desktop nav links */}
        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link
          to="/contact"
          state={{ inquiryType: 'investor' }}
          className="btn btn--primary btn--sm nav__cta"
        >
          Partner With Us
        </Link>

        {/* Hamburger button — mobile only */}
        <button
          className={`nav__burger ${menuOpen ? 'nav__burger--open' : ''}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span className="nav__burger-bar" />
          <span className="nav__burger-bar" />
          <span className="nav__burger-bar" />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      <div
        className={`nav__backdrop ${menuOpen ? 'nav__backdrop--visible' : ''}`}
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile slide-down menu */}
      <div
        id="mobile-menu"
        className={`nav__mobile-menu ${menuOpen ? 'nav__mobile-menu--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation">
          {LINKS.map((link, i) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className="nav__mobile-link"
              style={{ '--i': i }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__mobile-cta">
          <Link
            to="/contact"
            state={{ inquiryType: 'investor' }}
            className="btn btn--primary"
            onClick={() => setMenuOpen(false)}
          >
            Partner With Us
          </Link>
        </div>
      </div>
    </header>
  );
}
