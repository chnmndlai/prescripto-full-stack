import React from 'react';
import { assets } from '../assets/assets';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const scrollToAbout = () => {
    navigate('/about');
    setTimeout(() => {
      const section = document.getElementById('about');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  return (
    <footer className='bg-gray-50 border-t mt-40 text-gray-700'>

      <div className='max-w-7xl mx-auto px-6 md:px-10 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10'>

        {/* Лого + тайлбар */}
        <div className='col-span-2'>
          <img className='mb-4 w-36' src={assets.logo} alt="Сэтгэцийн эрүүл мэнд лого" />
          <p className='text-sm leading-6 text-gray-600'>
            Манай платформ нь сэтгэцийн эрүүл мэндэд зориулсан цахим орчин юм. Та мэргэжлийн эмчтэй холбогдож, өөрт тохирсон зөвлөгөө, оношилгоо авах боломжтой.
          </p>

          {/* Social Media Icons */}
          <div className='flex gap-4 mt-6 text-gray-600'>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className='hover:text-blue-600 transition'>
              <FaFacebookF size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className='hover:text-pink-500 transition'>
              <FaInstagram size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className='hover:text-sky-400 transition'>
              <FaTwitter size={20} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className='hover:text-red-600 transition'>
              <FaYoutube size={20} />
            </a>
          </div>
        </div>

        {/* Компани */}
        <div>
          <h4 className='text-lg font-semibold mb-4'>Танилцуулга</h4>
          <ul className='space-y-2 text-sm'>
            <li className='hover:text-primary cursor-pointer transition' onClick={() => navigate('/')}>Нүүр</li>
            <li className='hover:text-primary cursor-pointer transition' onClick={scrollToAbout}>Бидний тухай</li>
            <li className='hover:text-primary cursor-pointer transition'>Үйлчилгээ</li>
            <li className='hover:text-primary cursor-pointer transition'>Нууцлалын бодлого</li>
          </ul>
        </div>

        {/* Холбоо барих */}
        <div>
          <h4 className='text-lg font-semibold mb-4'>Холбоо барих</h4>
          <ul className='space-y-2 text-sm'>
            <li>📞 +976-8811-2233</li>
            <li>📧 info@mentalcare.mn</li>
            <li className='text-xs text-gray-500 pt-2'>Ажлын цаг: Даваа-Баасан, 09:00 - 18:00</li>
          </ul>
        </div>
      </div>

      {/* Newsletter бүртгэл */}
      <div className='bg-white border-t py-10 px-6 md:px-10'>
        <div className='max-w-4xl mx-auto text-center'>
          <h3 className='text-xl font-semibold mb-2'>Шинэ мэдээлэл хүлээн авах</h3>
          <p className='text-sm text-gray-600 mb-6'>Манай платформын шинэ мэдээлэл, сэтгэл зүйн зөвлөгөө зэргийг имэйлээрээ хүлээн аваарай.</p>
          <form className='flex flex-col sm:flex-row items-center justify-center gap-3'>
            <input 
              type="email" 
              placeholder="Имэйл хаяг аа оруулна уу" 
              className='w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary'
              required 
            />
            <button 
              type="submit" 
              className='bg-primary text-white px-6 py-2 rounded-full hover:opacity-90 transition'
            >
              Бүртгүүлэх
            </button>
          </form>
        </div>
      </div>

      {/* Хуулбарын мөр */}
      <div className='text-center text-xs text-gray-500 py-6 border-t'>
        © 2024 MentalCare.mn — Бүх эрх хуулиар хамгаалагдсан.
      </div>
    </footer>
  );
};

export default Footer;
