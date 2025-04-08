import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollBlur, setScrollBlur] = useState(false);
  const [searchText, setSearchText] = useState('');

  const logout = () => {
    localStorage.removeItem('token');
    setToken(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      setScrollBlur(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const navLinkStyle = ({ isActive }) =>
    isActive ? 'text-primary font-semibold' : 'hover:text-primary transition';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
    }
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 transition-all border-b ${
        scrollBlur
          ? 'bg-white/70 dark:bg-[#121212]/80 backdrop-blur-lg shadow-md'
          : 'bg-white dark:bg-[#121212]'
      }`}
    >
      <div className='flex flex-wrap md:flex-nowrap items-center justify-between gap-4 px-6 md:px-10 py-4 text-sm dark:text-white'>

        {/* Logo */}
        <img onClick={() => navigate('/')} className='w-36 cursor-pointer' src={assets.logo} alt="Лого" />

        {/* Search Bar */}
        <form onSubmit={handleSearch} className='flex-1 max-w-md hidden md:flex'>
          <input
            type='text'
            placeholder='Хайлт хийх...'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className='w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white dark:bg-[#2a2a2a] dark:text-white'
          />
        </form>

        {/* Navigation */}
        <ul className='hidden md:flex items-center gap-5 font-medium'>
          <NavLink to='/' className={navLinkStyle}><li>Нүүр</li></NavLink>
          <NavLink to='/doctors' className={navLinkStyle}><li>Эмч хайх</li></NavLink>
          <NavLink to='/advice' className={navLinkStyle}><li>Зөвлөгөө</li></NavLink>
          <NavLink to='/quiz' className={navLinkStyle}><li>Сэтгэлзүйн  тест</li></NavLink>
        </ul>

        {/* Extra buttons if logged in */}
        {token && (
          <div className='hidden lg:flex gap-3'>
            <button
              onClick={() => navigate('/contact-doctor')}
              className='text-sm px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700'
            >
              Эмчид хандах
            </button>
            <a
              href='#chat'
              className='text-sm px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600'
            >
              Чат эхлүүлэх
            </a>
          </div>
        )}

        {/* Dark mode toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className='border rounded-full px-3 py-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-700 hidden md:block'
        >
          {isDark ? '🌙' : '☀️'}
        </button>

        {/* Profile / Login */}
        <div className='flex items-center gap-3'>
          {token && userData ? (
            <div className='relative group cursor-pointer'>
              <div className='flex items-center gap-2'>
                <img className='w-8 h-8 rounded-full object-cover' src={userData.image} alt="User" />
                <span className='hidden md:block text-sm'>
                  {userData.name?.split(' ')[0] || 'Хэрэглэгч'}
                </span>
              </div>
              {/* Dropdown */}
              <div className='absolute top-12 right-0 z-50 hidden group-hover:block bg-white dark:bg-[#2a2a2a] rounded-lg shadow p-4 text-sm space-y-2'>
                <p onClick={() => navigate('/my-profile')} className='hover:text-primary cursor-pointer'>Миний профайл</p>
                <p onClick={() => navigate('/my-appointments')} className='hover:text-primary cursor-pointer'>Цаг захиалгууд</p>
                <p onClick={logout} className='hover:text-primary cursor-pointer'>Гарах</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className='bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hidden md:block'
            >
              Нэвтрэх / Бүртгүүлэх
            </button>
          )}
        </div>

        {/* Mobile menu icon */}
        <img onClick={() => setShowMenu(true)} src={assets.menu_icon} className='w-6 md:hidden cursor-pointer' alt="Цэс" />
      </div>

      {/* Mobile drawer — Та хүсвэл энэ хэсгийг мөн сайжруулж өгье */}
    </motion.nav>
  );
};

export default Navbar;
