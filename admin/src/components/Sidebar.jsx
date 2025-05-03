import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';
import { AdminContext } from '../context/AdminContext';
import { assets } from '../assets/assets';
import adviseIcon from '../assets/advise.svg';
import { MdLibraryAdd } from 'react-icons/md';
import { MdListAlt } from 'react-icons/md'; // ✨ Шинэ икон — тест жагсаалт

const Sidebar = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);

  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-3 py-3.5 px-4 md:px-6 lg:px-8 xl:px-10 cursor-pointer transition 
     ${isActive ? 'bg-blue-50 border-r-4 border-primary font-semibold text-primary' : 'hover:bg-gray-100'}`;

  const SidebarLink = ({ to, icon, label }) => (
    <li>
      <NavLink to={to} className={navLinkStyle}>
        {typeof icon === 'string' ? (
          <img className="w-5 h-5" src={icon} alt={label} />
        ) : (
          <span className="text-xl">{icon}</span>
        )}
        <p className="hidden md:block">{label}</p>
      </NavLink>
    </li>
  );

  return (
    <aside className="min-h-screen bg-white border-r shadow-sm w-64">
      <nav className="mt-5 text-gray-700">
        {aToken && (
          <ul>
            <SidebarLink to="/admin-dashboard" icon={assets.home_icon} label="Хяналтын самбар" />
            <SidebarLink to="/all-appointments" icon={assets.appointment_icon} label="Захиалгууд" />
            <SidebarLink to="/add-doctor" icon={assets.add_icon} label="Эмч нэмэх" />
            <SidebarLink to="/doctor-list" icon={assets.people_icon} label="Эмчийн жагсаалт" />
          </ul>
        )}

        {dToken && (
          <ul>
            <SidebarLink to="/doctor-dashboard" icon={assets.home_icon} label="Хяналтын самбар" />
            <SidebarLink to="/doctor-appointments" icon={assets.appointment_icon} label="Миний захиалгууд" />
            <SidebarLink to="/doctor-profile" icon={assets.people_icon} label="Профайл" />
            <SidebarLink to="/doctor-advice" icon={adviseIcon} label="Зөвлөгөө" />
            <SidebarLink to="/doctor/add-quiz" icon={<MdLibraryAdd />} label="Тест нэмэх" />
            <SidebarLink to="/doctor/quizzes" icon={<MdListAlt />} label="Миний тестүүд" /> {/* 🆕 */}
          </ul>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
