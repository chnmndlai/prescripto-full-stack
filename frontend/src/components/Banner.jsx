import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Banner = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-primary to-indigo-600 rounded-2xl px-6 sm:px-10 md:px-14 lg:px-20 py-10 mt-20 md:mx-10 shadow-2xl overflow-hidden"
    >

      {/* 💫 Арын blur бөмбөлөг */}
      <div className="absolute top-[-40px] right-[-40px] w-60 h-60 bg-white/10 rounded-full blur-2xl z-0"></div>

      {/* Зүүн тал */}
      <div className="flex-1 text-center md:text-left z-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
          Сэтгэлзүйн тусламж таны гарт
        </h1>
        <p className="text-white/90 text-sm sm:text-base mt-4 max-w-md mx-auto md:mx-0">
          Хувийн мэргэжлийн зөвлөгөө, онлайн цаг захиалгын систем.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => {
            navigate('/login');
            scrollTo(0, 0);
          }}
          className="bg-white text-primary text-sm sm:text-base px-6 py-3 rounded-full mt-6 shadow hover:shadow-lg transition-all font-semibold"
        >
          Бүртгэл үүсгэх
        </motion.button>
      </div>

      {/* Баруун тал */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="hidden md:block md:w-1/2 lg:w-[400px] relative mt-10 md:mt-0 z-10"
      >
        <img
          className="w-full max-w-md mx-auto rounded-xl drop-shadow-xl"
          src={assets.appointment_img}
          alt="Сэтгэлзүйн зөвлөгөөний зураг"
        />
      </motion.div>
    </motion.div>
  );
};

export default Banner;
