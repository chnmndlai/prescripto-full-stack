import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const scrollToAbout = () => {
    navigate('/about');
    setTimeout(() => {
      const section = document.getElementById('about');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <footer className="bg-gray-50 border-t text-gray-700 pt-12">

      {/* 🔹 Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 pb-12">

        {/* 🔹 Logo & Description */}
        <div className="space-y-4">
          <img className="w-20" src={assets.logo} alt="Лого" />
          <p className="text-sm leading-relaxed text-gray-600">
            Манай платформ нь сэтгэцийн эрүүл мэндэд зориулсан цахим орчин юм. Та мэргэжлийн эмчтэй холбогдож, өөрт тохирсон зөвлөгөө, оношилгоо авах боломжтой.
          </p>

          {/* 🔹 Social Icons */}
          <div className="flex gap-3 pt-1 text-xs sm:text-sm text-gray-500">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition hover:scale-110">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-500 transition hover:scale-110">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-sky-400 transition hover:scale-110">
              <FaTwitter />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-red-600 transition hover:scale-110">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* 🔹 Танилцуулга */}
        <div>
          <h4 className="text-base font-semibold mb-4">Танилцуулга</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="cursor-pointer hover:text-primary hover:underline" onClick={() => navigate('/')}>Нүүр</li>
            <li className="cursor-pointer hover:text-primary hover:underline" onClick={scrollToAbout}>Бидний тухай</li>
            <li className="cursor-pointer hover:text-primary hover:underline">Үйлчилгээ</li>
            <li className="cursor-pointer hover:text-primary hover:underline">Нууцлалын бодлого</li>
          </ul>
        </div>

        {/* 🔹 Холбоо барих */}
        <div>
          <h4 className="text-base font-semibold mb-4">Холбоо барих</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><span className="font-medium">Утас:</span> +976-8811-2233</li>
            <li><span className="font-medium">Имэйл:</span> info@mentalcare.mn</li>
            <li className="text-xs pt-2 text-gray-400">Ажлын цаг: Даваа–Баасан, 09:00–18:00</li>
          </ul>
        </div>
      </div>

      {/* 🔹 Footer Bottom */}
      <div className="text-center text-xs text-gray-500 py-6 border-t">
        © 2024 <span className="font-semibold text-primary">Prescripto</span> — Бүх эрх хуулиар хамгаалагдсан.
      </div>
    </footer>
  );
};

export default Footer;
