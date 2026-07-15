import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import MainLayout from './layouts/MainLayout';
import LoadingScreen from './components/ui/LoadingScreen';
import CustomCursor from './components/ui/CustomCursor';
import { CartProvider } from './context/CartContext';

// Lazy load pages to reduce initial JavaScript payload (Code Splitting)
const Home = lazy(() => import('./pages/Home'));
const AllProducts = lazy(() => import('./pages/AllProducts'));
const Cart = lazy(() => import('./pages/Cart'));
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We will let the LoadingScreen handle the loading state
    // by calling an onComplete callback when the video finishes.
  }, []);

  return (
    <CartProvider>
      <CustomCursor />
      {loading ? (
        <LoadingScreen onComplete={() => setLoading(false)} />
      ) : (
        <Router>
          <Suspense fallback={<div className="min-h-screen bg-brand-dark flex items-center justify-center"></div>}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<AllProducts />} />
                <Route path="cart" element={<Cart />} />
              </Route>
              <Route path="/admin-vpk-secure" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </Suspense>
        </Router>
      )}
    </CartProvider>
  );
}

export default App;
