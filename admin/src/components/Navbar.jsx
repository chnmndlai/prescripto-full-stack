import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)
  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    if (dToken) {
      setDToken('')
      localStorage.removeItem('dToken')
    }
    if (aToken) {
      setAToken('')
      localStorage.removeItem('aToken')
    }
  }

  return (
    <header className="flex justify-between items-center px-4 sm:px-10 py-4 shadow-md bg-white">
      {/* Зүүн талын лого ба хэрэглэгчийн төрөл */}
      <div className="flex items-center gap-3">
        <img 
          onClick={() => navigate('/')} 
          src={assets.admin_logo} 
          alt="Лого" 
          className="w-16 sm:w-24 cursor-pointer" // ⬅️ ЖИЖГЭРҮҮЛСЭН
        />
        <span className="text-sm sm:text-base px-3 py-1 border border-gray-400 text-gray-600 rounded-full">
          {aToken ? 'Админ' : 'Эмч'}
        </span>
      </div>

      {/* Баруун талын logout товч */}
      <div className="flex items-center gap-4">
        <button 
          onClick={logout} 
          className="bg-red-500 hover:bg-red-600 transition text-white text-sm sm:text-base px-6 py-2 rounded-full"
        >
          Гарах
        </button>
      </div>
    </header>
  )
}

export default Navbar
