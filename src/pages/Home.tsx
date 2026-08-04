import Hero from '../components/home/Hero';
import Offers from '../components/home/Offers';
import About from '../components/home/About';
import Founders from '../components/home/Founders';
import Products from '../components/home/Products';
import Videos from '../components/home/Videos';
import Testimonials from '../components/home/Testimonials';
import Location from '../components/home/Location';
import Contact from '../components/home/Contact';

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <Offers />
      <About />
      <Founders />
      <Products />
      <Videos />
      <Testimonials />
      <Location />
      <Contact />
    </div>
  );
}
