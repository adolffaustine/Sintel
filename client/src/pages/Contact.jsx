import ContactForm from '../components/ContactForm.jsx';
import { useSiteContent } from '../hooks/useContent.js';
import Reveal from '../components/Reveal.jsx';

export default function Contact() {
  const content = useSiteContent();
  const { title, subtitle, investorNote, image: contactImage } = content.contact;
  const { email: contactEmail, phones: contactPhones } = content.contactInfo;

  return (
    <section className="contact-page">
      {contactImage && (
        <div className="contact-page__banner">
          <img
            src={contactImage}
            alt="Contact"
            className="contact-page__banner-image"
            loading="eager"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="contact-page__banner-fallback" />
          <div className="contact-page__banner-overlay" />
          <div className="contact-page__banner-content">
            <Reveal as="div" className="contact-page__banner-head">
              <h1 className="contact-page__banner-title">{title}</h1>
              <p className="contact-page__banner-sub">{subtitle}</p>
            </Reveal>
          </div>
        </div>
      )}
      <div className="container contact-page__container">
        <Reveal as="div" className="section-head contact-page__head">
          <h2 className="section-title">Get in Touch<span className="section-title__underline" aria-hidden="true" /></h2>
          <p className="section-subtitle">{investorNote}</p>
        </Reveal>
        <div className="contact-page__grid">
          <div className="contact-page__info">
            <h3 className="contact-page__info-title">Contact Us</h3>
            <p className="contact-page__info-desc">Have a question, investment interest, or just want to say hello? Reach out any of these ways.</p>
            <div className="contact-page__detail">
              <span className="contact-page__detail-label">Email</span>
              <span className="contact-page__detail-value">{contactEmail}</span>
            </div>
            {contactPhones.map((phone, i) => (
              <div className="contact-page__detail" key={i}>
                <span className="contact-page__detail-label">Phone</span>
                <span className="contact-page__detail-value">{phone}</span>
              </div>
            ))}
            <div className="contact-page__actions" style={{ marginTop: '24px' }}>
              <a href="mailto:support@sintel.co.tz" className="btn btn--primary btn--lg">Send Email</a>
            </div>
          </div>
          <div className="contact-page__form-wrap">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
