import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSiteContent } from '../hooks/useContent.js';
import Reveal from './Reveal.jsx';

const INQUIRY_TYPES = [
  { value: 'investor', label: 'Investor' },
  { value: 'grant', label: 'Grant / Funding' },
  { value: 'partner', label: 'Partnership' },
  { value: 'media', label: 'Media' },
  { value: 'general', label: 'General' },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Existing default inquiry type when the form is opened with no router
// state (e.g. direct nav to /contact) — preserved from the pre-router
// behavior of this form.
const DEFAULT_INQUIRY_TYPE = 'investor';

function buildInitialForm(inquiryType) {
  return {
    name: '',
    email: '',
    organization: '',
    inquiryType,
    message: '',
  };
}

const STATUS = {
  IDLE: 'idle',
  SUBMITTING: 'submitting',
  SUCCESS: 'success',
  ERROR: 'error',
  UNAVAILABLE: 'unavailable',
};

export default function ContactForm() {
  const content = useSiteContent();
  const location = useLocation();
  // Arriving via the Nav/Home "Partner With Us" CTA passes
  // state={{ inquiryType: 'investor' }} so the select pre-selects that
  // option; otherwise fall back to the form's existing default.
  const initialInquiryType = location.state?.inquiryType || DEFAULT_INQUIRY_TYPE;

  const { title, subtitle, investorNote } = content.contact;
  const { email: contactEmail, phones: contactPhones } = content.contactInfo;
  const [form, setForm] = useState(() => buildInitialForm(initialInquiryType));
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required.';
    if (!form.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }
    if (!form.message.trim()) errors.message = 'Message is required.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStatus(STATUS.ERROR);
      setErrorMessage('Please fix the highlighted fields before submitting.');
      return;
    }

    setStatus(STATUS.SUBMITTING);
    setErrorMessage('');

    try {
      const response = await fetch('/volt/sintel-technologies/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          organization: form.organization.trim(),
          inquiryType: form.inquiryType,
          message: form.message.trim(),
        }),
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (response.ok) {
        setStatus(STATUS.SUCCESS);
        setForm(buildInitialForm(initialInquiryType));
        setFieldErrors({});
        return;
      }

      if (response.status === 503) {
        setStatus(STATUS.UNAVAILABLE);
        setErrorMessage('Our systems are temporarily unavailable. Please try again shortly.');
        return;
      }

      if (response.status === 400) {
        setStatus(STATUS.ERROR);
        setErrorMessage((payload && payload.error) || 'Please check your details and try again.');
        return;
      }

      setStatus(STATUS.ERROR);
      setErrorMessage((payload && payload.error) || 'Something went wrong. Please try again.');
    } catch {
      setStatus(STATUS.ERROR);
      setErrorMessage('We could not reach the server. Check your connection and try again.');
    }
  };

  const isSubmitting = status === STATUS.SUBMITTING;

  return (
    <section id="contact" className="section contact">
      <div className="container contact__inner">
        <Reveal as="div" className="contact__intro">
          <h2 className="section-title">
            {title}
            <span className="section-title__underline" aria-hidden="true" />
          </h2>
          <p className="section-subtitle">{subtitle}</p>
          <p className="contact__note">{investorNote}</p>

          <div className="contact__direct" aria-label="Direct contact details">
            <a className="contact__direct-item" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
            {contactPhones.map((phone) => (
              <a
                key={phone}
                className="contact__direct-item"
                href={`tel:${phone.replace(/[^+\d]/g, '')}`}
              >
                {phone}
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal className="contact__form-wrap" delay={100}>
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="contact-form__row">
              <div className="contact-form__field">
                <label htmlFor="name">Name *</label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange('name')}
                  aria-invalid={Boolean(fieldErrors.name)}
                />
                {fieldErrors.name && <span className="contact-form__field-error">{fieldErrors.name}</span>}
              </div>

              <div className="contact-form__field">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  aria-invalid={Boolean(fieldErrors.email)}
                />
                {fieldErrors.email && <span className="contact-form__field-error">{fieldErrors.email}</span>}
              </div>
            </div>

            <div className="contact-form__row">
              <div className="contact-form__field">
                <label htmlFor="organization">Organization (optional)</label>
                <input
                  id="organization"
                  type="text"
                  autoComplete="organization"
                  value={form.organization}
                  onChange={handleChange('organization')}
                />
              </div>

              <div className="contact-form__field">
                <label htmlFor="inquiryType">Inquiry Type</label>
                <select id="inquiryType" value={form.inquiryType} onChange={handleChange('inquiryType')}>
                  {INQUIRY_TYPES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="contact-form__field">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                rows={5}
                value={form.message}
                onChange={handleChange('message')}
                aria-invalid={Boolean(fieldErrors.message)}
              />
              {fieldErrors.message && <span className="contact-form__field-error">{fieldErrors.message}</span>}
            </div>

            {status === STATUS.SUCCESS && (
              <p className="contact-form__status contact-form__status--success" role="status">
                Thank you — your message has been received. We'll be in touch shortly.
              </p>
            )}
            {status === STATUS.UNAVAILABLE && (
              <p className="contact-form__status contact-form__status--warning" role="alert">
                {errorMessage}
              </p>
            )}
            {status === STATUS.ERROR && errorMessage && (
              <p className="contact-form__status contact-form__status--error" role="alert">
                {errorMessage}
              </p>
            )}

            <button type="submit" className="btn btn--primary btn--lg contact-form__submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
