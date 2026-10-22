import { Link } from 'react-router-dom';
import { useSiteContent } from '../hooks/useContent.js';
import Logo from './Logo.jsx';

const COMPANY_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
];

const WORK_LINKS = [
  { to: '/projects', label: 'Projects' },
  { to: '/impact', label: 'Impact' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  const content = useSiteContent();
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo />
          <p className="footer__tagline">{content.footer.tagline}</p>
          <div className="footer__contact">
            <a href={`mailto:${content.contactInfo.email}`}>{content.contactInfo.email}</a>
            {content.contactInfo.phones.map((phone) => (
              <a key={phone} href={`tel:${phone.replace(/[^+\d]/g, '')}`}>
                {phone}
              </a>
            ))}
          </div>
        </div>

        <nav className="footer__col" aria-label="Company">
          <p className="footer__col-title">Company</p>
          {COMPANY_LINKS.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className="footer__col" aria-label="Work">
          <p className="footer__col-title">Work With Us</p>
          {WORK_LINKS.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="footer__col footer__cta-col">
          <p className="footer__col-title">Ready to talk?</p>
          <p className="footer__cta-text">
            Investor, client or research partner — we'd like to hear what you're building.
          </p>
          <Link to="/contact" state={{ inquiryType: 'investor' }} className="btn btn--primary btn--sm">
            Partner With Us
          </Link>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© 2026 Sintel Technologies. All rights reserved.</p>
      </div>
    </footer>
  );
}
