// src/pages/Doctors.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaStar, FaRegCheckCircle, FaComment, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

// --- Doctor Card ---
const DoctorCard = ({ doc, onMore }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="relative flex flex-col bg-white rounded-2xl shadow-lg border overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary min-h-[340px]"
      onClick={() => onMore(doc)}
    >
      <div className="relative">
        <img
          src={doc.image}
          alt={doc.name}
          loading="lazy"
          className="w-full object-contain rounded-t-2xl"
        />
        {/* Availability & Certified */}
        <div className="absolute top-3 left-3 flex items-center gap-1">
          <span
            className={`w-3 h-3 rounded-full border-2 border-white ${
              doc.available ? 'bg-green-400' : 'bg-gray-300'
            }`}
            title={doc.available ? 'Online' : 'Offline'}
          />
          {doc.certified && (
            <FaRegCheckCircle className="text-primary" title="Certified" />
          )}
        </div>
        {doc.topDoctor && (
          <div className="absolute top-3 right-3 bg-yellow-300 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold shadow">
            🏅 Шилдэг
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col p-4">
        <h3 className="text-xl font-semibold text-center truncate mb-1 text-gray-900">
          {doc.name}
        </h3>
        <div className="text-center text-sm text-gray-500 mb-1">
          {doc.speciality}
        </div>
        <div className="text-center text-xs text-gray-400 mb-2">
          {doc.experience} жил туршлагатай
        </div>
        <div className="flex justify-center items-center gap-1 text-yellow-400 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar
              key={i}
              className={i < Math.round(doc.rating || 4.5) ? '' : 'text-gray-300'}
            />
          ))}
          <span className="ml-1 text-xs text-gray-600">
            {(doc.rating || 4.5).toFixed(1)}
          </span>
        </div>
        <div className="flex justify-center gap-4 mt-auto">
          <button
            className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center"
            title="Чатлах"
            onClick={e => {
              e.stopPropagation();
              /* TODO: implement chat navigation */
            }}
          >
            <FaComment />
          </button>
          <button
            className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center"
            title="Цаг авах"
            onClick={e => {
              e.stopPropagation();
              navigate(`/appointment/${doc._id}`);
            }}
          >
            <FaCalendarAlt />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Doctor Modal (Info only) ---
const DoctorModal = ({ doctor, onClose }) => {
  if (!doctor) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl text-gray-500 hover:text-gray-800"
        >
          ×
        </button>
        {/* Breadcrumbs */}
        <nav className="text-sm mb-4">
          <ul className="flex gap-2 text-gray-600">
            <li>
              <Link to="/" className="hover:underline">
                Нүүр
              </Link>{' '}
              /
            </li>
            <li>
              <Link to="/doctors" className="hover:underline">
                Эмч хайх
              </Link>{' '}
              /
            </li>
            <li className="text-gray-900">{doctor.speciality}</li>
          </ul>
        </nav>
        {/* Profile Info */}
        <div className="flex flex-col items-center">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-28 h-28 rounded-full object-contain mb-4"
          />
          <h2 className="text-2xl font-semibold mb-1">{doctor.name}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>{doctor.speciality}</span>
            {doctor.certified && <FaRegCheckCircle />}
          </div>
          <div className="text-xs text-gray-400 mb-4">
            {doctor.experience} жил туршлагатай
          </div>
          <p className="text-gray-700 text-sm">
            {doctor.bio || 'Дэлгэрэнгүй мэдээлэл удахгүй...'}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main Doctors List ---
const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [filtered, setFiltered] = useState([]);
  const [modalDoc, setModalDoc] = useState(null);

  useEffect(() => {
    if (!doctors) return;
    let list = [...doctors];
    const spec = decodeURIComponent(speciality || '').toLowerCase();
    if (spec && spec !== 'all doctors') {
      list = list.filter(d => d.speciality.toLowerCase() === spec);
    }
    setFiltered(list);
  }, [doctors, speciality]);

  const specialties = [
    'All Doctors',
    'Клиник сэтгэл зүйч',
    'Сэтгэцийн эмч',
    'Хүүхдийн сэтгэл зүйч',
    'Зан үйл судлаач',
    'Сэтгэл засалч / зөвлөх',
    'Гэр бүл, хосын сэтгэл зүйч',
  ];

  return (
    <section className="px-4 py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto flex gap-8">
        {/* Sidebar */}
        <div className="w-64 space-y-2 sticky top-4">
          {specialties.map((spec, i) => {
            const active =
              decodeURIComponent(speciality || 'All Doctors').toLowerCase() ===
              spec.toLowerCase();
            return (
              <button
                key={i}
                onClick={() =>
                  navigate(`/doctors/${encodeURIComponent(spec)}`)
                }
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  active
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {spec === 'All Doctors' ? 'Бүх эмч нар' : spec}
              </button>
            );
          })}
        </div>

        {/* Grid or loader */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {!doctors
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse h-80 bg-white rounded-2xl shadow"
                />
              ))
            : filtered.length > 0
            ? filtered.map(doc => (
                <DoctorCard key={doc._id} doc={doc} onMore={setModalDoc} />
              ))
            : (
                <p className="col-span-full text-center text-gray-500">
                  Эмч олдсонгүй.
                </p>
              )}
        </div>

        {/* Modal */}
        {modalDoc && (
          <DoctorModal doctor={modalDoc} onClose={() => setModalDoc(null)} />
        )}
      </div>
    </section>
  );
};

export default Doctors;
