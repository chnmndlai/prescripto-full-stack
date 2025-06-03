import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import doctorImage from '../assets/doctor.png'; // өөрийн зургаар солино уу

const HeroSection = () => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <section role="region" aria-labelledby="hero-heading" className="relative w-full min-h-screen bg-gradient-to-br from-[#6a68f2] to-[#433dcd] text-white flex items-center justify-center px-4 sm:px-10 py-10 overflow-hidden">
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-indigo-600 px-4 py-2 rounded-md"
      >
        Контент руу үсрэх
      </a>

      <div id="main-content" className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Text Column */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 id="hero-heading" className="text-4xl md:text-5xl font-bold leading-tight">
            Сэтгэлзүйн тусламж<br className="hidden sm:block" /> таны гарт
          </h1>

          <p className="text-lg text-white/90">
            Цаг захиалахад илүү хялбар бөгөөд хурдан. Бид таны сэтгэлийг сонсохын төлөө энд байна.
          </p>

          <div className="flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Link
                to="/appointment"
                className="inline-block bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white transition"
                aria-label="Цаг захиалах"
              >
                Цаг захиалах
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Link
                to="/quiz"
                className="inline-block border border-white text-white px-6 py-3 rounded-xl hover:bg-white hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-white transition"
                aria-label="Сэтгэлзүйн тест бөглөх"
              >
                Сэтгэлзүйн тест бөглөх
              </Link>
            </motion.div>
          </div>

          {/* Scroll Prompt */}
          <div className="mt-10 animate-bounce text-white/70" aria-hidden>
            ↓ Доош гүйлгэх
          </div>
        </motion.div>

        {/* Image Column */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: imgLoaded ? 1 : 0, y: imgLoaded ? 0 : 50 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center relative"
        >
          {/* Shimmer Placeholder */}
          {!imgLoaded && <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-2xl" />}
          <img
            src={doctorImage}
            alt="Эмч"
            onLoad={() => setImgLoaded(true)}
            className={`w-full max-w-md rounded-2xl shadow-2xl transition-opacity duration-700 ${imgLoaded ? 'opacity-100 relative' : 'opacity-0 absolute'}`}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;