import React from 'react';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';

const Header = () => {
  return (
    <header className="relative bg-gradient-to-br from-indigo-600 to-primary rounded-2xl overflow-hidden shadow-xl">

      {/* --- Background Video --- */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-10 z-0"
        src="/video/bg.mp4"
      />

      {/* --- SVG Wave background --- */}
      <svg className="absolute bottom-0 left-0 w-full z-0" viewBox="0 0 1440 320">
        <path fill="#ffffff" fillOpacity="0.05" d="M0,64L48,74.7C96,85,192,107,288,117.3C384,128,480,128,576,138.7C672,149,768,171,864,160C960,149,1056,107,1152,90.7C1248,75,1344,85,1392,90.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>

      {/* --- Content --- */}
      <div className="relative z-10 flex flex-col md:flex-row px-6 md:px-10 lg:px-20 py-16 md:py-[8vw] text-white items-center justify-between gap-10">

        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 flex flex-col gap-6"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight drop-shadow-md">
            Сэтгэлзүйн тусламж таны гарт
          </h1>

          <div className="flex flex-col md:flex-row items-center gap-3 text-sm font-light">
            <img className="w-24 md:w-28 rounded-full shadow-md" src={assets.group_profiles} alt="Эмч нар" />
            <p className="text-white/90">
              Цаг захиалахад илүү хялбар бөгөөд хурдан. <br className="hidden sm:block" />
              Бид таны сэтгэлийг сонсохын төлөө энд байна.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <a
              href="#appointment"
              className="bg-white text-primary px-6 py-3 rounded-full text-sm font-semibold shadow hover:scale-105 transition-all duration-300"
            >
              Цаг захиалах
            </a>
            <a
              href="#quiz"
              className="bg-white/20 border border-white text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-white hover:text-primary transition-all duration-300"
            >
              Сэтгэлзүйн тест бөглөх
            </a>
          </div>
        </motion.div>

        {/* Right Side Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 relative"
        >
          <img
            className="w-full max-h-[500px] object-cover rounded-2xl shadow-2xl border-2 border-white/20"
            src={assets.header_img}
            alt="Сэтгэлзүйчтэй уулзах"
          />
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
