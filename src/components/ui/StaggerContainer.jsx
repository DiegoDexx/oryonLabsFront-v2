import { useInView } from '../../hooks/useInView';
import { Children, cloneElement } from 'react';

/**
 * StaggerContainer — Wrapper que aplica stagger animation a sus hijos
 * 
 * Uso:
 * <StaggerContainer staggerDelay={100}>
 *   {items.map(item => <Card key={item.id} />)}
 * </StaggerContainer>
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {number} props.staggerDelay - Delay entre cada hijo en ms (default: 100)
 * @param {string} props.className - Clases del contenedor
 * @param {object} props.inViewOptions - Opciones para useInView
 * @param {object} props.childProps - Props adicionales para cada hijo
 * @returns {JSX.Element}
 */
export function StaggerContainer({
  children,
  staggerDelay = 100,
  className = '',
  threshold = 0.1,
  triggerOnce = true,
  childProps = {}
}) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce
  });

  const childArray = Children.toArray(children);

  return (
    <div ref={ref} className={className}>
      {childArray.map((child, index) => {
        const delay = index * staggerDelay;

        // Si es un elemento React válido, clonarlo con animación
        if (child && typeof child === 'object' && 'type' in child) {
          return cloneElement(child, {
            ...childProps,
            style: {
              ...child.props.style,
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 500ms ease-out, transform 500ms ease-out',
              transitionDelay: `${delay}ms`,
              willChange: 'opacity, transform'
            }
          });
        }

        // Si no es un elemento React, envolverlo
        return (
          <div
            key={index}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 500ms ease-out, transform 500ms ease-out',
              transitionDelay: `${delay}ms`,
              willChange: 'opacity, transform'
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

export default StaggerContainer;
