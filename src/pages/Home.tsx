import { lazy, Suspense } from 'react';
import Hero from '../components/home/Hero';
import LazyShow from '../components/ui/LazyShow';

// Lazy load below-the-fold components to reduce initial JS payload and TBT
const Offers = lazy(() => import('../components/home/Offers'));
const About = lazy(() => import('../components/home/About'));
const Founders = lazy(() => import('../components/home/Founders'));
const Products = lazy(() => import('../components/home/Products'));
const Videos = lazy(() => import('../components/home/Videos'));
const Testimonials = lazy(() => import('../components/home/Testimonials'));
const Location = lazy(() => import('../components/home/Location'));
const Contact = lazy(() => import('../components/home/Contact'));

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <Suspense fallback={<div className="h-32 w-full flex items-center justify-center"></div>}>
        <LazyShow id="offers" rootMargin="400px"><Offers /></LazyShow>
        <LazyShow id="about" rootMargin="400px"><About /></LazyShow>
        <LazyShow id="founders" rootMargin="400px"><Founders /></LazyShow>
        <LazyShow id="products" rootMargin="400px"><Products /></LazyShow>
        <LazyShow id="videos" rootMargin="400px"><Videos /></LazyShow>
        <LazyShow id="testimonials" rootMargin="400px"><Testimonials /></LazyShow>
        <LazyShow id="location" rootMargin="400px"><Location /></LazyShow>
        <LazyShow id="contact" rootMargin="400px"><Contact /></LazyShow>
      </Suspense>
    </div>
  );
}
