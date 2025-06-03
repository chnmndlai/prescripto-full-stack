// src/components/TopDoctors.jsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FaStar, FaCommentDots, FaCalendarCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt'; // yarn add react-parallax-tilt

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const [selected, setSelected] = useState(null);

  const topDoctors = doctors?.slice(0, 8) || [];

  return (
    <section className="py-16 px-4 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-200">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-black mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-400">
          Онцлох эмч нар
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 mb-10">
          Манай системд хамгийн их захиалга авсан, итгэлтэй эмч нар.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-9">
          {topDoctors.map((item) => (
            <Tilt
              glareEnable
              glareMaxOpacity={0.2}
              tiltMaxAngleX={12}
              tiltMaxAngleY={12}
              key={item._id}
              className="bg-transparent"
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="relative bg-white rounded-3xl p-8 flex flex-col items-center text-center cursor-pointer shadow-2xl border border-gray-100 hover:border-indigo-400 transition-all duration-300"
                onClick={() => setSelected(item)}
              >
                {/* Shine animated */}
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-28 h-8 bg-gradient-to-r from-white/70 to-transparent rounded-full blur-md opacity-70 pointer-events-none animate-shine"></span>
                {/* Profile Image */}
                <motion.img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover bg-white/50"
                  whileHover={{ scale: 1.09, rotate: [0, 3, -2, 0] }}
                />
                <h3 className="text-xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-400">
                  {item.name}
                </h3>
                <div className="text-xs mt-1 flex flex-col gap-0.5 text-gray-500">
                  <span className="text-indigo-600 font-semibold">
                    {item.experience || 5} жил ажилласан
                  </span>
                  <span>{item.speciality}</span>
                </div>
                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mt-3 text-lg">
                  <FaStar className="text-yellow-400 drop-shadow" />
                  <span className="font-bold">{item.rating || '4.5'}</span>
                </div>
                {/* Action FAB (Chat/Book) */}
                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-2 shadow-lg flex items-center"
                    title="Чатлах"
                  >
                    <FaCommentDots />
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 shadow-lg flex items-center"
                    title="Цаг захиалах"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/appointment/${item._id}`);
                    }}
                  >
                    <FaCalendarCheck />
                  </button>
                </div>
                {/* Top badge */}
                {item.experience > 7 && (
                  <span className="absolute top-4 left-4 bg-gradient-to-r from-yellow-300 via-pink-400 to-indigo-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    Топ эмч
                  </span>
                )}
              </motion.div>
            </Tilt>
          ))}
        </div>

        {/* Modal drawer */}
        <AnimatePresence>
          {selected && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            >
              <motion.div
                className="bg-white dark:bg-gray-900 rounded-3xl p-8 w-[95vw] max-w-md relative shadow-2xl border"
                initial={{ scale: 0.93, y: 60, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.93, y: 60, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-indigo-600"
                  onClick={() => setSelected(null)}
                >
                  ×
                </button>
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={selected.image}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                    alt={selected.name}
                  />
                  <h3 className="text-2xl font-black">{selected.name}</h3>
                  <div className="flex items-center gap-1 text-lg text-yellow-500">
                    <FaStar /> {selected.rating || '4.5'}
                  </div>
                  <div className="text-indigo-600 font-semibold">
                    {selected.experience || 5} жил ажилласан
                  </div>
                  <div className="text-gray-600 dark:text-gray-200">
                    {selected.speciality}
                  </div>
                  <button
                    className="mt-4 bg-indigo-500 hover:bg-indigo-700 text-white px-7 py-3 rounded-full font-bold text-base shadow transition"
                    onClick={() => {
                      navigate(`/appointment/${selected._id}`);
                      setSelected(null);
                    }}
                  >
                    Цаг захиалах
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TopDoctors;
