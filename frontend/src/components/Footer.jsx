import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaArrowUp } from 'react-icons/fa';
import { assets } from '../assets/assets';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Footer = () => {
  const navigate = useNavigate();
  const [showTop, setShowTop] = useState(false);

  // Scroll handlers
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToAbout = () => {
    navigate('/about');
    setTimeout(() => {
      const section = document.getElementById('about');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <footer className="bg-base-100 text-base-content border-t pt-12 relative">
      {/* Main Grid */}
      <div className="container mx-auto px-6 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-12">
        {/* Logo & Description */}
        <div className="flex flex-col space-y-4">
          <img src={assets.logo} alt="Prescripto лого" className="w-24 mx-auto sm:mx-0" />
          <p className="text-sm leading-relaxed opacity-80">
            Манай платформ нь сэтгэцийн эрүүл мэндэд зориулсан цахим орчин юм.
            Та мэргэжлийн эмчтэй холбогдож, өөрт тохирсон зөвлөгөө, оношилгоо авах боломжтой.
          </p>
          <div className="flex gap-3 pt-1 justify-center sm:justify-start">
            {[
              { icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook' },
              { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
              { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
              { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="btn btn-circle btn-ghost hover:bg-primary hover:text-white transition"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold mb-2">Танилцуулга</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={() => navigate('/')} className="hover:text-primary hover:underline focus:outline-none">
                Нүүр
              </button>
            </li>
            <li>
              <button onClick={scrollToAbout} className="hover:text-primary hover:underline focus:outline-none">
                Бидний тухай
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/services')} className="hover:text-primary hover:underline focus:outline-none">
                Үйлчилгээ
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/privacy')} className="hover:text-primary hover:underline focus:outline-none">
                Нууцлалын бодлого
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold mb-2">Холбоо барих</h4>
          <ul className="space-y-2 text-sm">
            <li><span className="font-medium">Утас:</span> +976-8811-2233</li>
            <li>
              <span className="font-medium">Имэйл:</span>{' '}
              <a href="mailto:info@mentalcare.mn" className="hover:text-primary">
                info@mentalcare.mn
              </a>
            </li>
            <li className="text-xs opacity-70 pt-2">
              Ажлын цаг: Даваа–Баасан, 09:00–18:00
            </li>
          </ul>
        </div>
      </div>

      {/* Back to top button */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            className="fixed bottom-6 right-6 btn btn-circle btn-primary shadow-lg transition hover:scale-110 focus:outline-none"
            onClick={scrollToTop}
            aria-label="Дээш гүйлгэх"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <FaArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer Bottom */}
      <div className="text-center text-xs opacity-70 py-6 border-t border-gray-200">
        © {new Date().getFullYear()} <span className="font-semibold text-primary">Prescripto</span> — Бүх эрх хуулиар хамгаалагдсан.
      </div>
    </footer>
  );
};

export default Footer;
