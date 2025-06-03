import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaUserCircle, FaBell, FaBars } from 'react-icons/fa'

const Navbar = () => {
  const { dToken, setDToken, doctor } = useContext(DoctorContext)
  const { aToken, setAToken, admin } = useContext(AdminContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [showConfirm, setShowConfirm] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const isAdmin = !!aToken

  const pageName = {
    '/': 'Хяналтын самбар',
    '/doctors': 'Эмч нар',
    '/appointments': 'Захиалгууд',
    '/quiz': 'Тестүүд',
    '/profile': 'Профайл'
  }[location.pathname] || ''

  const logout = () => setShowConfirm(true)
  const doLogout = () => {
    setShowConfirm(false)
    navigate('/')
    if (dToken) { setDToken(''); localStorage.removeItem('dToken') }
    if (aToken) { setAToken(''); localStorage.removeItem('aToken') }
  }

  const handleMenuToggle = () => setMenuOpen(!menuOpen)

  return (
    <header className={`sticky top-0 z-50 flex items-center justify-between px-4 sm:px-10 py-3 shadow-lg bg-white dark:bg-gray-900 transition-all`}>
      
      {/* Лого & Хуудасны нэр */}
      <div className="flex items-center gap-4">
        <img
          onClick={() => navigate('/')}
          src={assets.admin_logo}
          alt="Лого"
          className="w-16 sm:w-24 cursor-pointer transition-transform hover:scale-105 hover:shadow-xl"
        />
        <span className="hidden sm:inline-block text-base font-medium text-gray-700 dark:text-gray-200 ml-3">
          {pageName}
        </span>
      </div>

      {/* Mobile цэс товч */}
      <button
        className="sm:hidden text-xl px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={handleMenuToggle}
        aria-label="Menu"
      >
        <FaBars />
      </button>

      {/* Баруун хэсэг */}
      <div className={`flex items-center gap-3
        ${menuOpen ? "absolute right-4 top-16 bg-white dark:bg-gray-900 rounded-xl p-5 shadow-lg flex-col sm:static sm:bg-transparent sm:dark:bg-transparent sm:p-0 sm:flex-row sm:shadow-none" : "sm:flex"}
        ${menuOpen ? "" : "hidden sm:flex"}
      `}>

        {/* Мэдэгдэл (зөвхөн админ) */}
        {isAdmin && (
          <button className="relative group px-2 py-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900 transition">
            <FaBell className="text-blue-500 text-lg" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            <span className="sr-only">Notifications</span>
          </button>
        )}

        {/* Гарах товч */}
        <button
          onClick={logout}
          className="ml-2 bg-red-500 hover:bg-red-600 transition-all text-white text-sm sm:text-base px-5 py-2 rounded-full shadow-md active:scale-95"
        >
          Гарах
        </button>
      </div>

      {/* Гарах баталгаажуулалт */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center max-w-xs w-full border border-gray-200 dark:border-gray-700">
            <div className="mb-3">
              <FaUserCircle className="text-4xl text-red-400 mx-auto mb-2" />
              <p className="font-semibold text-lg text-gray-700 dark:text-gray-200 mb-2">Гарахдаа итгэлтэй байна уу?</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Таны сесс устах болно.</p>
            </div>
            <div className="flex gap-4 mt-2 w-full">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition"
              >
                Болих
              </button>
              <button
                onClick={doLogout}
                className="flex-1 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold transition"
              >
                Тийм, гарах
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
