import React, { useContext, useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';

// Nav underline motion (framer-motion layoutId)
const navLinks = [
  { path: '/', label: 'Нүүр' },
  { path: '/doctors', label: 'Эмч хайх' },
  { path: '/advice', label: 'Зөвлөгөө' },
  { path: '/quiz', label: 'Тест' },
];

const Navbar = ({ setShowChat }) => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);

  const [isScrolled, setIsScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // scroll shadow
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Dropdown focus/keyboard
  const dropdownRef = useRef(null);
  useEffect(() => {
    if (showDropdown && dropdownRef.current) dropdownRef.current.focus();
  }, [showDropdown]);

  // ESC to close mobile menu
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') {
        setShowMenu(false);
        setShowDropdown(false);
      }
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  // Nav item active style
  const navLinkClass = ({ isActive }) =>
    `relative px-5 py-2 rounded-md transition-all font-semibold text-base 
     focus:outline-none focus:ring-2 focus:ring-primary
     ${isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'}`;

  // Logo shine + scale animation
  const [logoHover, setLogoHover] = useState(false);

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 z-50 backdrop-blur-[6px] bg-white/80 dark:bg-gray-900/90 transition-shadow py-2 ${isScrolled ? 'shadow-md' : ''}`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group select-none"
          tabIndex={0}
          aria-label="Эхлэл"
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
        >
          <motion.img
            src={assets.logo}
            alt="logo"
            className="h-10 w-10"
            animate={logoHover ? { scale: 1.12, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            style={{ filter: logoHover ? 'drop-shadow(0 0 10px #a5b4fcbb)' : 'none' }}
          />
          {/* Shine effect */}
          {logoHover && (
            <motion.span
              className="absolute left-4 top-3 w-7 h-6 pointer-events-none"
              initial={{ x: -32, rotate: -30, opacity: 0.4 }}
              animate={{ x: 35, rotate: 25, opacity: 0.9 }}
              exit={{ x: 0, opacity: 0 }}
              transition={{ duration: 0.7, repeat: 0 }}
              style={{
                background: 'linear-gradient(105deg,rgba(255,255,255,0.7) 0%,rgba(255,255,255,0.05) 80%)',
                borderRadius: 6,
                filter: 'blur(3px)'
              }}
            />
          )}
          <span className="text-xl font-bold text-gray-800 dark:text-white transition group-hover:text-primary">Сэтгэл зүй</span>
        </Link>

        {/* Navbar links */}
        <ul className="hidden md:flex items-center lg:gap-8 gap-4 relative">
          {navLinks.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={navLinkClass}
              tabIndex={0}
              aria-current={window.location.pathname === path ? "page" : undefined}
              aria-label={label}
            >
              {({ isActive }) => (
                <span className="relative flex flex-col items-center">
                  <span
                    className={`transition group-hover:font-extrabold ${
                      isActive ? "font-extrabold" : ""
                    }`}
                  >
                    {label}
                  </span>
                  {/* Animated underline */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 w-full h-[2.5px] rounded bg-primary"
                      transition={{ type: "spring", stiffness: 350, damping: 22 }}
                    />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </ul>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {token && (
            <button
              onClick={() => setShowChat(true)}
              className="btn btn-primary"
              tabIndex={0}
              aria-label="Чат эхлүүлэх"
            >
              Чат эхлүүлэх
            </button>
          )}

          {token && userData ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(prev => !prev)}
                className="flex items-center gap-2 focus:outline-none"
                aria-label="User menu"
                tabIndex={0}
              >
                <motion.img
                  src={userData.image}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border-2 border-indigo-200 group-hover:border-indigo-500 transition"
                  whileHover={{ scale: 1.14, borderColor: "#a5b4fc" }}
                />
                <span className="hidden md:inline text-gray-800 dark:text-gray-200 font-semibold hover:text-primary transition group-hover:text-primary">
                  {userData.name.split(' ')[0]}
                </span>
                <FaChevronDown className="text-gray-600" />
              </button>
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    ref={dropdownRef}
                    tabIndex={0}
                    initial={{ opacity: 0, scale: 0.94, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: -10 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-2 z-50 border"
                    onBlur={e => {
                      if (!e.currentTarget.contains(e.relatedTarget)) setShowDropdown(false);
                    }}
                  >
                    {/* Dropdown Arrow */}
                    <span className="absolute -top-2 right-8 w-4 h-4 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 rotate-45 z-0" />
                    <Link to="/my-profile" className="block px-5 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition" tabIndex={0}>Миний профайл</Link>
                    <Link to="/my-appointments" className="block px-5 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition" tabIndex={0}>Цаг захиалгууд</Link>
                    <Link to="/saved-advice" className="block px-5 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition" tabIndex={0}>Хадгалсан зөвлөгөө</Link>
                    <button onClick={logout} className="w-full text-left px-5 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition" tabIndex={0}>Гарах</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="btn btn-outline btn-primary"
              tabIndex={0}
              aria-label="Нэвтрэх"
            >
              Нэвтрэх
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setShowMenu(prev => !prev)} className="md:hidden focus:outline-none" aria-label="Цэс">
          {showMenu ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed inset-0 bg-white dark:bg-gray-900 z-40 p-6 flex flex-col overflow-y-auto"
            tabIndex={0}
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between mb-8">
              <Link to="/" onClick={() => setShowMenu(false)} className="flex items-center gap-2">
                <img src={assets.logo} alt="logo" className="h-8 w-8" />
                <span className="text-xl font-bold text-gray-800 dark:text-white">Сэтгэл зүй</span>
              </Link>
              <button onClick={() => setShowMenu(false)} className="focus:outline-none" aria-label="Цэс хаах">
                <FaTimes size={24} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto">
              <ul className="space-y-5 text-lg font-semibold">
                {navLinks.map(({ path, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    className={navLinkClass}
                    onClick={() => setShowMenu(false)}
                    tabIndex={0}
                    aria-label={label}
                  >
                    {label}
                  </NavLink>
                ))}
              </ul>
            </nav>
            <div className="mt-auto">
              {token && (
                <button
                  onClick={() => { setShowChat(true); setShowMenu(false); }}
                  className="w-full mb-4 btn btn-primary"
                  tabIndex={0}
                  aria-label="Чат эхлүүлэх"
                >
                  Чат эхлүүлэх
                </button>
              )}
              {token ? (
                <button onClick={() => { logout(); setShowMenu(false); }} className="w-full btn btn-outline" tabIndex={0}>Гарах</button>
              ) : (
                <button onClick={() => { navigate('/login'); setShowMenu(false); }} className="w-full btn btn-outline btn-primary" tabIndex={0}>Нэвтрэх</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
