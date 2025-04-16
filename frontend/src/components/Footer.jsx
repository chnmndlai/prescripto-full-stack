import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const scrollToAbout = () => {
    navigate('/about');
    setTimeout(() => {
      const section = document.getElementById('about');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/newsletter/subscribe`, { email });
      if (res.data.success) {
        toast.success("Амжилттай бүртгэгдлээ!");
        setEmail('');
      } else {
        toast.error(res.data.message || 'Алдаа гарлаа.');
      }
    } catch (err) {
      toast.error('Сервертэй холбогдож чадсангүй.');
    }
  };

  return (
    <footer className="bg-gray-50 border-t mt-32 text-gray-700 pt-12">

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-12">

        {/* Лого + тайлбар */}
        <div className="col-span-2 space-y-4">
          <img className="w-24" src={assets.logo} alt="Лого" />
          <p className="text-sm leading-relaxed text-gray-600">
            Манай платформ нь сэтгэцийн эрүүл мэндэд зориулсан цахим орчин юм.
            Та мэргэжлийн эмчтэй холбогдож, өөрт тохирсон зөвлөгөө, оношилгоо авах боломжтой.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 pt-2 text-gray-500 text-lg">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-500 transition">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-sky-400 transition">
              <FaTwitter />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-red-600 transition">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Компани */}
        <div>
          <h4 className="text-base font-semibold mb-4">Танилцуулга</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="cursor-pointer hover:text-primary transition" onClick={() => navigate('/')}>Нүүр</li>
            <li className="cursor-pointer hover:text-primary transition" onClick={scrollToAbout}>Бидний тухай</li>
            <li className="cursor-pointer hover:text-primary transition">Үйлчилгээ</li>
            <li className="cursor-pointer hover:text-primary transition">Нууцлалын бодлого</li>
          </ul>
        </div>

        {/* Холбоо барих */}
        <div>
          <h4 className="text-base font-semibold mb-4">Холбоо барих</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>📞 +976-8811-2233</li>
            <li>📧 info@mentalcare.mn</li>
            <li className="text-xs pt-2 text-gray-400">Ажлын цаг: Даваа–Баасан, 09:00–18:00</li>
          </ul>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-white border-t py-10 px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-semibold mb-2">📰 Шинэ мэдээлэл хүлээн авах</h3>
          <p className="text-sm text-gray-600 mb-6">Сэтгэлзүйн зөвлөгөө, шинэ мэдээ зэргийг имэйлээр хүлээн аваарай.</p>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <input
              type="email"
              placeholder="Имэйл хаяг аа оруулна уу"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-full hover:opacity-90 transition font-medium"
            >
              Бүртгүүлэх
            </button>
          </form>
        </div>
      </div>

      {/* Хуулбарын мөр */}
      <div className="text-center text-xs text-gray-500 py-6 border-t">
        © 2024 <span className="font-semibold text-primary">Prescripto</span> — Бүх эрх хуулиар хамгаалагдсан.
      </div>
    </footer>
  );
};

export default Footer;
