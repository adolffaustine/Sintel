import useReveal from '../hooks/useReveal.jsx';

/**
 * Thin wrapper that fades/slides its children up into view the first
 * time they cross into the viewport. Accepts an optional transition
 * delay (ms) so groups of siblings can stagger.
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const ref = useReveal();
  const mergedStyle = {
    ...(delay ? { transitionDelay: `${delay}ms` } : null),
    ...style,
  };
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={Object.keys(mergedStyle).length ? mergedStyle : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
