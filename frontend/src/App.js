import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { motion, useScroll } from 'framer-motion';
import { LanguageProvider } from './i18n/LanguageContext';
import Navbar from './components/Navbar';
import CursorGlow from './components/CursorGlow';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import RnD from './pages/RnD';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import { Toaster } from './components/ui/sonner';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      data-testid="scroll-progress-bar"
      className="fixed left-0 right-0 top-0 z-[70] h-1 origin-left bg-gradient-to-r from-pink-600 via-sky-500 to-amber-500"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    document.title = 'Infinitives Healthcare | Excellence in Every Dose';
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <ScrollProgress />
        <CursorGlow />
        <div className="min-h-screen bg-[#f8fafc]">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:categoryId" element={<ProductDetail />} />
            <Route path="/rnd" element={<RnD />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
          <WhatsAppFloat />
          <Toaster position="top-center" richColors />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
