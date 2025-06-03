import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaPlayCircle, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { assets } from '../assets/assets';
import introVideo from '../assets/intro.mp4'; // assets сангаас импортлоно

const VIDEO_URL = introVideo;



const Header = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <header className="relative bg-gradient-to-br from-indigo-100 via-white to-pink-100 rounded-2xl overflow-hidden shadow-xl py-8 px-4 sm:px-10 lg:px-20 my-10">
      {/* Tagline & Content */}
      <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="md:w-1/2 flex flex-col gap-5"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2 leading-tight">
            Таныг ойлгох, <span className="text-indigo-600">мэргэжлийн баг хамт олон</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-2">
            Сэтгэл зүйн тусламж, зөвлөгөө, онлайн уулзалтыг хамгийн хялбар, аюулгүй, итгэлтэйгээр.
          </p>
          <div className="flex items-center gap-2 mt-1 text-gray-500">
            <FaCheckCircle className="text-green-500" />
            500+ итгэлтэй хэрэглэгч
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => navigate('/doctors')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold shadow transition"
            >
              Цаг захиалах
            </button>
            <button
              onClick={() => navigate('/quiz')}
              className="bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-full font-medium shadow transition"
            >
              Сэтгэлзүйн тест бөглөх
            </button>
          </div>
          {/* Video intro button */}
          <button
            className="flex items-center gap-2 mt-7 px-5 py-3 rounded-xl bg-white/80 hover:bg-indigo-100 font-bold text-indigo-700 shadow-md transition text-lg w-max"
            onClick={() => setShowModal(true)}
          >
            <FaPlayCircle className="text-indigo-600 text-2xl" />
            Танилцуулга видео үзэх
          </button>
        </motion.div>
        {/* Right (thumbnail or image) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: imgLoaded ? 1 : 0, y: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 relative flex justify-center"
        >
          {!imgLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl" />}
          <img
            src={assets.header_img}
            alt="Сэтгэл зүйч баг"
            onLoad={() => setImgLoaded(true)}
            className={`w-full max-w-md rounded-2xl shadow-2xl border-2 border-white/40 transition-opacity duration-700 ${imgLoaded ? 'opacity-100 relative' : 'opacity-0 absolute'}`}
          />
          {/* Play overlay thumbnail for small screens */}
          <button
            className="absolute bottom-6 right-6 md:hidden flex items-center gap-1 px-4 py-2 bg-white/70 rounded-full shadow-md font-semibold text-indigo-700"
            onClick={() => setShowModal(true)}
          >
            <FaPlayCircle className="text-indigo-600 text-xl" /> Видео үзэх
          </button>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-[95vw] p-4"
              initial={{ scale: 0.92, y: 60, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 60, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-indigo-600"
                onClick={() => setShowModal(false)}
                aria-label="Close video"
              >
                <FaTimes />
              </button>
              <video
                src={VIDEO_URL}
                controls
                autoPlay
                className="w-full rounded-xl bg-black"
                style={{ minHeight: 200 }}
              />
              <div className="text-center text-gray-700 font-semibold mt-3">Танилцуулга видео</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
