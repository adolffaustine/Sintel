import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <div className="team__inner">
          <p className="eyebrow">404</p>
          <h1 className="section-title section-title--center">
            Page Not Found
            <span className="section-title__underline section-title__underline--center" aria-hidden="true" />
          </h1>
          <p className="team__subtitle">
            The page you're looking for doesn't exist or may have moved. Let's get you back on track.
          </p>
          <div className="not-found__actions">
            <Link to="/" className="btn btn--primary btn--lg">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
