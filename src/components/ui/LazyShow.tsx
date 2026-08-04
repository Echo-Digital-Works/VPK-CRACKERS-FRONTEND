import { useEffect, useRef, useState, type ReactNode } from 'react';

interface LazyShowProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  id?: string;
}

export default function LazyShow({ children, fallback = <div className="h-32 w-full" />, rootMargin = '200px', id }: LazyShowProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) return; // Already visible, no need to observe anymore

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible, rootMargin]);

  return <div id={id} ref={ref}>{isVisible ? children : fallback}</div>;
}
