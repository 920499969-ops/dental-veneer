import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';

const navLinks = [
  { label: '了解瓷贴片', href: '#what-are-veneers' },
  { label: '前后对比', href: '#before-after' },
  { label: '服务流程', href: '#process' },
  { label: '价格方案', href: '#pricing' },
  { label: '常见问题', href: '#faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    if (!isHome) return;
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream/90 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.06)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/20 group-hover:shadow-gold/40 transition-shadow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-serif text-xl font-semibold tracking-wide text-brown">
            臻白<span className="text-gold">瓷贴片</span>
          </span>
        </Link>

        {/* Desktop nav */}
        {isHome && (
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-sm text-brown-light hover:text-gold transition-colors relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/booking"
            className="px-5 py-2.5 bg-brown text-cream rounded-full text-sm font-medium hover:bg-brown-light transition-all duration-300 hover:shadow-lg hover:shadow-brown/20 active:scale-95"
          >
            预约面诊
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-brown hover:text-gold transition-colors"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-cream/98 backdrop-blur-md border-t border-gold/10 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {isHome &&
                navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="py-2.5 text-brown-light hover:text-gold transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              <Link
                to="/booking"
                onClick={() => setMobileOpen(false)}
                className="mt-2 px-5 py-3 bg-brown text-cream rounded-full text-center text-sm font-medium"
              >
                预约面诊
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
