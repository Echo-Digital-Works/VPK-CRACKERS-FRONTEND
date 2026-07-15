import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FloatingWhatsApp from '../components/ui/FloatingWhatsApp';
import FireworksBackground from '../components/ui/FireworksBackground';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <FireworksBackground />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
