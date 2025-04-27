import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Banner = () => {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-primary via-indigo-500 to-indigo-600 rounded-3xl px-6 sm:px-10 md:px-14 lg:px-20 py-12 mt-20 md:mx-10 shadow-2xl overflow-hidden"
    >

      {/* 💫 Арын гоёмсог бөмбөлөг blur */}
      <div className="absolute top-[-50px] right-[-50px] w-72 h-72 bg-white/10 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-[-40px] left-[-40px] w-52 h-52 bg-white/5 rounded-full blur-2xl z-0"></div>

      {/* Зүүн текст хэсэг */}
      <div className="flex-1 text-center md:text-left z-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
          Сэтгэлзүйн тусламж <br className="hidden sm:block" /> таны гарт
        </h1>

        <p className="text-white/80 text-base sm:text-lg mt-6 max-w-md mx-auto md:mx-0">
          Хувийн мэргэжлийн зөвлөгөө, онлайн цаг захиалгын хамгийн хурдан арга.
        </p>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            navigate('/login');
            scrollTo(0, 0);
          }}
          className="bg-white text-primary text-base sm:text-lg px-8 py-3 rounded-full mt-8 shadow-lg hover:shadow-2xl transition-all font-semibold"
        >
          Бүртгэл үүсгэх
        </motion.button>
      </div>

      {/* Баруун зураг */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="hidden md:block md:w-1/2 lg:w-[400px] relative mt-10 md:mt-0 z-10"
      >
        <img
          src={assets.appointment_img}
          alt="Сэтгэлзүйн зөвлөгөөний зураг"
          className="w-full max-w-md mx-auto rounded-2xl shadow-xl"
        />
      </motion.div>
    </motion.section>
  );
};

export default Banner;
