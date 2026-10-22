import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Without this, React Router preserves the browser's scroll position across
 * client-side navigations, which reads as broken (e.g. landing halfway down
 * a new page). Jumps to the top on every path change.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
