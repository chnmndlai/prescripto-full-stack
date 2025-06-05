import React, { useState } from 'react';
import { specialityData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

const SpecialityMenu = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  return (
    <div
      id="speciality"
      className="flex flex-col items-center gap-4 py-8 text-[#262626] px-4"
    >
      <h1 className="text-3xl font-semibold">Мэргэжлээр хайх</h1>
      <p className="sm:w-1/2 text-center text-sm text-gray-600 mb-1">
        Найдвартай, туршлагатай эмч нараас мэргэжлээр нь шүүж, цаг захиалаарай.
      </p>
      <div className="flex flex-wrap justify-center gap-10 pt-10 w-full">
        {specialityData.map((item, index) => (
          <Tilt
            glareEnable
            glareMaxOpacity={0.16}
            tiltMaxAngleX={12}
            tiltMaxAngleY={12}
            scale={1.07}
            transitionSpeed={550}
            perspective={1000}
            className="bg-transparent"
            key={index}
          >
            <motion.div
              className={`
                relative flex flex-col items-center text-sm w-36 cursor-pointer group
                rounded-2xl py-8 px-4 glass-bg
                transition-all duration-300
                shadow-xl border border-white/60
                bg-white/60 backdrop-blur
              `}
              whileHover={{ scale: 1.12, boxShadow: '0 10px 34px #a5b4fc4a', borderColor: '#8a63d2' }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => setSelected(item)}
              tabIndex={0}
              role="button"
              aria-label={`${item.speciality} дэлгэрэнгүй`}
              style={{ minHeight: 200, minWidth: 135 }}
            >
              {/* Icon */}
              <div className="w-20 h-20 bg-white/70 backdrop-blur rounded-full flex items-center justify-center shadow-lg mb-3 border-2 border-white/80 transition">
                <img className="w-12 h-12 object-contain" src={item.image} alt={item.speciality} />
              </div>
              {/* Speciality нэр */}
              <p className="mt-1 text-center font-bold text-base text-indigo-600 group-hover:text-[#8a63d2] transition leading-tight min-h-[48px]">
                {item.speciality}
              </p>
              {/* "Цаг захиалах" товч */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                className={`
                  opacity-0 group-hover:opacity-100 focus:opacity-100
                  transition-all duration-300
                  absolute bottom-[-2.5rem] left-1/2 -translate-x-1/2
                  bg-indigo-600 text-white rounded-full text-xs px-6 py-2
                  shadow-md font-semibold hover:bg-indigo-700 active:bg-indigo-800
                `}
                onClick={e => {
                  e.stopPropagation();
                  navigate(`/doctors/${item.speciality}`);
                }}
                tabIndex={-1}
              >
                Цаг захиалах
              </motion.button>
            </motion.div>
          </Tilt>
        ))}
      </div>

      {/* Modal for details */}
      {selected && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelected(null)}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-8 w-[95vw] max-w-md relative"
            initial={{ scale: 0.92, y: 60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 60, opacity: 0 }}
            transition={{ duration: 0.24 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-indigo-600 text-xl font-bold"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-[#f3f4f6] rounded-full flex items-center justify-center shadow">
                <img className="w-10 h-10 object-contain" src={selected.image} alt={selected.speciality} />
              </div>
              <h3 className="text-xl font-bold text-center text-[#8a63d2]">{selected.speciality}</h3>
              <p className="text-gray-600 text-center mb-3">
                {selected.description || 'Тайлбар байхгүй'}
              </p>
              <button
                className="bg-indigo-600 text-white rounded-full px-8 py-2 text-base font-semibold hover:bg-indigo-700 shadow transition"
                onClick={() => {
                  navigate(`/doctors/${selected.speciality}`);
                  setSelected(null);
                }}
              >
                Цаг захиалах
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SpecialityMenu;
