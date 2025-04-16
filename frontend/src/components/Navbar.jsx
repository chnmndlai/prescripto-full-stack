import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

const Navbar = ({ setShowChat }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);
  const [searchText, setSearchText] = useState('');

  const logout = () => {
    localStorage.removeItem('token');
    setToken(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowMenu(false);
      setShowDropdown(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      className="sticky top-0 z-50 transition-all border-b bg-white"
    >
      <div className='flex flex-wrap md:flex-nowrap items-center justify-between gap-4 px-6 md:px-10 py-4 text-sm'>

        {/* ✅ Logo хэсэг */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={assets.logo}
            alt="Лого"
            className="h-10 w-10 object-contain cursor-pointer"
          />
          <span className="text-lg font-semibold hidden sm:inline-block">Prescripto</span>
        </Link>

        {/* 🔍 Search Bar */}
        <form onSubmit={handleSearch} className='flex-1 max-w-md hidden md:flex'>
          <input
            type='text'
            placeholder='Хайлт хийх...'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className='w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white'
          />
        </form>

        {/* 🧭 Navigation links */}
        <ul className='hidden md:flex items-center gap-5 font-medium'>
          <NavLink to='/' className={navLinkStyle}><li>Нүүр</li></NavLink>
          <NavLink to='/doctors' className={navLinkStyle}><li>Эмч хайх</li></NavLink>
          <NavLink to='/advice' className={navLinkStyle}><li>Зөвлөгөө</li></NavLink>
          <NavLink to='/quiz' className={navLinkStyle}><li>Сэтгэлзүйн тест</li></NavLink>
        </ul>

        {/* 🔘 Зөвхөн login хийсэн үед: зөвхөн "Чат эхлүүлэх" */}
        {token && (
          <div className='hidden lg:flex gap-3'>
            <button
              onClick={() => setShowChat(true)}
              className='text-sm px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600'
            >
              Чат эхлүүлэх
            </button>
          </div>
        )}

        {/* 🧑 Профайл / Login */}
        <div className='flex items-center gap-3 relative'>
          {token && userData ? (
            <div className='relative'>
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className='flex items-center gap-2 cursor-pointer'
              >
                <img className='w-8 h-8 rounded-full object-cover' src={userData.image} alt="User" />
                <span className='hidden md:block text-sm'>
                  {userData.name?.split(' ')[0] || 'Хэрэглэгч'}
                </span>
              </div>

              {/* Dropdown menu */}
              {showDropdown && (
                <div
                  className='absolute top-12 right-0 z-50 bg-white rounded-lg shadow p-4 text-sm space-y-2'
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <p onClick={() => { navigate('/my-profile'); setShowDropdown(false); }} className='hover:text-primary cursor-pointer'>
                    Миний профайл
                  </p>
                  <p onClick={() => { navigate('/my-appointments'); setShowDropdown(false); }} className='hover:text-primary cursor-pointer'>
                    Цаг захиалгууд
                  </p>
                  <p onClick={() => { logout(); setShowDropdown(false); }} className='hover:text-primary cursor-pointer'>
                    Гарах
                  </p>
                </div>
              )}
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

        {/* ☰ Mobile menu icon */}
        <img onClick={() => setShowMenu(true)} src={assets.menu_icon} className='w-6 md:hidden cursor-pointer' alt="Цэс" />
      </div>
    </motion.nav>
  );
};

export default Navbar;
