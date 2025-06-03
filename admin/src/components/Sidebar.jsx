import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';
import { AdminContext } from '../context/AdminContext';
import { assets } from '../assets/assets';
import adviseIcon from '../assets/advise.svg';
import {
  MdLibraryAdd,
  MdListAlt
} from 'react-icons/md';

const SidebarLink = ({ to, icon, label, badge, notify, collapsed }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 py-3.5 px-3 rounded-xl transition group
        ${isActive
          ? 'bg-blue-50 border-l-4 border-blue-500 font-bold text-blue-700 shadow-lg scale-[1.03]'
          : 'hover:bg-blue-50 hover:scale-[1.02]'}
        ${collapsed ? 'justify-center px-2' : 'pl-5'}`
      }
    >
      <span className={`text-2xl relative transition-all duration-150 group-hover:scale-110
        ${notify ? 'animate-bounce' : ''}`}>
        {icon}
        {notify && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </span>
      {!collapsed && <span className="ml-2">{label}</span>}
      {!collapsed && badge && (
        <span className="ml-auto text-xs bg-blue-500 text-white px-2 rounded-full">{badge}</span>
      )}
    </NavLink>
  </li>
);

const Section = ({ title, collapsed }) =>
  !collapsed && (
    <div className="uppercase tracking-wide text-xs text-gray-400 font-semibold px-5 pt-5 pb-2">
      {title}
    </div>
  );

const Sidebar = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-screen bg-white shadow-2xl border-r transition-all duration-300
      ${collapsed ? 'w-20' : 'w-64'} flex flex-col justify-start
      rounded-tr-3xl rounded-br-3xl`}
      style={{ minWidth: collapsed ? '5rem' : '16rem' }}
    >
      <nav className="mt-2 text-gray-700">
        {aToken && (
          <>
            <Section title="Удирдлага" collapsed={collapsed} />
            <ul className="px-2 space-y-1">
              <SidebarLink
                to="/admin-dashboard"
                icon={<img src={assets.home_icon} alt="" className="w-5 h-5" />}
                label="Хяналтын самбар"
                collapsed={collapsed}
                notify
              />
              <SidebarLink
                to="/all-appointments"
                icon={<img src={assets.appointment_icon} alt="" className="w-5 h-5" />}
                label="Захиалгууд"
                collapsed={collapsed}
              />
              <SidebarLink
                to="/add-doctor"
                icon={<img src={assets.add_icon} alt="" className="w-5 h-5" />}
                label="Эмч нэмэх"
                collapsed={collapsed}
              />
              <SidebarLink
                to="/doctor-list"
                icon={<img src={assets.people_icon} alt="" className="w-5 h-5" />}
                label="Эмчийн жагсаалт"
                collapsed={collapsed}
                badge="7"
              />
            </ul>
          </>
        )}

        {dToken && (
          <>
            <Section title="Миний цэс" collapsed={collapsed} />
            <ul className="px-2 space-y-1">
              <SidebarLink
                to="/doctor-dashboard"
                icon={<img src={assets.home_icon} alt="" className="w-5 h-5" />}
                label="Хяналтын самбар"
                collapsed={collapsed}
                notify
              />
              <SidebarLink
                to="/doctor-appointments"
                icon={<img src={assets.appointment_icon} alt="" className="w-5 h-5" />}
                label="Миний захиалгууд"
                collapsed={collapsed}
                badge="2"
              />
              <SidebarLink
                to="/doctor-profile"
                icon={<img src={assets.people_icon} alt="" className="w-5 h-5" />}
                label="Профайл"
                collapsed={collapsed}
              />
              <SidebarLink
                to="/doctor-advice"
                icon={<img src={adviseIcon} alt="" className="w-5 h-5" />}
                label="Зөвлөгөө"
                collapsed={collapsed}
              />
              <SidebarLink
                to="/doctor/add-quiz"
                icon={<MdLibraryAdd />}
                label="Тест нэмэх"
                collapsed={collapsed}
              />
              <SidebarLink
                to="/doctor/quizzes"
                icon={<MdListAlt />}
                label="Миний тестүүд"
                collapsed={collapsed}
                badge="5"
              />
            </ul>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
