import { useEffect, useState, createContext, useContext, createElement } from 'react';
import { content as staticContent } from '../data/content.js';

const ContentCtx = createContext(null);

async function loadSections() {
  try {
    const res = await fetch('api/content', { headers: { Accept: 'application/json' } });
    if (!res.ok) return {};
    const body = await res.json();
    return body && typeof body === 'object' && body.sections ? body.sections : {};
  } catch {
    return {};
  }
}

export function mergeContent(sections) {
  const merged = { ...staticContent };
  Object.entries(sections || {}).forEach(([key, val]) => {
    if (val === null || val === undefined) return;
    merged[key] = val;
  });
  return merged;
}

export function ContentProvider({ children }) {
  const [sections, setSections] = useState(null);

  useEffect(() => {
    let alive = true;
    loadSections().then((s) => { if (alive) setSections(s); });
    return () => { alive = false; };
  }, []);

  const value = {
    sections,
    merged: mergeContent(sections),
    ready: sections !== null,
  };
  
  return createElement(ContentCtx.Provider, { value }, children);
}

export function useContent() {
  const ctx = useContext(ContentCtx);
  if (!ctx) throw new Error('useContent must be used inside ContentProvider');
  return ctx;
}

// Convenience hook for components that just want the (possibly dynamic) content object.
export function useSiteContent() {
  const { merged } = useContent();
  return merged;
}