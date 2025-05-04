// src/components/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import doctorImage from '../assets/doctor.png'; // өөрийн зургаар солино уу

const HeroSection = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#6a68f2] to-[#433dcd] text-white flex items-center justify-center px-4 sm:px-10 py-10">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* ✅ Зүүн талын текст */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Сэтгэлзүйн тусламж<br className="hidden sm:block" /> таны гарт
          </h1>
          <p className="text-lg text-white/90">
            Цаг захиалахад илүү хялбар бөгөөд хурдан. Бид таны сэтгэлийг сонсохын төлөө энд байна.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              to="/appointment"
              className="bg-white text-indigo-600 font-semibold px-6 py-2 rounded-xl hover:bg-gray-100 transition"
            >
              Цаг захиалах
            </Link>
            <Link
              to="/quiz"
              className="border border-white text-white px-6 py-2 rounded-xl hover:bg-white hover:text-indigo-600 transition"
            >
              Сэтгэлзүйн тест бөглөх
            </Link>
          </div>
        </div>

        {/* ✅ Баруун талын зураг */}
        <div className="flex justify-center">
          <img
            src={doctorImage}
            alt="Doctor"
            className="w-full max-w-md rounded-2xl shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
